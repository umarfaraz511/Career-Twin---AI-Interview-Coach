import PyPDF2
import pdfplumber
import re
from typing import Dict, List
from app.models.schemas import ResumeData
from app.utils.llm_client import llm_client
import traceback

class ResumeParser:
    
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        """Extract text from PDF using multiple methods"""
        text = ""
        
        # Try pdfplumber first (better for complex layouts)
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"pdfplumber failed: {e}")
            # Fallback to PyPDF2
            try:
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
            except Exception as e2:
                print(f"PyPDF2 also failed: {e2}")
                raise Exception("Failed to extract text from PDF")
        
        if not text.strip():
            raise Exception("No text found in PDF")
            
        return text.strip()
    
    @staticmethod
    def extract_contact_info(text: str) -> Dict:
        """Extract name, email, phone using regex"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        phone_pattern = r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}'
        
        email = re.findall(email_pattern, text)
        phone = re.findall(phone_pattern, text)
        
        # Extract name (usually first line or before email)
        lines = text.split('\n')
        name = lines[0].strip() if lines else "Unknown"
        
        return {
            "name": name,
            "email": email[0] if email else None,
            "phone": phone[0] if phone else None
        }
    
    @staticmethod
    def parse_with_llm(text: str) -> ResumeData:
        """Use LLM to intelligently parse resume"""
        try:
            system_message = """You are an expert resume parser. Extract structured information from resumes.
            Return a JSON object with these fields:
            - name: string
            - email: string
            - phone: string
            - skills: array of strings (technical skills, tools, technologies)
            - experience: array of objects with {title, company, duration, description}
            - education: array of objects with {degree, institution, year}
            - projects: array of objects with {name, description, technologies}
            - summary: string (professional summary)
            
            Be thorough and extract all relevant information."""
            
            prompt = f"""Parse this resume and extract all information in JSON format:

{text}

Return ONLY the JSON object, no additional text."""
            
            print("Calling OpenAI API for resume parsing...")
            response = llm_client.generate_completion(
                prompt=prompt,
                system_message=system_message,
                temperature=0.3
            )
            print(f"OpenAI response received: {response[:200]}...")
            
            # Parse JSON response
            import json
            # Clean response (remove markdown code blocks if present)
            clean_response = response.strip()
            if clean_response.startswith('```json'):
                clean_response = clean_response[7:]
            if clean_response.startswith('```'):
                clean_response = clean_response[3:]
            if clean_response.endswith('```'):
                clean_response = clean_response[:-3]
            
            parsed_data = json.loads(clean_response.strip())
            
            # Create ResumeData object
            resume_data = ResumeData(
                name=parsed_data.get('name'),
                email=parsed_data.get('email'),
                phone=parsed_data.get('phone'),
                skills=parsed_data.get('skills', []),
                experience=parsed_data.get('experience', []),
                education=parsed_data.get('education', []),
                projects=parsed_data.get('projects', []),
                summary=parsed_data.get('summary'),
                raw_text=text
            )
            
            print(f"Resume parsed successfully: {resume_data.name}")
            return resume_data
            
        except Exception as e:
            print(f"Error parsing with LLM: {e}")
            print(traceback.format_exc())
            # Fallback: return basic data
            contact = ResumeParser.extract_contact_info(text)
            return ResumeData(
                name=contact['name'],
                email=contact['email'],
                phone=contact['phone'],
                raw_text=text,
                skills=[],
                experience=[],
                education=[],
                projects=[]
            )
    
    @staticmethod
    def create_profile_embedding(resume_data: ResumeData) -> List[float]:
        """Create embedding representation of candidate profile"""
        try:
            # Combine all relevant text for embedding
            profile_text = f"""
            Skills: {', '.join(resume_data.skills)}
            Summary: {resume_data.summary or ''}
            Experience: {' '.join([exp.get('description', '') for exp in resume_data.experience])}
            Projects: {' '.join([proj.get('description', '') for proj in resume_data.projects])}
            """
            
            print("Creating embeddings...")
            embeddings = llm_client.generate_embeddings(profile_text.strip())
            print(f"Embeddings created: {len(embeddings)} dimensions")
            return embeddings
        except Exception as e:
            print(f"Error creating embeddings: {e}")
            # Return dummy embeddings if fails
            return [0.0] * 1536

resume_parser = ResumeParser()
