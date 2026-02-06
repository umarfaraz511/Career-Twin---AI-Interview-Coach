from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class ResumeData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    skills: List[str] = []
    experience: List[Dict] = []
    education: List[Dict] = []
    projects: List[Dict] = []
    summary: Optional[str] = None
    raw_text: str

class InterviewQuestion(BaseModel):
    question_id: str
    question: str
    category: str  # hr, technical, behavioral
    difficulty: str  # easy, medium, hard

class InterviewAnswer(BaseModel):
    question_id: str
    question: str
    answer: str
    category: str

class EvaluationScore(BaseModel):
    communication_clarity: float = Field(..., ge=0, le=100)
    technical_accuracy: float = Field(..., ge=0, le=100)
    confidence_score: float = Field(..., ge=0, le=100)
    relevance_score: float = Field(..., ge=0, le=100)
    overall_score: float = Field(..., ge=0, le=100)
    
class FeedbackReport(BaseModel):
    candidate_id: str
    timestamp: datetime
    role: str
    evaluation: EvaluationScore
    strengths: List[str]
    weaknesses: List[str]
    skill_gaps: List[str]
    recommendations: List[str]
    improvement_roadmap: Dict[str, List[str]]

class CareerTwinProfile(BaseModel):
    candidate_id: str
    name: str
    resume_data: ResumeData
    target_roles: List[str]
    skill_embeddings: Optional[List[float]] = None
    created_at: datetime
    updated_at: datetime

class InterviewSession(BaseModel):
    session_id: str
    candidate_id: str
    role: str
    questions: List[InterviewQuestion]
    answers: List[InterviewAnswer] = []
    started_at: datetime
    completed_at: Optional[datetime] = None
    status: str = "in_progress"  # in_progress, completed

class ProgressMetrics(BaseModel):
    candidate_id: str
    sessions: List[Dict]
    improvement_trend: Dict[str, List[float]]
    current_readiness_score: float
    target_role_compatibility: Dict[str, float]
