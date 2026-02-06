import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const careerTwinAPI = {
  // Profile endpoints
  createProfile: async (file, targetRoles) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target_roles', targetRoles);
      
      console.log('Sending request to:', `${API_BASE_URL}/api/profile/create`);
      
      const response = await api.post('/api/profile/create', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  getProfile: async (candidateId) => {
    const response = await api.get(`/api/profile/${candidateId}`);
    return response.data;
  },

  startInterview: async (candidateId, role) => {
    const formData = new FormData();
    formData.append('candidate_id', candidateId);
    formData.append('role', role);
    
    const response = await api.post('/api/interview/start', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  submitAnswer: async (sessionId, questionId, answer) => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('question_id', questionId);
    formData.append('answer', answer);
    
    const response = await api.post('/api/interview/answer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  completeInterview: async (sessionId) => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    
    const response = await api.post('/api/interview/complete', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getFeedback: async (sessionId) => {
    const response = await api.get(`/api/feedback/${sessionId}`);
    return response.data;
  },

  getProgress: async (candidateId) => {
    const response = await api.get(`/api/progress/${candidateId}`);
    return response.data;
  },

  getAvailableRoles: async () => {
    const response = await api.get('/api/roles');
    return response.data;
  },
};

export default api;
