import React, { useMemo, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { sanitizeName } from '../services/achievementService';
import ccLogo from '../logo.svg';

/**
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - userName: string
 * - badge: { name: string, count: number, icon: string }
 * - dateISO: string (ISO date string)
 */
const CertificateModal = ({ open, onClose, userName, badge, dateISO }) => {
  const certRef = useRef(null);
  const displayDate = useMemo(() => new Date(dateISO || Date.now()).toLocaleDateString(), [dateISO]);
  const safeName = useMemo(() => sanitizeName(userName), [userName]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    const node = certRef.current;
    // Ensure white background for print
    const canvas = await html2canvas(node, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    const filename = `${safeName.replace(/\s+/g, '_')}_${badge?.name || 'Civic'}_Certificate.pdf`;
    pdf.save(filename);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Download Certificate</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Preview is shown below. Click Download to export as PDF.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {/* Visible certificate preview */}
          <Box
            ref={certRef}
            sx={{
              width: 960,
              height: 640,
              p: 4,
              position: 'relative',
              background: 'linear-gradient(135deg, #ffffff, #f4fbff)',
              border: '2px solid #b3e5fc',
              borderRadius: 2,
              boxShadow: '0 0 18px rgba(3,169,244,0.25) inset',
              overflow: 'hidden',
            }}
          >
            {/* Logos */}
            <Box sx={{ position: 'absolute', top: 16, left: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
              <img src={'/assets/up-govt-logo.png'} alt="UP Govt" width={58} height={58} style={{ opacity: 0.9 }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <Typography variant="subtitle2" sx={{ color: '#333' }}>Government of Uttar Pradesh</Typography>
            </Box>
            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
              <img src={ccLogo} alt="UP Swachhta Mitra" width={58} height={58} style={{ opacity: 0.95 }} />
              <Typography variant="subtitle2" sx={{ color: '#333' }}>UP Swachhta Mitra</Typography>
            </Box>

            {/* Title */}
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#0277bd', letterSpacing: 1 }}>Certificate of Civic Achievement</Typography>
              <Typography variant="subtitle1" sx={{ color: '#455a64', mt: 1 }}>Presented by UP Swachhta Mitra and Government of Uttar Pradesh</Typography>
            </Box>

            {/* Recipient */}
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="h6" sx={{ color: '#607d8b' }}>This certificate is proudly awarded to</Typography>
              <Typography variant="h2" sx={{ fontWeight: 700, color: '#263238', mt: 1 }}>{safeName}</Typography>
              <Typography variant="h5" sx={{ color: '#37474f', mt: 3 }}>For achieving the {badge?.name || 'Civic'} Badge</Typography>
              <Typography variant="body1" sx={{ color: '#546e7a', mt: 1 }}>in recognition of filing {badge?.count ?? ''}+ civic reports and contributing to a cleaner city.</Typography>
            </Box>

            {/* Badge Icon */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Box sx={{ fontSize: 72 }}>{badge?.icon || '🌟'}</Box>
            </Box>

            {/* Footer */}
            <Box sx={{ position: 'absolute', bottom: 24, left: 0, right: 0, px: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: '#546e7a' }}>Date: {displayDate}</Typography>
              <Typography variant="body2" sx={{ color: '#546e7a' }}>Certificate ID: CCAI-{(badge?.name || 'CIVIC').replace(/\s/g,'').toUpperCase()}-{new Date(dateISO||Date.now()).getTime()}</Typography>
            </Box>

            {/* Watermark */}
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.06 }}>
              <img src={'/assets/up-govt-logo.png'} alt="UP Watermark" style={{ maxWidth: '60%', filter: 'grayscale(100%)' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={handleDownload}>Download PDF</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CertificateModal;
