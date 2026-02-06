from typing import List, Dict
from app.models.schemas import InterviewQuestion, ResumeData
from app.utils.llm_client import llm_client
import json
import uuid

class InterviewSimulator:
    
    def __init__(self):
        self.question_templates = {
            "hr": [
                "Tell me about yourself",
                "Why do you want to work here?",
                "What are your greatest strengths?",
                "What are your weaknesses?",
                "Where do you see yourself in 5 years?"
            ],
            "technical": [
                "Explain your most complex project",
                "How do you approach problem-solving?",
                "What's your experience with [specific technology]?",
                "Describe a technical challenge you overcame"
            ],
            "behavioral": [
                "Tell me about a time you faced conflict in a team",
                "Describe a situation where you had to meet a tight deadline",
                "How do you handle criticism?",
                "Tell me about a failure and what you learned"
            ]
        }
    
    def generate_role_specific_questions(self, role: str, resume_data: ResumeData, 
                                        num_hr: int = 3, num_technical: int = 4, 
                                        num_behavioral: int = 3) -> List[InterviewQuestion]:
        """Generate personalized interview questions based on role and resume"""
        
        # Create context about candidate
        context = f"""
        Role: {role}
        Candidate Skills: {', '.join(resume_data.skills)}
        Experience Level: {len(resume_data.experience)} positions
        Recent Projects: {', '.join([p.get('name', '') for p in resume_data.projects[:3]])}
        """
        
        questions = []
        
        # Generate HR questions
        hr_prompt = f"""Generate {num_hr} HR/behavioral interview questions for a {role} position.
        
        Context about candidate:
        {context}
        
        Make questions relevant to their background. Return as JSON array of objects with:
        {{"question": "question text", "difficulty": "easy/medium/hard"}}"""
        
        hr_response = llm_client.generate_completion(hr_prompt, temperature=0.8)
        hr_questions = self._parse_questions_response(hr_response, "hr")
        questions.extend(hr_questions[:num_hr])
        
        # Generate Technical questions
        tech_prompt = f"""Generate {num_technical} technical interview questions for a {role} position.
        
        Context about candidate:
        {context}
        
        Focus on technologies they know: {', '.join(resume_data.skills[:10])}
        Mix difficulty levels. Return as JSON array of objects with:
        {{"question": "question text", "difficulty": "easy/medium/hard"}}"""
        
        tech_response = llm_client.generate_completion(tech_prompt, temperature=0.8)
        tech_questions = self._parse_questions_response(tech_response, "technical")
        questions.extend(tech_questions[:num_technical])
        
        # Generate Behavioral questions
        behavioral_prompt = f"""Generate {num_behavioral} behavioral (STAR method) interview questions for a {role} position.
        
        Context about candidate:
        {context}
        
        Make them scenario-based and relevant to the role. Return as JSON array of objects with:
        {{"question": "question text", "difficulty": "easy/medium/hard"}}"""
        
        behavioral_response = llm_client.generate_completion(behavioral_prompt, temperature=0.8)
        behavioral_questions = self._parse_questions_response(behavioral_response, "behavioral")
        questions.extend(behavioral_questions[:num_behavioral])
        
        return questions
    
    def _parse_questions_response(self, response: str, category: str) -> List[InterviewQuestion]:
        """Parse LLM response into InterviewQuestion objects"""
        try:
            # Clean response
            clean_response = response.strip()
            if clean_response.startswith('```json'):
                clean_response = clean_response[7:]
            if clean_response.startswith('```'):
                clean_response = clean_response[3:]
            if clean_response.endswith('```'):
                clean_response = clean_response[:-3]
            
            questions_data = json.loads(clean_response.strip())
            
            questions = []
            for q in questions_data:
                questions.append(InterviewQuestion(
                    question_id=str(uuid.uuid4()),
                    question=q['question'],
                    category=category,
                    difficulty=q.get('difficulty', 'medium')
                ))
            
            return questions
        except Exception as e:
            print(f"Error parsing questions: {e}")
            # Return fallback question
            return [InterviewQuestion(
                question_id=str(uuid.uuid4()),
                question=self.question_templates[category][0],
                category=category,
                difficulty="medium"
            )]
    
    def adaptive_follow_up(self, previous_answer: str, context: str) -> InterviewQuestion:
        """Generate adaptive follow-up question based on previous answer"""
        prompt = f"""Based on this interview answer, generate ONE relevant follow-up question.
        
        Previous Answer: {previous_answer}
        Context: {context}
        
        Make it probing and insightful. Return as JSON:
        {{"question": "follow-up question", "difficulty": "medium"}}"""
        
        response = llm_client.generate_completion(prompt, temperature=0.7)
        
        try:
            clean_response = response.strip()
            if clean_response.startswith('```json'):
                clean_response = clean_response[7:]
            if clean_response.startswith('```'):
                clean_response = clean_response[3:]
            if clean_response.endswith('```'):
                clean_response = clean_response[:-3]
            
            data = json.loads(clean_response.strip())
            
            return InterviewQuestion(
                question_id=str(uuid.uuid4()),
                question=data['question'],
                category="follow_up",
                difficulty=data.get('difficulty', 'medium')
            )
        except:
            return InterviewQuestion(
                question_id=str(uuid.uuid4()),
                question="Can you elaborate on that point?",
                category="follow_up",
                difficulty="medium"
            )

interview_simulator = InterviewSimulator()
