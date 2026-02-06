import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Stack,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  Person,
  WorkOutline,
  School,
  Code,
  EmojiEvents,
  PlayArrow,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { careerTwinAPI } from '../services/api';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const candidateId = location.state?.candidateId;

  useEffect(() => {
    if (!candidateId) {
      navigate('/upload');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileData, rolesData] = await Promise.all([
          careerTwinAPI.getProfile(candidateId),
          careerTwinAPI.getAvailableRoles(),
        ]);
        setProfile(profileData);
        setRoles(rolesData.roles);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [candidateId, navigate]);

  const handleStartInterview = (role) => {
    navigate('/interview', {
      state: {
        candidateId,
        role,
        candidateName: profile.name,
      },
    });
  };

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card elevation={0} sx={{ mb: 4, borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {profile?.name?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={700} mb={1}>
                    Welcome, {profile?.name || 'User'}!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Your AI Career Twin is ready. Let's start practicing!
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<EmojiEvents />}
                  onClick={() => navigate('/progress', { state: { candidateId } })}
                >
                  View Progress
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        <Grid container spacing={4}>
          {/* Profile Summary */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ borderRadius: 4, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Profile Overview
                </Typography>

                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <Code fontSize="small" color="primary" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Skills ({profile?.skills?.length || 0})
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {profile?.skills?.slice(0, 8).map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" />
                      ))}
                      {profile?.skills?.length > 8 && (
                        <Chip label={`+${profile.skills.length - 8} more`} size="small" />
                      )}
                    </Stack>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <WorkOutline fontSize="small" color="primary" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Experience ({profile?.experience?.length || 0})
                      </Typography>
                    </Stack>
                    {profile?.experience?.slice(0, 2).map((exp, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary" mb={0.5}>
                        • {exp.title} at {exp.company}
                      </Typography>
                    ))}
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                      <School fontSize="small" color="primary" />
                      <Typography variant="subtitle2" fontWeight={600}>
                        Education ({profile?.education?.length || 0})
                      </Typography>
                    </Stack>
                    {profile?.education?.slice(0, 2).map((edu, idx) => (
                      <Typography key={idx} variant="body2" color="text.secondary" mb={0.5}>
                        • {edu.degree} - {edu.institution}
                      </Typography>
                    ))}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Interview Options */}
          <Grid item xs={12} md={8}>
            <Card elevation={0} sx={{ borderRadius: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  Start Interview Practice
                </Typography>

                <Grid container spacing={2}>
                  {roles.map((role, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: '2px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: 3,
                            },
                          }}
                          onClick={() => handleStartInterview(role)}
                        >
                          <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="h6" fontWeight={600} mb={0.5}>
                                  {role}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  10 questions • ~20 mins
                                </Typography>
                              </Box>
                              <PlayArrow color="primary" />
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
