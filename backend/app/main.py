from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import uuid
from datetime import datetime
import os

from app.core.config import settings
from app.models.schemas import (
    ResumeData, InterviewQuestion, InterviewAnswer, 
    InterviewSession, FeedbackReport, EvaluationScore,
    CareerTwinProfile, ProgressMetrics
)
from app.models.database import vector_db, file_storage
from app.services.resume_parser import resume_parser
from app.services.interview_simulator import interview_simulator
from app.services.evaluation_engine import evaluation_engine
from app.services.feedback_generator import feedback_generator

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered Career Twin - Digital Interview Simulator"
)

# CORS - Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

profiles_store = {}
sessions_store = {}
feedback_store = {}

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }

@app.post("/api/profile/create")
async def create_profile(
    file: UploadFile = File(...),
    target_roles: str = Form(...)
):
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(400, "Only PDF files are supported")
        
        candidate_id = str(uuid.uuid4())
        content = await file.read()
        file_path = file_storage.save_resume(candidate_id, content, file.filename)
        text = resume_parser.extract_text_from_pdf(file_path)
        resume_data = resume_parser.parse_with_llm(text)
        embeddings = resume_parser.create_profile_embedding(resume_data)
        roles_list = [r.strip() for r in target_roles.split(',')]
        
        profile = CareerTwinProfile(
            candidate_id=candidate_id,
            name=resume_data.name or "Unknown",
            resume_data=resume_data,
            target_roles=roles_list,
            skill_embeddings=embeddings,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        profiles_store[candidate_id] = profile
        vector_db.add_profile(
            candidate_id=candidate_id,
            embeddings=embeddings,
            metadata={
                "name": profile.name,
                "skills": ','.join(resume_data.skills),
                "roles": ','.join(roles_list)
            }
        )
        
        return {
            "success": True,
            "candidate_id": candidate_id,
            "name": profile.name,
            "skills_count": len(resume_data.skills),
            "experience_count": len(resume_data.experience),
            "projects_count": len(resume_data.projects),
            "message": "Profile created successfully"
        }
        
    except Exception as e:
        print(f"Error in create_profile: {e}")
        raise HTTPException(500, f"Error creating profile: {str(e)}")

@app.get("/api/profile/{candidate_id}")
async def get_profile(candidate_id: str):
    if candidate_id not in profiles_store:
        raise HTTPException(404, "Profile not found")
    
    profile = profiles_store[candidate_id]
    return {
        "candidate_id": profile.candidate_id,
        "name": profile.name,
        "skills": profile.resume_data.skills,
        "experience": profile.resume_data.experience,
        "education": profile.resume_data.education,
        "projects": profile.resume_data.projects,
        "summary": profile.resume_data.summary,
        "target_roles": profile.target_roles
    }

@app.post("/api/interview/start")
async def start_interview(
    candidate_id: str = Form(...),
    role: str = Form(...)
):
    try:
        if candidate_id not in profiles_store:
            raise HTTPException(404, "Profile not found")
        
        profile = profiles_store[candidate_id]
        questions = interview_simulator.generate_role_specific_questions(
            role=role,
            resume_data=profile.resume_data,
            num_hr=3,
            num_technical=4,
            num_behavioral=3
        )
        
        session_id = str(uuid.uuid4())
        session = InterviewSession(
            session_id=session_id,
            candidate_id=candidate_id,
            role=role,
            questions=questions,
            started_at=datetime.now(),
            status="in_progress"
        )
        
        sessions_store[session_id] = session
        
        return {
            "success": True,
            "session_id": session_id,
            "role": role,
            "total_questions": len(questions),
            "questions": [
                {
                    "question_id": q.question_id,
                    "question": q.question,
                    "category": q.category,
                    "difficulty": q.difficulty
                }
                for q in questions
            ]
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error starting interview: {str(e)}")

@app.post("/api/interview/answer")
async def submit_answer(
    session_id: str = Form(...),
    question_id: str = Form(...),
    answer: str = Form(...)
):
    try:
        if session_id not in sessions_store:
            raise HTTPException(404, "Session not found")
        
        session = sessions_store[session_id]
        question = next((q for q in session.questions if q.question_id == question_id), None)
        if not question:
            raise HTTPException(404, "Question not found")
        
        answer_obj = InterviewAnswer(
            question_id=question_id,
            question=question.question,
            answer=answer,
            category=question.category
        )
        
        session.answers.append(answer_obj)
        all_answered = len(session.answers) >= len(session.questions)
        
        return {
            "success": True,
            "answered": len(session.answers),
            "total": len(session.questions),
            "completed": all_answered,
            "message": "Answer submitted successfully"
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error submitting answer: {str(e)}")

@app.post("/api/interview/complete")
async def complete_interview(session_id: str = Form(...)):
    try:
        if session_id not in sessions_store:
            raise HTTPException(404, "Session not found")
        
        session = sessions_store[session_id]
        profile = profiles_store[session.candidate_id]
        
        evaluation = evaluation_engine.evaluate_session(
            answers=session.answers,
            resume_data=profile.resume_data,
            role=session.role
        )
        
        feedback = feedback_generator.generate_comprehensive_feedback(
            candidate_id=session.candidate_id,
            role=session.role,
            answers=session.answers,
            evaluation=evaluation,
            resume_data=profile.resume_data
        )
        
        readiness_score = evaluation_engine.calculate_role_readiness(
            evaluation=evaluation,
            resume_data=profile.resume_data,
            role=session.role
        )
        
        session.completed_at = datetime.now()
        session.status = "completed"
        feedback_store[session_id] = feedback
        
        session_data = {
            "session_id": session_id,
            "candidate_id": session.candidate_id,
            "role": session.role,
            "started_at": str(session.started_at),
            "completed_at": str(session.completed_at),
            "questions": [q.dict() for q in session.questions],
            "answers": [a.dict() for a in session.answers],
            "evaluation": evaluation.dict(),
            "feedback": feedback.dict()
        }
        file_storage.save_interview_log(session_id, session_data)
        
        return {
            "success": True,
            "session_id": session_id,
            "evaluation": {
                "communication_clarity": evaluation.communication_clarity,
                "technical_accuracy": evaluation.technical_accuracy,
                "confidence_score": evaluation.confidence_score,
                "relevance_score": evaluation.relevance_score,
                "overall_score": evaluation.overall_score
            },
            "readiness_score": readiness_score,
            "strengths": feedback.strengths,
            "weaknesses": feedback.weaknesses,
            "skill_gaps": feedback.skill_gaps,
            "recommendations": feedback.recommendations,
            "improvement_roadmap": feedback.improvement_roadmap
        }
        
    except Exception as e:
        raise HTTPException(500, f"Error completing interview: {str(e)}")

@app.get("/api/feedback/{session_id}")
async def get_feedback(session_id: str):
    if session_id not in feedback_store:
        raise HTTPException(404, "Feedback not found")
    
    feedback = feedback_store[session_id]
    session = sessions_store[session_id]
    
    return {
        "session_id": session_id,
        "role": session.role,
        "completed_at": str(session.completed_at),
        "evaluation": feedback.evaluation.dict(),
        "strengths": feedback.strengths,
        "weaknesses": feedback.weaknesses,
        "skill_gaps": feedback.skill_gaps,
        "recommendations": feedback.recommendations,
        "improvement_roadmap": feedback.improvement_roadmap
    }

@app.get("/api/progress/{candidate_id}")
async def get_progress(candidate_id: str):
    if candidate_id not in profiles_store:
        raise HTTPException(404, "Profile not found")
    
    candidate_sessions = [
        s for s in sessions_store.values() 
        if s.candidate_id == candidate_id and s.status == "completed"
    ]
    
    if not candidate_sessions:
        return {
            "candidate_id": candidate_id,
            "total_sessions": 0,
            "message": "No completed sessions yet"
        }
    
    scores_by_date = []
    for session in candidate_sessions:
        if session.session_id in feedback_store:
            feedback = feedback_store[session.session_id]
            scores_by_date.append({
                "date": str(session.completed_at),
                "role": session.role,
                "overall_score": feedback.evaluation.overall_score,
                "communication": feedback.evaluation.communication_clarity,
                "technical": feedback.evaluation.technical_accuracy,
                "confidence": feedback.evaluation.confidence_score
            })
    
    scores_by_date.sort(key=lambda x: x['date'])
    
    if scores_by_date:
        latest_scores = scores_by_date[-3:] if len(scores_by_date) >= 3 else scores_by_date
        avg_current = sum(s['overall_score'] for s in latest_scores) / len(latest_scores)
    else:
        avg_current = 0
    
    return {
        "candidate_id": candidate_id,
        "total_sessions": len(candidate_sessions),
        "current_readiness_score": round(avg_current, 2),
        "session_history": scores_by_date,
        "roles_practiced": list(set(s.role for s in candidate_sessions))
    }

@app.get("/api/roles")
async def get_available_roles():
    return {
        "roles": [
            "Software Engineer",
            "ML Engineer",
            "Data Analyst",
            "Frontend Developer",
            "Backend Developer",
            "Full Stack Developer",
            "DevOps Engineer",
            "Product Manager",
            "Data Scientist",
            "Cloud Architect"
        ]
    }
