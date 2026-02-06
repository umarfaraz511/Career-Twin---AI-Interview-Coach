import React, { useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { CloudUpload, CheckCircle, Description } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { careerTwinAPI } from '../services/api';

const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [targetRoles, setTargetRoles] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10485760,
  });

  const handleSubmit = async () => {
    if (!file) {
      setError('Please upload a resume');
      return;
    }
    if (!targetRoles.trim()) {
      setError('Please enter at least one target role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Starting profile creation...');
      const response = await careerTwinAPI.createProfile(file, targetRoles);
      console.log('Profile created:', response);
      
      if (response.success && response.candidate_id) {
        setSuccess(true);
        
        setTimeout(() => {
          navigate('/dashboard', { 
            state: { 
              candidateId: response.candidate_id,
              name: response.name 
            } 
          });
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create profile';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" fontWeight={700} textAlign="center" mb={2}>
            Upload Your Resume
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            Start your AI-powered interview preparation journey
          </Typography>

          <Card elevation={0} sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Paper
                {...getRootProps()}
                sx={{
                  p: 6,
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'divider',
                  bgcolor: isDragActive ? 'primary.light' : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <input {...getInputProps()} />
                <Stack alignItems="center" spacing={2}>
                  {file ? (
                    <>
                      <CheckCircle sx={{ fontSize: 64, color: 'success.main' }} />
                      <Typography variant="h6" fontWeight={600}>
                        {file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    </>
                  ) : (
                    <>
                      <CloudUpload sx={{ fontSize: 64, color: 'primary.main' }} />
                      <Typography variant="h6" fontWeight={600}>
                        {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        or click to browse (PDF only, max 10MB)
                      </Typography>
                    </>
                  )}
                </Stack>
              </Paper>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Target Job Roles
                </Typography>
                <TextField
                  fullWidth
                  placeholder="e.g., Software Engineer, ML Engineer, Data Analyst"
                  value={targetRoles}
                  onChange={(e) => setTargetRoles(e.target.value)}
                  multiline
                  rows={2}
                  helperText="Enter comma-separated job roles you're targeting"
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Popular roles:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {[
                    'Software Engineer',
                    'ML Engineer',
                    'Data Analyst',
                    'Frontend Developer',
                    'Backend Developer',
                    'Full Stack Developer',
                  ].map((role) => (
                    <Chip
                      key={role}
                      label={role}
                      onClick={() => {
                        const roles = targetRoles.split(',').map((r) => r.trim()).filter(Boolean);
                        if (!roles.includes(role)) {
                          setTargetRoles(roles.concat(role).join(', '));
                        }
                      }}
                      sx={{ mb: 1, cursor: 'pointer' }}
                    />
                  ))}
                </Stack>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  ✅ Profile created successfully! Redirecting to dashboard...
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={loading || success}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Description />}
                sx={{
                  mt: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {loading ? 'Creating Profile...' : success ? 'Redirecting...' : 'Create Profile & Continue'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ResumeUpload;
