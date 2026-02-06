import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

import HomePage from './pages/HomePage';
import ResumeUpload from './pages/ResumeUpload';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import Feedback from './pages/Feedback';
import Progress from './pages/Progress';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<ResumeUpload />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
