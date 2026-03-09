import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Alert,
  Avatar,
  Fade,
  Slide,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocalShipping,
  LockOutlined,
  EmailOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Slide in timeout={600} direction="right">
              <Box>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    }}
                  >
                    <LocalShipping sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    SwiftPulse Logistics
                  </Typography>
                  <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
                    Enterprise Logistics Management Platform
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 6 }}>
                  <Fade in timeout={800}>
                    <Card sx={{ textAlign: 'center', p: 3, minWidth: 120 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                        10K+
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Daily Orders
                      </Typography>
                    </Card>
                  </Fade>
                  <Fade in timeout={1000}>
                    <Card sx={{ textAlign: 'center', p: 3, minWidth: 120 }}>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                        98%
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        On-Time Delivery
                      </Typography>
                    </Card>
                  </Fade>
                  <Fade in timeout={1200}>
                    <Card sx={{ textAlign: 'center', p: 3, minWidth: 120 }}>
                      <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>
                        500+
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Cities Served
                      </Typography>
                    </Card>
                  </Fade>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                    Trusted by leading logistics companies worldwide
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Real-time tracking, optimized routes, and comprehensive analytics
                  </Typography>
                </Box>
              </Box>
            </Slide>
          </Grid>

          <Grid item xs={12} md={6}>
            <Slide in timeout={800} direction="left">
              <Paper
                sx={{
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography
                    component="h1"
                    variant="h4"
                    sx={{ fontWeight: 700, mb: 1 }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    Sign in to access your logistics dashboard
                  </Typography>
                </Box>

                {error && (
                  <Fade in timeout={300}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  </Fade>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: <EmailOutlined sx={{ mr: 1, color: '#667eea' }} />,
                    }}
                  />
                  <TextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: <LockOutlined sx={{ mr: 1, color: '#667eea' }} />,
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      mb: 3,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
                      },
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Box textAlign="center">
                    <Link
                      href="/register"
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: '#667eea',
                        '&:hover': {
                          color: '#5a67d8',
                        },
                      }}
                    >
                      Don't have an account? Sign Up
                    </Link>
                  </Box>
                </Box>

                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mb: 2 }}>
                    Demo Credentials:
                  </Typography>
                  <Box sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', p: 2, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      Admin: admin@swiftpulse.com / admin
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      Customer: customer@swiftpulse.com / password
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
