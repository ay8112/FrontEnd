import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  InputAdornment,
  IconButton,
  Link as MuiLink
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, VpnKey } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const steps = ['Enter Email', 'Verify OTP', 'Set New Password'];

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/admin-auth/reset-request', { email });
      toast.success(response.data.message || 'OTP sent to your email');
      
      // For development (dry run), show OTP in console
      if (response.data.dryRun && response.data.otp) {
        console.log('📧 [DEV MODE] OTP:', response.data.otp);
        toast.info(`DEV MODE: OTP is ${response.data.otp}`);
      }
      
      setActiveStep(1);
    } catch (err) {
      const message = err.error || err.message || 'Failed to send OTP';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/admin-auth/verify-otp', { email, otp });
      setResetToken(response.data.resetToken);
      toast.success('OTP verified successfully');
      setActiveStep(2);
    } catch (err) {
      const message = err.error || err.message || 'Invalid OTP';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/admin-auth/update-password', {
        email,
        resetToken,
        newPassword
      });
      toast.success('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (err) {
      const message = err.error || err.message || 'Failed to update password';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box component="form" onSubmit={handleRequestOTP} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Admin Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box component="form" onSubmit={handleVerifyOTP} sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              We've sent a 6-digit OTP to <strong>{email}</strong>. The OTP is valid for 15 minutes.
            </Alert>
            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              margin="normal"
              autoFocus
              inputProps={{ maxLength: 6, style: { fontSize: '24px', letterSpacing: '8px', textAlign: 'center' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || otp.length !== 6}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => setActiveStep(0)}
              disabled={loading}
            >
              ← Back to Email
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box component="form" onSubmit={handleUpdatePassword} sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              OTP verified! Please set your new password.
            </Alert>
            <TextField
              fullWidth
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              margin="normal"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              margin="normal"
              error={confirmPassword && newPassword !== confirmPassword}
              helperText={confirmPassword && newPassword !== confirmPassword ? 'Passwords do not match' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Paper elevation={3} sx={{ width: '100%', p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              🔐 Reset Admin Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Secure password reset with OTP verification
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {renderStepContent()}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
              <MuiLink
                component="button"
                type="button"
                onClick={() => navigate('/admin/login')}
                sx={{ cursor: 'pointer' }}
              >
                Back to Login
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminForgotPassword;
