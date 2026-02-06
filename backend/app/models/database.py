import os
os.environ['ANONYMIZED_TELEMETRY'] = 'False'

import json
from datetime import datetime
from typing import List, Dict, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from app.core.config import settings

class VectorDatabase:
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=settings.VECTOR_DB_PATH,
            settings=ChromaSettings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        self.collection = self.client.get_or_create_collection(
            name=settings.COLLECTION_NAME
        )
    
    def add_profile(self, candidate_id: str, embeddings: List[float], metadata: Dict):
        """Add candidate profile to vector database"""
        self.collection.add(
            ids=[candidate_id],
            embeddings=[embeddings],
            metadatas=[metadata]
        )
    
    def get_profile(self, candidate_id: str):
        """Retrieve candidate profile"""
        results = self.collection.get(ids=[candidate_id])
        return results
    
    def update_profile(self, candidate_id: str, embeddings: List[float], metadata: Dict):
        """Update existing profile"""
        self.collection.update(
            ids=[candidate_id],
            embeddings=[embeddings],
            metadatas=[metadata]
        )
    
    def search_similar_profiles(self, query_embeddings: List[float], n_results: int = 5):
        """Find similar candidate profiles"""
        results = self.collection.query(
            query_embeddings=[query_embeddings],
            n_results=n_results
        )
        return results

class FileStorage:
    @staticmethod
    def save_resume(candidate_id: str, content: bytes, filename: str) -> str:
        """Save uploaded resume"""
        os.makedirs(settings.RESUME_UPLOAD_PATH, exist_ok=True)
        filepath = os.path.join(settings.RESUME_UPLOAD_PATH, f"{candidate_id}_{filename}")
        with open(filepath, 'wb') as f:
            f.write(content)
        return filepath
    
    @staticmethod
    def save_interview_log(session_id: str, data: Dict) -> str:
        """Save interview session data"""
        os.makedirs(settings.INTERVIEW_LOGS_PATH, exist_ok=True)
        filepath = os.path.join(settings.INTERVIEW_LOGS_PATH, f"{session_id}.json")
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        return filepath
    
    @staticmethod
    def load_interview_log(session_id: str) -> Optional[Dict]:
        """Load interview session data"""
        filepath = os.path.join(settings.INTERVIEW_LOGS_PATH, f"{session_id}.json")
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                return json.load(f)
        return None

# Initialize databases
vector_db = VectorDatabase()
file_storage = FileStorage()
