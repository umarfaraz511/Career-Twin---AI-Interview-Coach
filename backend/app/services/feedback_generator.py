from typing import List, Dict
from app.models.schemas import (
    InterviewAnswer, EvaluationScore, FeedbackReport, 
    ResumeData
)
from app.utils.llm_client import llm_client
from datetime import datetime
import json

class FeedbackGenerator:
    
    def generate_comprehensive_feedback(self, candidate_id: str, role: str,
                                       answers: List[InterviewAnswer],
                                       evaluation: EvaluationScore,
                                       resume_data: ResumeData) -> FeedbackReport:
        """Generate detailed feedback report"""
        
        # Prepare context
        answers_text = "\n\n".join([
            f"Q: {a.question}\nA: {a.answer}"
            for a in answers
        ])
        
        system_message = """You are a senior career coach and technical interviewer.
        Provide constructive, actionable feedback for job candidates."""
        
        prompt = f"""Analyze this interview performance and provide detailed feedback.

Role: {role}
Overall Score: {evaluation.overall_score}/100

Scores:
- Communication: {evaluation.communication_clarity}/100
- Technical Accuracy: {evaluation.technical_accuracy}/100
- Confidence: {evaluation.confidence_score}/100
- Relevance: {evaluation.relevance_score}/100

Candidate Skills: {', '.join(resume_data.skills[:15])}

Interview Answers:
{answers_text}

Provide feedback as JSON:
{{
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "skill_gaps": ["gap 1", "gap 2", "gap 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "improvement_roadmap": {{
    "week_1": ["action 1", "action 2"],
    "week_2_3": ["action 1", "action 2"],
    "month_1": ["action 1", "action 2"]
  }}
}}

Be specific, constructive, and actionable."""
        
        response = llm_client.generate_completion(
            prompt=prompt,
            system_message=system_message,
            temperature=0.7,
            max_tokens=2000
        )
        
        # Parse response
        try:
            clean_response = response.strip()
            if clean_response.startswith('```json'):
                clean_response = clean_response[7:]
            if clean_response.startswith('```'):
                clean_response = clean_response[3:]
            if clean_response.endswith('```'):
                clean_response = clean_response[:-3]
            
            feedback_data = json.loads(clean_response.strip())
            
            return FeedbackReport(
                candidate_id=candidate_id,
                timestamp=datetime.now(),
                role=role,
                evaluation=evaluation,
                strengths=feedback_data.get('strengths', []),
                weaknesses=feedback_data.get('weaknesses', []),
                skill_gaps=feedback_data.get('skill_gaps', []),
                recommendations=feedback_data.get('recommendations', []),
                improvement_roadmap=feedback_data.get('improvement_roadmap', {})
            )
            
        except Exception as e:
            print(f"Error parsing feedback: {e}")
            # Return default feedback
            return self._generate_default_feedback(
                candidate_id, role, evaluation, resume_data
            )
    
    def _generate_default_feedback(self, candidate_id: str, role: str,
                                   evaluation: EvaluationScore,
                                   resume_data: ResumeData) -> FeedbackReport:
        """Generate fallback feedback if LLM parsing fails"""
        
        strengths = []
        weaknesses = []
        
        # Analyze scores
        if evaluation.communication_clarity >= 70:
            strengths.append("Clear and articulate communication")
        else:
            weaknesses.append("Need to improve communication clarity")
        
        if evaluation.technical_accuracy >= 70:
            strengths.append("Strong technical knowledge")
        else:
            weaknesses.append("Need to strengthen technical fundamentals")
        
        if evaluation.confidence_score >= 70:
            strengths.append("Confident presentation")
        else:
            weaknesses.append("Need to build more confidence in responses")
        
        return FeedbackReport(
            candidate_id=candidate_id,
            timestamp=datetime.now(),
            role=role,
            evaluation=evaluation,
            strengths=strengths or ["Shows potential for growth"],
            weaknesses=weaknesses or ["Continue practicing interview skills"],
            skill_gaps=["Practice more technical interviews", "Study role-specific concepts"],
            recommendations=[
                "Practice mock interviews regularly",
                "Review technical concepts for the role",
                "Work on communication skills"
            ],
            improvement_roadmap={
                "week_1": ["Daily interview practice", "Review technical concepts"],
                "week_2_3": ["Mock interviews with peers", "Build portfolio projects"],
                "month_1": ["Apply learnings", "Track improvement"]
            }
        )
    
    def compare_sessions(self, current_report: FeedbackReport,
                        previous_reports: List[FeedbackReport]) -> Dict:
        """Compare current performance with previous sessions"""
        
        if not previous_reports:
            return {
                "is_first_session": True,
                "improvement": None
            }
        
        # Calculate improvement
        prev_score = previous_reports[-1].evaluation.overall_score
        current_score = current_report.evaluation.overall_score
        improvement = current_score - prev_score
        
        return {
            "is_first_session": False,
            "previous_score": prev_score,
            "current_score": current_score,
            "improvement": round(improvement, 2),
            "improvement_percentage": round((improvement / prev_score) * 100, 2) if prev_score > 0 else 0,
            "trend": "improving" if improvement > 0 else "declining" if improvement < 0 else "stable"
        }

feedback_generator = FeedbackGenerator()
