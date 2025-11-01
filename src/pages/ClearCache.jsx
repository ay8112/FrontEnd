import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';

const ClearCache = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear achievement cache
    localStorage.removeItem('ccai_report_count');
    localStorage.removeItem('ccai_earned_badges');
    localStorage.removeItem('ccai_last_badge_name');
    console.log('✅ Achievement cache cleared!');
    
    // Force reload the page to clear any cached JavaScript
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          🔄 Clearing Cache...
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please wait while we clear your achievement cache and reload the page...
        </Typography>
      </Paper>
    </Container>
  );
};

export default ClearCache;
