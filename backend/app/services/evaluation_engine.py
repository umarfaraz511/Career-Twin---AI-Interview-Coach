from typing import List, Dict
from app.models.schemas import InterviewAnswer, EvaluationScore, ResumeData
from app.utils.llm_client import llm_client
import json
import numpy as np

class EvaluationEngine:
    
    def evaluate_answer(self, answer: InterviewAnswer, resume_data: ResumeData, 
                       role: str) -> Dict[str, float]:
        """Evaluate a single interview answer"""
        
        system_message = """You are an expert technical interviewer and HR professional. 
        Evaluate interview answers on these criteria (0-100 scale):
        1. communication_clarity: How clear and well-structured is the answer?
        2. technical_accuracy: How technically sound and accurate is the content?
        3. confidence: How confident does the candidate appear?
        4. relevance: How relevant is the answer to the question?
        
        Return ONLY a JSON object with these four scores."""
        
        prompt = f"""Evaluate this interview answer:

Question ({answer.category}): {answer.question}
Answer: {answer.answer}

Role: {role}
Candidate Background: {', '.join(resume_data.skills[:10])}

Return JSON with scores (0-100):
{{"communication_clarity": 0, "technical_accuracy": 0, "confidence": 0, "relevance": 0}}"""
        
        response = llm_client.generate_completion(
            prompt=prompt,
            system_message=system_message,
            temperature=0.3
        )
        
        try:
            # Clean and parse response
            clean_response = response.strip()
            if clean_response.startswith('```json'):
                clean_response = clean_response[7:]
            if clean_response.startswith('```'):
                clean_response = clean_response[3:]
            if clean_response.endswith('```'):
                clean_response = clean_response[:-3]
            
            scores = json.loads(clean_response.strip())
            
            # Ensure all scores are within 0-100
            for key in scores:
                scores[key] = max(0, min(100, float(scores[key])))
            
            return scores
            
        except Exception as e:
            print(f"Error parsing evaluation: {e}")
            # Return default scores
            return {
                "communication_clarity": 50.0,
                "technical_accuracy": 50.0,
                "confidence": 50.0,
                "relevance": 50.0
            }
    
    def evaluate_session(self, answers: List[InterviewAnswer], resume_data: ResumeData, 
                        role: str) -> EvaluationScore:
        """Evaluate entire interview session"""
        
        if not answers:
            return EvaluationScore(
                communication_clarity=0.0,
                technical_accuracy=0.0,
                confidence_score=0.0,
                relevance_score=0.0,
                overall_score=0.0
            )
        
        # Evaluate each answer
        all_scores = []
        for answer in answers:
            scores = self.evaluate_answer(answer, resume_data, role)
            all_scores.append(scores)
        
        # Calculate averages
        avg_scores = {
            'communication_clarity': np.mean([s['communication_clarity'] for s in all_scores]),
            'technical_accuracy': np.mean([s['technical_accuracy'] for s in all_scores]),
            'confidence': np.mean([s['confidence'] for s in all_scores]),
            'relevance': np.mean([s['relevance'] for s in all_scores])
        }
        
        # Calculate overall score (weighted average)
        overall = (
            avg_scores['communication_clarity'] * 0.25 +
            avg_scores['technical_accuracy'] * 0.35 +
            avg_scores['confidence'] * 0.20 +
            avg_scores['relevance'] * 0.20
        )
        
        return EvaluationScore(
            communication_clarity=round(avg_scores['communication_clarity'], 2),
            technical_accuracy=round(avg_scores['technical_accuracy'], 2),
            confidence_score=round(avg_scores['confidence'], 2),
            relevance_score=round(avg_scores['relevance'], 2),
            overall_score=round(overall, 2)
        )
    
    def calculate_role_readiness(self, evaluation: EvaluationScore, 
                                resume_data: ResumeData, role: str) -> float:
        """Calculate overall readiness score for a specific role"""
        
        # Base score from evaluation
        base_score = evaluation.overall_score
        
        # Skill match bonus (0-10 points)
        skill_match = self._calculate_skill_match(resume_data.skills, role)
        
        # Experience bonus (0-5 points)
        experience_bonus = min(5, len(resume_data.experience) * 1.5)
        
        # Calculate final readiness score (0-100)
        readiness = min(100, base_score + skill_match + experience_bonus)
        
        return round(readiness, 2)
    
    def _calculate_skill_match(self, candidate_skills: List[str], role: str) -> float:
        """Calculate how well skills match the role"""
        
        # Define role-specific required skills
        role_skills = {
            "Software Engineer": ["python", "java", "javascript", "git", "api", "database"],
            "ML Engineer": ["python", "tensorflow", "pytorch", "machine learning", "deep learning", "data"],
            "Data Analyst": ["sql", "python", "excel", "tableau", "power bi", "statistics"],
            "Frontend Developer": ["javascript", "react", "html", "css", "typescript"],
            "Backend Developer": ["python", "java", "nodejs", "database", "api", "microservices"]
        }
        
        required_skills = role_skills.get(role, [])
        if not required_skills:
            return 5.0  # Default bonus
        
        # Count matching skills (case-insensitive)
        candidate_lower = [s.lower() for s in candidate_skills]
        matches = sum(1 for req in required_skills if any(req in skill for skill in candidate_lower))
        
        # Calculate bonus (0-10 points)
        skill_bonus = (matches / len(required_skills)) * 10
        
        return round(skill_bonus, 2)

evaluation_engine = EvaluationEngine()
