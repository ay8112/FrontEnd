import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { BADGE_THRESHOLDS, computeCurrentBadge, getLastBadgeName } from '../services/achievementService';

/**
 * Props:
 * - reportCount: number
 * - onUnlock?: (badge) => void  // called when a new badge is unlocked
 */
const BadgeDisplay = ({ reportCount = 0, onUnlock }) => {
  const [justUnlocked, setJustUnlocked] = useState(false);
  const currentBadge = useMemo(() => computeCurrentBadge(reportCount), [reportCount]);

  useEffect(() => {
    if (!currentBadge) return;
    const last = getLastBadgeName();
    if (last !== currentBadge.name) {
      setJustUnlocked(true);
      onUnlock?.(currentBadge);
      const t = setTimeout(() => setJustUnlocked(false), 2200);
      return () => clearTimeout(t);
    }
  }, [currentBadge, onUnlock]);

  const nextBadge = useMemo(() => {
    if (!currentBadge) return BADGE_THRESHOLDS[0];
    const idx = BADGE_THRESHOLDS.findIndex(b => b.name === currentBadge.name);
    return BADGE_THRESHOLDS[idx + 1] || null;
  }, [currentBadge]);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.35)' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Your Civic Badge</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 44,
            background: justUnlocked ? 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(0,200,255,0.15))' : 'rgba(255,255,255,0.9)',
            boxShadow: justUnlocked ? '0 0 24px rgba(0,200,255,0.75), 0 0 48px rgba(0,200,255,0.35)' : '0 0 10px rgba(0,0,0,0.08)',
            transition: 'all 400ms ease',
            animation: justUnlocked ? 'ccai-pulse 1100ms ease-in-out 2' : 'none',
          }}
        >
          {currentBadge ? currentBadge.icon : '🌱'}
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {currentBadge ? `${currentBadge.name} Achiever` : 'New Citizen'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reports filed: <strong>{reportCount}</strong>
          </Typography>
          {nextBadge && (
            <Typography variant="body2" color="text.secondary">
              {`${Math.max(0, nextBadge.count - reportCount)} more to reach ${nextBadge.name}`}
            </Typography>
          )}
        </Box>
      </Box>

      <style>{`
        @keyframes ccai-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Paper>
  );
};

export default BadgeDisplay;
