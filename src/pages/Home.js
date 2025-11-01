import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Typography, Button, Grid
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Paper elevation={6} sx={{ p: 8, textAlign: 'center', width: '100%' }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {t('homeWelcomeTitle')}
        </Typography>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 6 }}>
          {t('homeWelcomeSubtitle')}
        </Typography>
        
        <Grid container spacing={6} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 5, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <PersonIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {t('citizenLogin')}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4, textAlign: 'center' }}>
                {t('citizenLoginSubtitle')}
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ py: 2, fontSize: '1.1rem', mb: 2 }}
                onClick={() => navigate('/login')}
              >
                {t('citizenLogin')}
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                sx={{ py: 2, fontSize: '1.1rem' }}
                onClick={() => navigate('/register')}
              >
                {t('registerNewAccount')}
              </Button>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Paper 
              elevation={4} 
              sx={{ 
                p: 5, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 8
                }
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 80, color: 'white', mb: 3 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
                {t('adminLogin')}
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'white', textAlign: 'center' }}>
                {t('adminLoginSubtitle')}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                sx={{ py: 2, fontSize: '1.1rem' }}
                onClick={() => navigate('/admin-login')}
              >
                {t('adminLogin')}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;
