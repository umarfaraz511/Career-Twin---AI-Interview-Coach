import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import {
  CloudUpload,
  Psychology,
  Assessment,
  TrendingUp,
  AutoAwesome,
  Speed,
  PlayCircleOutline,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ icon, title, description }) => (
  <Box
    component={motion.div}
    whileHover={{ y: -6 }}
    sx={{
      width: "100%",
      height: "260px",
      borderRadius: 3,
      color: "white",
      overflow: "hidden",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      boxShadow: "0 10px 30px rgba(102, 126, 234, 0.22)",
      transition: "all 0.25s ease",
      "&:hover": { 
        boxShadow: "0 16px 42px rgba(102, 126, 234, 0.35)",
        transform: "translateY(-6px)"
      },
      p: 3.5,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 2,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>

    <Typography
      variant="h6"
      sx={{
        fontWeight: 800,
        letterSpacing: "-0.2px",
        fontSize: "1.1rem",
        lineHeight: 1.3,
        mb: 1.5,
      }}
    >
      {title}
    </Typography>

    <Typography
      variant="body2"
      sx={{
        opacity: 0.95,
        lineHeight: 1.6,
        fontSize: "0.95rem",
      }}
    >
      {description}
    </Typography>
  </Box>
);

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Psychology sx={{ fontSize: 32 }} />,
      title: "AI-Powered Analysis",
      description:
        "Advanced NLP + LLM intelligence analyzes your responses with high precision.",
    },
    {
      icon: <Assessment sx={{ fontSize: 32 }} />,
      title: "Real Interview Simulation",
      description:
        "Role-specific questions that feel like a real panel interview—no fluff.",
    },
    {
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      title: "Progress Tracking",
      description:
        "Track confidence, clarity, and improvement trends with clear analytics.",
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 32 }} />,
      title: "Personalized Feedback",
      description: "Actionable, structured feedback to improve answers fast.",
    },
    {
      icon: <Speed sx={{ fontSize: 32 }} />,
      title: "Instant Evaluation",
      description:
        "Get immediate scoring and recommendations after each session.",
    },
    {
      icon: <CloudUpload sx={{ fontSize: 32 }} />,
      title: "Easy Upload",
      description: "Upload your resume and start practicing in minutes.",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Top Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(248, 250, 252, 0.88)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: { xs: 64, sm: 72 } }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.2}
              sx={{ flexGrow: 1 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 10px 22px rgba(102, 126, 234, 0.25)",
                }}
              >
                <AutoAwesome sx={{ color: "white" }} />
              </Box>

              <Stack spacing={0} sx={{ lineHeight: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "#0f172a",
                    letterSpacing: "-0.4px",
                  }}
                >
                  Career Twin
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#475569", mt: "-2px" }}
                >
                  AI Interview Coach
                </Typography>
              </Stack>

              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1.5, opacity: 0.35 }}
              />

              <Chip
                icon={<TrendingUp />}
                label="Top Trend"
                sx={{
                  fontWeight: 700,
                  bgcolor: "rgba(99, 102, 241, 0.10)",
                  color: "#4f46e5",
                  border: "1px solid rgba(79, 70, 229, 0.25)",
                }}
              />
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <Button
                variant="text"
                sx={{ textTransform: "none", fontWeight: 700, color: "#334155" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Home
              </Button>
              <Button
                variant="text"
                sx={{ textTransform: "none", fontWeight: 700, color: "#334155" }}
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Features
              </Button>
              <Button
                variant="contained"
                startIcon={<CloudUpload />}
                onClick={() => navigate("/upload")}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  px: 2.2,
                  borderRadius: 2,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 10px 26px rgba(102, 126, 234, 0.30)",
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #f8fafc 0%, #e0e7ff 100%)",
          pt: { xs: 7, sm: 9 },
          pb: { xs: 8, sm: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Chip
              label="POWERED BY FARAZE"
              sx={{
                mb: 3,
                px: 2.2,
                py: 2.1,
                fontWeight: 800,
                bgcolor: "rgba(99, 102, 241, 0.10)",
                color: "#4f46e5",
                border: "1px solid rgba(79, 70, 229, 0.18)",
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontWeight: 950,
                mb: 2.5,
                lineHeight: 1.05,
                letterSpacing: "-1.2px",
                fontSize: {
                  xs: "clamp(2.4rem, 9vw, 3.35rem)",
                  md: "clamp(3.2rem, 6vw, 4.6rem)",
                },
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Career Twin
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 4.5,
                maxWidth: 820,
                mx: "auto",
                color: "#475569",
                lineHeight: 1.75,
                fontSize: { xs: "1.05rem", md: "1.2rem" },
              }}
            >
              Your AI-powered interview coach. Upload your resume, practice with
              realistic interviews, and get instant feedback to ace your next job
              interview.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUpload />}
                onClick={() => navigate("/upload")}
                sx={{
                  py: 1.7,
                  px: 4,
                  minWidth: { xs: "100%", sm: 200 },
                  borderRadius: 2,
                  fontSize: "1.02rem",
                  fontWeight: 900,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  boxShadow: "0 14px 34px rgba(102, 126, 234, 0.35)",
                }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayCircleOutline />}
                sx={{
                  py: 1.7,
                  px: 4,
                  minWidth: { xs: "100%", sm: 200 },
                  borderRadius: 2,
                  fontSize: "1.02rem",
                  fontWeight: 900,
                  textTransform: "none",
                  borderWidth: 2,
                  borderColor: "rgba(102,126,234,0.55)",
                  color: "#4f46e5",
                  "&:hover": {
                    borderWidth: 2,
                    borderColor: "#667eea",
                    bgcolor: "rgba(99,102,241,0.06)",
                  },
                }}
              >
                Watch Demo
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container id="features" maxWidth="lg" sx={{ py: { xs: 7, sm: 10 } }}>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{
            fontWeight: 950,
            mb: { xs: 4.5, sm: 6 },
            fontSize: { xs: "2.05rem", sm: "2.35rem", md: "2.6rem" },
            color: "#0f172a",
            letterSpacing: "-0.6px",
          }}
        >
          Why Choose Career Twin?
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: 3 }}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Box>
      </Container>

      {/* How It Works */}
      <Box sx={{ bgcolor: "#f1f5f9", py: { xs: 7, sm: 10 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              fontWeight: 950,
              mb: { xs: 4.5, sm: 6 },
              fontSize: { xs: "2.05rem", sm: "2.35rem", md: "2.6rem" },
              color: "#0f172a",
              letterSpacing: "-0.6px",
            }}
          >
            How It Works
          </Typography>

          <Grid container spacing={{ xs: 2.5, sm: 4 }}>
            {[
              { step: "1", title: "Upload Resume", desc: "Upload your PDF resume" },
              { step: "2", title: "Choose Role", desc: "Select your target job role" },
              { step: "3", title: "Practice Interview", desc: "Answer AI-driven questions" },
              { step: "4", title: "Get Feedback", desc: "Receive detailed evaluation" },
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  sx={{
                    textAlign: "center",
                    height: "100%",
                    p: { xs: 2.5, sm: 3 },
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(15,23,42,0.06)",
                    boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.75rem",
                      fontWeight: 950,
                      mx: "auto",
                      mb: 2,
                      boxShadow: "0 12px 26px rgba(102,126,234,0.28)",
                    }}
                  >
                    {item.step}
                  </Box>
                  <Typography variant="h6" fontWeight={900} mb={1} sx={{ color: "#0f172a" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.7 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 4 }} />
    </Box>
  );
};

export default HomePage;
