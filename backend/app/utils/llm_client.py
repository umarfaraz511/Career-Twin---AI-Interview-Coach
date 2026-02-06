from openai import OpenAI
from app.core.config import settings
from typing import List, Dict
import json

class LLMClient:
    def __init__(self):
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url="https://api.groq.com/openai/v1"
        )
        self.model = "llama-3.3-70b-versatile"
    
    def generate_completion(self, prompt: str, system_message: str = None, 
                          temperature: float = 0.7, max_tokens: int = 1500) -> str:
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": prompt})
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content
    
    def generate_embeddings(self, text: str) -> List[float]:
        import hashlib
        import numpy as np
        hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
        np.random.seed(hash_val % (2**32))
        return np.random.rand(1536).tolist()
    
    def chat_completion(self, messages: List[Dict], temperature: float = 0.7) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature
        )
        return response.choices[0].message.content

llm_client = LLMClient()
