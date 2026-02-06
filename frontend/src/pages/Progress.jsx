import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import { TrendingUp, Assessment } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';
import { careerTwinAPI } from '../services/api';

const Progress = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const candidateId = location.state?.candidateId;

  useEffect(() => {
    if (!candidateId) return;

    const fetchProgress = async () => {
      try {
        const data = await careerTwinAPI.getProgress(candidateId);
        setProgress(data);
      } catch (err) {
        setError('Failed to load progress data');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [candidateId]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={700} mb={4}>
          Your Progress
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0}>
              <CardContent>
                <Assessment color="primary" sx={{ mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {progress.total_sessions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sessions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0}>
              <CardContent>
                <TrendingUp color="success" sx={{ mb: 1 }} />
                <Typography variant="h4" fontWeight={700} color="success.main">
                  {progress.current_readiness_score}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Card elevation={0}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Roles Practiced
                </Typography>
                <Box>
                  {progress.roles_practiced?.map((role, idx) => (
                    <Chip key={idx} label={role} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Chart */}
        {progress.session_history?.length > 0 && (
          <Card elevation={0} sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} mb={3}>
                Performance Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={progress.session_history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="overall_score" stroke="#6366f1" name="Overall" strokeWidth={2} />
                  <Line type="monotone" dataKey="communication" stroke="#10b981" name="Communication" />
                  <Line type="monotone" dataKey="technical" stroke="#f59e0b" name="Technical" />
                  <Line type="monotone" dataKey="confidence" stroke="#ec4899" name="Confidence" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
};

export default Progress;
