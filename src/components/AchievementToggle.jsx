import React, { useState } from 'react';
import { Box, Button, Collapse, Divider, Typography, Paper } from '@mui/material';
import CertificateModal from './CertificateModal';
import { getEarnedBadges } from '../services/achievementService';
import DownloadIcon from '@mui/icons-material/Download';

/**
 * Props:
 * - userName: string
 */
const AchievementToggle = ({ userName }) => {
  const [open, setOpen] = useState(true);
  const [modalState, setModalState] = useState({ open: false, badge: null, date: null });
  const earned = getEarnedBadges();

  const handleDownload = (badge, date) => {
    setModalState({ open: true, badge, date });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.35)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Achievements</Typography>
        <Button variant="outlined" onClick={() => setOpen((o) => !o)}>
          {open ? 'Hide' : 'Show'}
        </Button>
      </Box>
      <Collapse in={open}>
        <Divider sx={{ my: 2 }} />
        {earned.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No badges earned yet. Keep reporting to unlock badges!</Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 2 }}>
            {earned.map((b) => (
              <Box key={b.name} sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.9)', border: '1px solid #e0f7fa' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ fontSize: 28 }}>{b.icon}</Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{b.name}</Typography>
                    <Typography variant="caption" color="text.secondary">Earned on {new Date(b.date).toLocaleDateString()}</Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button size="small" startIcon={<DownloadIcon />} onClick={() => handleDownload(b, b.date)}>
                    Download Certificate
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">“Small acts, when multiplied by millions of people, can transform the world.”</Typography>
        </Box>
      </Collapse>

      <CertificateModal
        open={modalState.open}
        onClose={() => setModalState({ open: false, badge: null, date: null })}
        userName={userName}
        badge={modalState.badge}
        dateISO={modalState.date}
      />
    </Paper>
  );
};

export default AchievementToggle;
