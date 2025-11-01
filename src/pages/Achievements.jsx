import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import BadgeDisplay from '../components/BadgeDisplay';
import AchievementToggle from '../components/AchievementToggle';
import { addEarnedBadge, computeCurrentBadge, fetchReportCountFromAPI, sanitizeName, BADGE_THRESHOLDS, getEarnedBadges, setReportCount } from '../services/achievementService';
import { useAuth } from '../context/AuthContext';
import CertificateModal from '../components/CertificateModal';

const Achievements = () => {
  const { user } = useAuth();
  const [reportCount, setReportCountState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, badge: null, date: null });

  const userName = useMemo(() => sanitizeName(user?.email?.split('@')[0] || 'Citizen'), [user]);

  // Fetch actual report count from API and recalculate badges
  useEffect(() => {
    const loadReportCount = async () => {
      setLoading(true);
      const count = await fetchReportCountFromAPI();
      setReportCountState(count);
      
      // Recalculate and update badges based on actual count
      recalculateBadges(count);
      setLoading(false);
    };
    loadReportCount();
    
    // Refresh every time the component mounts to ensure sync
    const interval = setInterval(() => {
      loadReportCount();
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Recalculate badges: remove badges that are no longer earned
  const recalculateBadges = (count) => {
    const earnedBadges = getEarnedBadges();
    const validBadges = earnedBadges.filter(badge => count >= badge.count);
    
    // Update localStorage with only valid badges
    localStorage.setItem('ccai_earned_badges', JSON.stringify(validBadges));
    
    // Add current badge if not already earned
    const currentBadge = computeCurrentBadge(count);
    if (currentBadge) {
      addEarnedBadge(currentBadge);
    }
  };

  const handleUnlock = useCallback((badge) => {
    const withDate = addEarnedBadge(badge);
    setModal({ open: true, badge, date: withDate?.date || new Date().toISOString() });
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        Loading achievements...
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', display: 'grid', gap: 2 }}>
        <BadgeDisplay reportCount={reportCount} onUnlock={handleUnlock} />
        <AchievementToggle userName={userName} />
      </Box>
      <CertificateModal
        open={modal.open}
        onClose={() => setModal({ open: false, badge: null, date: null })}
        userName={userName}
        badge={modal.badge}
        dateISO={modal.date}
      />
    </Container>
  );
};

export default Achievements;
