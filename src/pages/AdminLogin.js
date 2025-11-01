import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/authService';
import {
  Container, Paper, TextField, Button, Typography,
  Alert, Box, Grid
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      const token = response.data.token;
      
      // Decode token to check role
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.role !== 'admin') {
  setError(t('accessDeniedAdminOnly'));
        setLoading(false);
        return;
      }

      login(token);
      navigate('/admin');
    } catch (err) {
  setError(err.response?.data?.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" align="center">
            {t('adminLogin')}
          </Typography>
        </Box>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
          {t('adminOnlySubtitle')}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label={t('adminEmail')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label={t('adminPassword')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? t('loggingIn') : t('adminLogin')}
          </Button>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  {t('regularUserLogin')}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 1 }}>
              <Link to="/admin/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="text.secondary">
                  🔁 Forgot Admin Password?
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
