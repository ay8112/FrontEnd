import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Link, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import api from '../services/api';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const maskedEmail = location.state?.maskedEmail || emailFromState;

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      toast.warn('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/auth/verify-otp', { email: email.trim(), otp: otp.trim(), newPassword });
      toast.success('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to verify OTP';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      toast.warn('Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/api/auth/request-otp', { email: email.trim() });
      toast.success(res.data.message || 'OTP resent to your email');

      // Start cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to resend OTP';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
          Verify OTP
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
          {maskedEmail ? `OTP sent to ${maskedEmail}` : 'Enter the OTP sent to your email'}
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
          <TextField
            fullWidth
            label="OTP (6 digits)"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            sx={{ mb: 2 }}
            disabled={loading}
            inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
            disabled={loading}
          />
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Verifying...' : 'Reset Password'}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendOtp}
              disabled={loading || resendCooldown > 0}
              sx={{ py: 1.5 }}
            >
              {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend OTP'}
            </Button>
          </Stack>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" sx={{ fontSize: 14 }}>
              Back to Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerifyOtp;
