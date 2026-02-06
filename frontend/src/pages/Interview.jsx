import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  LinearProgress,
  Stack,
  Chip,
  Alert,
} from '@mui/material';
import { ArrowForward, CheckCircle } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { careerTwinAPI } from '../services/api';

const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { candidateId, role, candidateName } = location.state || {};
  
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!candidateId || !role) {
      navigate('/dashboard');
      return;
    }

    const startSession = async () => {
      try {
        const response = await careerTwinAPI.startInterview(candidateId, role);
        setSessionId(response.session_id);
        setQuestions(response.questions);
        setLoading(false);
      } catch (err) {
        setError('Failed to start interview session');
        setLoading(false);
      }
    };

    startSession();
  }, [candidateId, role, navigate]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }

    try {
      const currentQuestion = questions[currentIndex];
      await careerTwinAPI.submitAnswer(sessionId, currentQuestion.question_id, answer);
      
      setAnswers([...answers, { question: currentQuestion.question, answer }]);
      setAnswer('');
      setError('');

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        handleCompleteInterview();
      }
    } catch (err) {
      setError('Failed to submit answer');
    }
  };

  const handleCompleteInterview = async () => {
    try {
      const response = await careerTwinAPI.completeInterview(sessionId);
      navigate('/feedback', {
        state: {
          sessionId,
          candidateId,
          role,
          feedback: response,
        },
      });
    } catch (err) {
      setError('Failed to complete interview');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Card elevation={0} sx={{ mb: 3, borderRadius: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5" fontWeight={600}>
                {role} Interview
              </Typography>
              <Chip
                label={`${currentIndex + 1} / ${questions.length}`}
                color="primary"
              />
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </CardContent>
        </Card>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card elevation={0} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip
                    label={currentQuestion.category.toUpperCase()}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={currentQuestion.difficulty.toUpperCase()}
                    size="small"
                    color={
                      currentQuestion.difficulty === 'easy'
                        ? 'success'
                        : currentQuestion.difficulty === 'medium'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </Stack>

                <Typography variant="h6" fontWeight={600} mb={3}>
                  {currentQuestion.question}
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={8}
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={currentIndex === questions.length - 1 ? <CheckCircle /> : <ArrowForward />}
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim()}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    {currentIndex === questions.length - 1 ? 'Complete Interview' : 'Next Question'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Progress Info */}
        <Card elevation={0} sx={{ mt: 3, borderRadius: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Typography variant="body2">
              💡 Tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Interview;
