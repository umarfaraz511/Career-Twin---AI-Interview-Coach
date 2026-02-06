from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "Career Twin"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # OpenAI
    OPENAI_API_KEY: str
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [".pdf", ".txt", ".docx"]
    
    # Paths
    VECTOR_DB_PATH: str = "./data/vectorstore"
    COLLECTION_NAME: str = "career_twin_profiles"
    RESUME_UPLOAD_PATH: str = "./data/resumes"
    INTERVIEW_LOGS_PATH: str = "./data/interviews"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
