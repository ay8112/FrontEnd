import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Link } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warn('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/api/auth/request-otp', { email: email.trim() });
      toast.success(res.data.message || 'OTP sent to your email');
      
      // Start cooldown
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Navigate to verify page with email
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: email.trim(), maskedEmail: res.data.email } });
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send OTP';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
          Forgot Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          Enter your registered email to receive an OTP
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading || cooldown > 0}
            sx={{ mb: 2, py: 1.5 }}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : loading ? 'Sending...' : 'Send OTP'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link onClick={() => navigate('/login')} sx={{ cursor: 'pointer', fontSize: 14 }}>
              Back to Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
