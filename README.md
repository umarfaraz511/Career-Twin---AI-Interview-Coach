# 🎯 Career Twin - AI-Powered Interview Coach

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Career Twin is an intelligent interview preparation platform that creates a digital twin of job candidates, simulates role-specific interviews, evaluates performance, and provides personalized feedback using advanced AI technology.

## 🌟 Features

### 🤖 AI-Powered Analysis
- **Smart Resume Parsing**: Extracts structured information from PDF resumes using NLP
- **Semantic Search**: ChromaDB vector embeddings for candidate profile matching
- **Context-Aware Generation**: Role-specific questions tailored to candidate background

### 🎤 Real Interview Simulation
- **Dynamic Question Generation**: 10 questions per session (3 HR, 4 Technical, 3 Behavioral)
- **Multi-Category Assessment**: Comprehensive evaluation across different question types
- **Adaptive Follow-ups**: Context-aware follow-up questions based on responses

### 📊 Comprehensive Evaluation
- **Multi-Criteria Scoring**: 4 dimensions - Communication, Technical Accuracy, Confidence, Relevance
- **Role Readiness Score**: Overall preparedness assessment for target positions
- **Skill Gap Analysis**: Identifies areas for improvement with actionable insights

### 📈 Progress Tracking
- **Session History**: Track performance across multiple practice sessions
- **Trend Visualization**: Interactive charts showing improvement over time
- **Performance Metrics**: Detailed analytics on strengths and weaknesses

### 🎨 Modern UI/UX
- **Professional Design**: Material-UI components with custom theming
- **Smooth Animations**: Framer Motion for delightful user experience
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **AI/ML**: OpenAI GPT-4 / Groq LLaMA 3.3 70B
- **Vector DB**: ChromaDB with Sentence Transformers
- **PDF Processing**: PyPDF2, pdfplumber
- **Data Models**: Pydantic for validation

### Frontend
- **Framework**: React 18 (Vite)
- **UI Library**: Material-UI (MUI)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router

### Architecture
- **API**: RESTful design with OpenAPI documentation
- **Storage**: Vector embeddings + file storage
- **Processing**: Async/await for performance
- **CORS**: Configured for cross-origin requests

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API Key or Groq API Key

### Backend Setup
```bash
# Clone repository
git clone https://github.com/yourusername/career-twin.git
cd career-twin/backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_api_key_here" > .env

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📁 Project Structure
```
career-twin/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py           # Configuration settings
│   │   ├── models/
│   │   │   ├── schemas.py          # Pydantic models
│   │   │   └── database.py         # ChromaDB & file storage
│   │   ├── services/
│   │   │   ├── resume_parser.py    # PDF parsing & LLM extraction
│   │   │   ├── interview_simulator.py
│   │   │   ├── evaluation_engine.py
│   │   │   └── feedback_generator.py
│   │   ├── utils/
│   │   │   └── llm_client.py       # OpenAI/Groq client wrapper
│   │   └── main.py                 # FastAPI application
│   ├── data/                       # Resumes, interviews, vectorstore
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/                  # React components
    │   ├── services/
    │   │   └── api.js              # API client
    │   ├── styles/
    │   │   └── theme.js            # MUI theme
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🎯 Key Workflows

### 1. Profile Creation
```
User Upload Resume → PDF Parser → LLM Extraction → 
Vector Embeddings → Store in ChromaDB → Return Profile
```

### 2. Interview Simulation
```
Select Role → Generate Questions (LLM) → 
Display Questions → Collect Answers → Store Responses
```

### 3. Performance Evaluation
```
Submit Answers → Multi-Criteria Analysis (LLM) → 
Calculate Scores → Generate Feedback → 
Create Improvement Roadmap → Display Results
```

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/profile/create` | Upload resume and create profile |
| `GET` | `/api/profile/{id}` | Retrieve candidate profile |
| `POST` | `/api/interview/start` | Start interview session |
| `POST` | `/api/interview/answer` | Submit answer |
| `POST` | `/api/interview/complete` | Complete session & get feedback |
| `GET` | `/api/feedback/{session_id}` | Retrieve feedback report |
| `GET` | `/api/progress/{candidate_id}` | Get progress metrics |
| `GET` | `/api/roles` | List available job roles |

Full API documentation available at: `/docs` (Swagger UI)

---

## 🧪 Example Usage

### Create Profile
```javascript
const formData = new FormData();
formData.append('file', resumeFile);
formData.append('target_roles', 'Software Engineer, ML Engineer');

const response = await fetch('http://localhost:8000/api/profile/create', {
  method: 'POST',
  body: formData
});

const profile = await response.json();
console.log(profile.candidate_id);
```

### Start Interview
```javascript
const response = await fetch('http://localhost:8000/api/interview/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    candidate_id: 'uuid-here',
    role: 'Software Engineer'
  })
});

const session = await response.json();
console.log(session.questions);
```

---




---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
OPENAI_API_KEY=sk-proj-xxx  # or gsk_xxx for Groq
APP_NAME=Career Twin
DEBUG=True
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
MAX_UPLOAD_SIZE=10485760
VECTOR_DB_PATH=./data/vectorstore
```

### Supported Models
- OpenAI: `gpt-4o-mini` (default)
- Groq: `llama-3.3-70b-versatile` (free alternative)

---

## 🚧 Roadmap

- [ ] User authentication & authorization (JWT)
- [ ] Multi-language support
- [ ] Video interview simulation with webcam
- [ ] Company-specific interview prep
- [ ] Mock panel interviews with multiple AI interviewers
- [ ] Integration with LinkedIn profiles
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email/SMS notifications

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Umar Faraz**
- LinkedIn: [Your LinkedIn Profile]
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: Umarfaraz511@gmail.com

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Groq for free LLM inference
- Anthropic Claude for development assistance
- Material-UI team for excellent components
- FastAPI community for the amazing framework

---

## 🎨 Screenshots
<img width="960" height="455" alt="C-1" src="https://github.com/user-attachments/assets/93c8adfe-daf0-4fc2-9f52-23c010ec8022" />
<img width="904" height="400" alt="C-2" src="https://github.com/user-attachments/assets/62ae67b7-3164-4a7e-a91e-3fc7db0fb98a" />
<img width="695" height="440" alt="C-3" src="https://github.com/user-attachments/assets/1b0ba079-ca60-41f4-a9a8-33889c1ee1ee" />



<img width="941" height="411" alt="C-4" src="https://github.com/user-attachments/assets/9f6eb1c7-80b1-4eb4-b12a-d6687521a95e" />

<img width="905" height="445" alt="C-6" src="https://github.com/user-attachments/assets/453de28e-aa75-40e1-8769-8ab4fb61a5d5" />
<img width="944" height="424" alt="C-5" src="https://github.com/user-attachments/assets/adb2e730-534b-48f1-aab5-9da679847341" />
<img width="869" height="441" alt="C-7" src="https://github.com/user-attachments/assets/17f5a68e-b163-4265-8ffc-81d86075d58c" />

<img width="687" height="446" alt="C-8" src="https://github.com/user-attachments/assets/d4238205-c013-4e1d-88cb-430dd7c22859" />
<img width="863" height="439" alt="C-9" src="https://github.com/user-attachments/assets/bf6ba051-3033-4c52-a451-1bb91047dc59" />
<img width="852" height="380" alt="C-10" src="https://github.com/user-attachments/assets/dba4c3d0-6007-417c-b58f-db6696a134d6" />







## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/career-twin&type=Date)](https://star-history.com/#yourusername/career-twin&Date)

---

## 📧 Contact

For questions, feedback, or collaboration:
- Open an issue on GitHub
- Email: Umarfaraz511@gmail.com

---

**Built with ❤️ by Umar Faraz | Powered by AI**
```

---

# GitHub Repository Description (Short)
```
🎯 AI-powered interview coach built with FastAPI, React & GPT-4. Smart resume analysis, role-specific questions, real-time evaluation & personalized feedback. Full-stack ML application with ChromaDB vector search.
```

---

# GitHub Topics/Tags
```
ai, machine-learning, fastapi, react, openai, gpt-4, interview-preparation, nlp, vector-database, chromadb, full-stack, python, javascript, career-development, recruitment-tool
