import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, Stack } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const CameraCapture = ({ onCapture, onError }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    let active = true;
    const start = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (!active) { media.getTracks().forEach(t => t.stop()); return; }
        setStream(media);
        if (videoRef.current) {
          videoRef.current.srcObject = media;
          await videoRef.current.play();
        }
      } catch (e) {
        onError && onError(e.message || 'camera_error');
      }
    };
    start();
    return () => {
      active = false;
      try { stream?.getTracks().forEach(t => t.stop()); } catch (_) {}
    };
  }, []); // eslint-disable-line

  const capture = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture && onCapture(file);
    }, 'image/jpeg', 0.9);
  };

  return (
    <Box>
      <Stack spacing={1} alignItems="center">
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 480 }}>
          <video ref={videoRef} style={{ width: '100%', borderRadius: 8, display: 'block' }} playsInline muted />

          {/* Scanning line overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)',
              animation: 'scan 3s linear infinite',
              '@keyframes scan': {
                '0%': { transform: 'translateY(0)' },
                '100%': { transform: 'translateY(400px)' }
              },
              pointerEvents: 'none',
              opacity: 0.8
            }}
          />

          {/* Tracking label in red */}
          <Typography
            sx={{
              position: 'absolute',
              top: 10,
              left: 12,
              color: '#ff1744',
              fontSize: 12,
              fontFamily: 'monospace',
              textShadow: '0 0 6px rgba(255,23,68,0.6)',
              bgcolor: 'rgba(0,0,0,0.45)',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              letterSpacing: 1
            }}
          >
            ● TRACKING ACTIVE
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<CameraAltIcon />} onClick={capture}>Capture</Button>
      </Stack>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
};

export default CameraCapture;
