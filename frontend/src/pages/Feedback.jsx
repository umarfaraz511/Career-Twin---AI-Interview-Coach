import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  TrendingUp,
  EmojiEvents,
  Home,
  Replay,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const ScoreCard = ({ title, score, icon, color }) => (
  <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {title}
        </Typography>
        {icon}
      </Stack>
      <Typography variant="h3" fontWeight={700} color={color} mb={1}>
        {score}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={score}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': { bgcolor: color },
        }}
      />
    </CardContent>
  </Card>
);

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, candidateId, role, feedback } = location.state || {};

  if (!feedback) {
    navigate('/dashboard');
    return null;
  }

  const { evaluation, strengths, weaknesses, skill_gaps, recommendations, improvement_roadmap } = feedback;

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <EmojiEvents sx={{ fontSize: 48 }} />
                <Box>
                  <Typography variant="h4" fontWeight={700}>
                    Interview Complete!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {role} Interview Feedback
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overall Score */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 4, textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                Overall Score
              </Typography>
              <Typography
                variant="h1"
                fontWeight={800}
                color={getScoreColor(evaluation.overall_score)}
              >
                {evaluation.overall_score}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                out of 100
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 4, textAlign: 'center', p: 4 }}>
              <Typography variant="h6" color="text.secondary" mb={2}>
                Readiness Score
              </Typography>
              <Typography
                variant="h1"
                fontWeight={800}
                color={getScoreColor(feedback.readiness_score || evaluation.overall_score)}
              >
                {feedback.readiness_score || evaluation.overall_score}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                for {role}
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Scores */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <ScoreCard
              title="Communication"
              score={evaluation.communication_clarity}
              icon={<CheckCircle color="primary" />}
              color={getScoreColor(evaluation.communication_clarity)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ScoreCard
              title="Technical Accuracy"
              score={evaluation.technical_accuracy}
              icon={<CheckCircle color="primary" />}
              color={getScoreColor(evaluation.technical_accuracy)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ScoreCard
              title="Confidence"
              score={evaluation.confidence_score}
              icon={<TrendingUp color="primary" />}
              color={getScoreColor(evaluation.confidence_score)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ScoreCard
              title="Relevance"
              score={evaluation.relevance_score}
              icon={<CheckCircle color="primary" />}
              color={getScoreColor(evaluation.relevance_score)}
            />
          </Grid>
        </Grid>

        {/* Strengths & Weaknesses */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} color="success.main" mb={2}>
                  ✓ Strengths
                </Typography>
                <List>
                  {strengths.map((strength, idx) => (
                    <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <CheckCircle color="success" />
                      </ListItemIcon>
                      <ListItemText primary={strength} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={0} sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} color="error.main" mb={2}>
                  ⚠ Areas for Improvement
                </Typography>
                <List>
                  {weaknesses.map((weakness, idx) => (
                    <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon>
                        <Cancel color="error" />
                      </ListItemIcon>
                      <ListItemText primary={weakness} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Skill Gaps */}
        <Card elevation={0} sx={{ borderRadius: 4, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              📚 Skill Gaps Identified
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {skill_gaps.map((gap, idx) => (
                <Chip key={idx} label={gap} color="warning" />
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card elevation={0} sx={{ borderRadius: 4, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              💡 Recommendations
            </Typography>
            <List>
              {recommendations.map((rec, idx) => (
                <React.Fragment key={idx}>
                  <ListItem>
                    <ListItemText
                      primary={`${idx + 1}. ${rec}`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                  {idx < recommendations.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Improvement Roadmap */}
        <Card elevation={0} sx={{ borderRadius: 4, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              🗺️ Your Improvement Roadmap
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(improvement_roadmap).map(([period, actions], idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Card sx={{ bgcolor: 'primary.light', height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={600} mb={2}>
                        {period.replace('_', ' ').toUpperCase()}
                      </Typography>
                      <List dense>
                        {actions.map((action, actionIdx) => (
                          <ListItem key={actionIdx} sx={{ px: 0 }}>
                            <ListItemText
                              primary={`• ${action}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<Replay />}
            onClick={() => navigate('/dashboard', { state: { candidateId } })}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Practice Again
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate('/')}
          >
            Go Home
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Feedback;
