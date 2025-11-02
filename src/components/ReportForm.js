import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Box,
  Typography,
  Slider,
  Alert,
  CircularProgress,
} from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import PlaceIcon from '@mui/icons-material/Place';
import SendIcon from '@mui/icons-material/Send';
import RefreshIcon from '@mui/icons-material/Refresh';
import LocationMap from './LocationMap';
import VoiceInput from './VoiceInput';
import CameraCapture from './CameraCapture';
import reportService from '../services/reportService';
import classifyService from '../services/classifyService';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ReportForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    description: '',
    category: 'plastic',
    severity: 1,
    address: '',
  });
  const { t } = useTranslation();
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [useAutoLocation, setUseAutoLocation] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  
  // Create image preview URL and clean up on unmount or image change
  const imagePreviewUrl = useMemo(() => {
    if (!image) return null;
    return URL.createObjectURL(image);
  }, [image]);

  useEffect(() => {
    // Cleanup function to revoke object URL
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const scrollToCategory = () => {
    try {
      const el = document.getElementById('category-field');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const btn = el.querySelector('div[role="button"], input, select');
          if (btn && typeof btn.focus === 'function') btn.focus();
        }, 300);
      }
    } catch (_) {
      // noop
    }
  };
  // Refresh geolocation and reverse-geocode address
  const refreshLocation = async () => {
    if (!navigator.geolocation) {
      setError(t('geolocationNotSupported'));
      setUseAutoLocation(false);
      return;
    }
    try {
      setLoading(true);
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await api.post('/api/location', {
                lat: latitude,
                lng: longitude
              });
              const data = res.data;
              if (data.address) {
                setFormData((prev) => ({ ...prev, address: data.address }));
                setLocation({ latitude, longitude });
                toast.success(t('locationUpdated'));
              } else {
                throw new Error(data?.error || t('reverseGeocodeFailed'));
              }
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          (geoErr) => reject(geoErr),
          { enableHighAccuracy: true, timeout: 10000 }
        );
      });
    } catch (err) {
      console.error('Failed to fetch address:', err);
      setError(t('couldNotFetchLocation'));
      toast.error(t('failedToGetCurrentLocation'));
      setUseAutoLocation(false);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch location and address on mount (auto mode)
  useEffect(() => {
    if (useAutoLocation) {
      refreshLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Forward geocode when address edited manually (debounced)
  useEffect(() => {
    const canGeocode = !useAutoLocation && formData.address && formData.address.trim().length > 5;
    if (!canGeocode) return;
    const t = setTimeout(async () => {
      try {
        const res = await api.post('/api/location/geocode', {
          address: formData.address.trim()
        });
        const data = res.data;
        if (typeof data.lat === 'number' && typeof data.lng === 'number') {
          setLocation({ latitude: data.lat, longitude: data.lng });
        }
      } catch (err) {
        // ignore
      }
    }, 600);
    return () => clearTimeout(t);
  }, [useAutoLocation, formData.address]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Client-side validation
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error(t('onlyJpegPng'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('imageTooLarge'));
      return;
    }
    setImage(file);
    // Auto-run classification
    classifyImage(file);
  };

  const handleVoiceResult = (text) => {
    if (!text) return;
    setFormData((prev) => ({ ...prev, description: (prev.description ? (prev.description + ' ') : '') + text }));
  };

  const classifyImage = async (file) => {
    try {
      setClassifying(true);
      setPrediction(null);
      const res = await classifyService.classify(file);
      if (res?.wasteType) {
        setPrediction(res);
        const conf = typeof res.confidence === 'number' ? res.confidence : 0;
        // Only auto-apply category when confident enough; otherwise, suggest only
        if (conf >= 0.65) {
          setFormData((p) => ({ ...p, category: res.wasteType }));
          toast.success(t('predictedTypeWithConf', { type: res.wasteType, conf: Math.round(conf * 100) }));
        } else {
          toast.info(t('lowConfidenceType', { type: res.wasteType, conf: Math.round(conf * 100) }));
        }
      } else {
        toast.error(t('classificationFailed'));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || t('classificationFailed'));
    } finally {
      setClassifying(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(t('geolocationNotSupported'));
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(t('errorGettingLocation') + ': ' + err.message);
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError(t('pleaseSelectImage'));
      toast.error(t('pleaseSelectImage'));
      return;
    }
    const descLen = formData.description ? formData.description.trim().length : 0;
    if (descLen < 3) {
      setError(t('descMin'));
      toast.error(t('descMin'));
      return;
    }
    if (descLen > 120) {
      setError(t('descMax'));
      toast.error(t('descMax'));
      return;
    }
    if (!formData.address || formData.address.trim().length < 3) {
      setError(t('enterValidAddress'));
      toast.error(t('enterValidAddress'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = new FormData();
      data.append('image', image);
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('severity', formData.severity);
      data.append('address', formData.address.trim());
      if (location?.latitude && location?.longitude) {
        data.append('latitude', location.latitude);
        data.append('longitude', location.longitude);
      } else {
        // Default coords if location not available
        data.append('latitude', 28.6139);
        data.append('longitude', 77.2090);
      }
      
      // Get user ID from JWT token
      const token = localStorage.getItem('token');
      let submittedBy = 'anonymous';
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          submittedBy = tokenPayload.id || 'anonymous';
        } catch (e) {
          console.error('Failed to decode token:', e);
        }
      }
      data.append('submittedBy', submittedBy);

      await reportService.createReport(data);
      // increment local report count for achievements
      try {
        const { incrementReportCount } = await import('../services/achievementService');
        incrementReportCount(1);
      } catch (_) {}
      
  toast.success(t('reportSubmitted'));
  setFormData({ description: '', category: 'plastic', severity: 1, address: '' });
      setImage(null);
      setLocation(null);
      setPrediction(null);

      onSubmitSuccess?.();
    } catch (err) {
      // reportService throws either error.response.data or error.message
      let errorMsg = t('errorSubmittingReport');
      if (err && typeof err === 'object') {
        if (err.error) {
          errorMsg = err.error;
          if (Array.isArray(err.details) && err.details.length) {
            errorMsg += `: ${err.details.join('; ')}`;
          }
        } else if (typeof err.message === 'string') {
          errorMsg = err.message;
        }
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        p: 3,
        maxWidth: 700,
        mx: 'auto',
        borderRadius: 3,
        background: 'rgba(255,255,255,0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.35)',
        boxShadow: '0 0 12px rgba(0,170,255,0.25)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#000' }}>
        {t('submitWasteReport')}
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        {t('automaticImageClassifier')}
      </Typography>

      <Button
        component="label"
        variant="outlined"
        startIcon={<PhotoCamera />}
        sx={{ mb: 2, borderRadius: 2 }}
      >
        {t('uploadImage')}
        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
      </Button>
      <Button
        type="button"
        variant={showCamera ? 'contained' : 'outlined'}
        sx={{ mb: 2, ml: 1, borderRadius: 2 }}
        onClick={() => setShowCamera((s) => !s)}
        aria-label="Use camera to capture image"
      >
        {showCamera ? t('closeCamera') : t('useCamera')}
      </Button>
      {showCamera && (
        <Box sx={{ mb: 2 }}>
          <CameraCapture
            onCapture={(file) => {
              setImage(file);
              toast.success('✅ Image Captured! Now Closing Camera...', { autoClose: 2000 });
              // Close camera after capture
              setTimeout(() => setShowCamera(false), 1500);
              // classify captured image automatically
              classifyImage(file);
            }}
            onError={(msg) => toast.error(msg)}
          />
        </Box>
      )}
      {image && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
            {t('selected')}: {image.name}
          </Typography>
          {imagePreviewUrl && (
            <Box
              component="img"
              src={imagePreviewUrl}
              alt="Preview"
              sx={{
                maxWidth: '100%',
                maxHeight: 300,
                width: 'auto',
                height: 'auto',
                borderRadius: 2,
                border: '2px solid rgba(0,170,255,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                display: 'block',
                margin: '0 auto',
              }}
            />
          )}
        </Box>
      )}
      {classifying && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} thickness={4} />
        </Box>
      )}
      {prediction?.wasteType && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {t('predictedType')}: <strong>{prediction.wasteType}</strong>
            {typeof prediction.confidence === 'number' && ` (${Math.round(prediction.confidence * 100)}%)`}
          </Typography>
          <Button variant="text" size="small" onClick={scrollToCategory} sx={{ textTransform: 'none' }}>
            {t('selectManually')}
          </Button>
        </Box>
      )}

      <Box id="category-field">
        <TextField
          select
          fullWidth
          label={t('category')}
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        >
          <MenuItem value="plastic">{t('cat_plastic')}</MenuItem>
          <MenuItem value="paper">{t('cat_paper')}</MenuItem>
          <MenuItem value="metal">{t('cat_metal')}</MenuItem>
          <MenuItem value="glass">{t('cat_glass')}</MenuItem>
          <MenuItem value="organic">{t('cat_organic')}</MenuItem>
          <MenuItem value="cardboard">{t('cat_cardboard')}</MenuItem>
        </TextField>
      </Box>

      <Box sx={{ mb: 2 }}>
  <Typography gutterBottom id="severity-label">{t('severity')}</Typography>
        <Slider
          name="severity"
          value={Number(formData.severity)}
          onChange={(_, v) => setFormData((p) => ({ ...p, severity: v }))}
          valueLabelDisplay="auto"
          min={1}
          max={5}
          marks
          aria-labelledby="severity-label"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
        <TextField
          fullWidth
          label={t('address')}
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          InputProps={{ readOnly: useAutoLocation }}
          required
          inputProps={{ 'aria-label': 'Address' }}
        />
        <Button
          type="button"
          variant="outlined"
          onClick={refreshLocation}
          startIcon={<RefreshIcon />}
          disabled={loading || !useAutoLocation}
          sx={{ whiteSpace: 'nowrap' }}
        >
          {t('refresh')}
        </Button>
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={useAutoLocation}
            onChange={(e) => setUseAutoLocation(e.target.checked)}
          />
        }
  label={t('autoLocation')}
        sx={{ mb: 1 }}
      />
      {location && (
        <Typography variant="caption" sx={{ display: 'block', mb: 2 }}>
          {t('lat')}: {location.latitude.toFixed(5)} | {t('lng')}: {location.longitude.toFixed(5)}
        </Typography>
      )}

      {/* Map preview */}
      {location?.latitude && location?.longitude && (
        <Box sx={{ mb: 2 }}>
          <LocationMap
            lat={location.latitude}
            lng={location.longitude}
            onChange={({ latitude, longitude }) => {
              setLocation({ latitude, longitude });
            }}
            height={280}
            draggable
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <Typography variant="subtitle2" component="label" htmlFor="description-input">{t('description')}</Typography>
        <VoiceInput onResult={handleVoiceResult} onError={(e) => console.warn('voice error', e)} ariaLabel="Start voice input" />
      </Box>
      <TextField
        fullWidth
        id="description-input"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        multiline
        rows={3}
        sx={{ mb: 2 }}
        required
        inputProps={{ maxLength: 120 }}
  helperText={t('descHelper', {count: formData.description.length})}
        error={
          (formData.description.length > 0 && formData.description.length < 3) ||
          formData.description.length > 120
        }
        aria-label="Report description"
      />

      <Button
        type="button"
        variant={useAutoLocation ? (location ? 'contained' : 'outlined') : 'outlined'}
        startIcon={<PlaceIcon />}
        onClick={useAutoLocation ? refreshLocation : getCurrentLocation}
        disabled={loading}
        sx={{
          width: '100%',
          mb: 2,
          borderRadius: 2,
          boxShadow: useAutoLocation && location ? '0 0 10px rgba(0,170,255,0.4)' : 'none',
        }}
      >
        {useAutoLocation ? (location ? t('locationCaptured') : t('refreshLocation')) : t('getCurrentLocation')}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        endIcon={<SendIcon />}
        disabled={loading || (useAutoLocation && !location)}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 0 12px rgba(0,170,255,0.35)',
        }}
      >
        {loading ? t('submitting') : t('submit')}
      </Button>
    </Paper>
  );
};

export default ReportForm;