import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Box, Divider, Fade, Slide } from '@mui/material';
import ReportForm from '../components/ReportForm';
import ReportsList from '../components/ReportsList';
import AppLayout from '../components/AppLayout';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TwitterIcon from '@mui/icons-material/Twitter';
import MapIcon from '@mui/icons-material/Map';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('submit');
  const [refreshKey, setRefreshKey] = useState(0);
  const submitRef = useRef(null);
  const listRef = useRef(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // trigger initial fade/slide animations on mount
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmitSuccess = () => {
    // Refresh the reports list and scroll to it after successful submit
    setRefreshKey(prev => prev + 1);
    setActiveTab('list');
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const sidebarItems = [
    { key: 'submit', label: t('submitReport'), icon: <AddLocationAltIcon />, active: activeTab === 'submit' },
    { key: 'list', label: t('viewReports'), icon: <ListAltIcon />, active: activeTab === 'list' },
    { key: 'waste-classifier', label: 'AI Waste Classifier', icon: <CameraAltIcon />, to: '/waste-classifier' },
    { key: 'heatmap', label: t('heatmap'), icon: <MapIcon />, to: '/heatmap' },
    { key: 'achievements', label: t('achievements'), icon: <EmojiEventsIcon />, to: '/achievements' },
    { key: 'twitter-updates', label: t('socialUpdates'), icon: <TwitterIcon />, to: '/social-media-updates' },
  ];

  return (
    <AppLayout
      sidebarItems={sidebarItems}
      onSidebarClick={(key) => {
        if (key === 'achievements' || key === 'twitter-updates' || key === 'heatmap' || key === 'waste-classifier') {
          const route = key === 'achievements' ? '/achievements' : 
                       key === 'twitter-updates' ? '/social-media-updates' :
                       key === 'waste-classifier' ? '/waste-classifier' : '/heatmap';
          navigate(route);
          return;
        }
        setActiveTab(key);
        const target = key === 'submit' ? submitRef.current : listRef.current;
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#000' }}>{t('userDashboardTitle')}</Typography>
      </Box>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.35)',
          boxShadow: '0 0 12px rgba(0,170,255,0.25)',
        }}
      >
        <Fade in={animateIn} timeout={600}>
          <Box ref={submitRef} id="submit-section" sx={{ scrollMarginTop: 80 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#000' }}>{t('submitReport')}</Typography>
            <ReportForm onSubmitSuccess={handleSubmitSuccess} />
          </Box>
        </Fade>

        <Divider sx={{ my: 4, opacity: 0.6 }} />

        <Slide in={animateIn} direction="up" timeout={700}>
          <Box ref={listRef} id="list-section" sx={{ scrollMarginTop: 80 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#000' }}>{t('viewReports')}</Typography>
            <ReportsList key={refreshKey} />
          </Box>
        </Slide>
      </Paper>
    </AppLayout>
  );
};

export default Dashboard;