/**
 * Waste Type Classifier Component
 * Allows users to capture or upload images for waste type recognition
 * Displays prediction results with confidence scores
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardMedia,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RecyclingIcon from '@mui/icons-material/Recycling';
import Webcam from 'react-webcam';
import axios from 'axios';

const WasteClassifier = () => {
  // State management
  const [mode, setMode] = useState('upload'); // 'upload' or 'camera'
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraKey, setCameraKey] = useState(0); // Key to force camera remount

  // Refs
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Waste class information
  const wasteClasses = {
    cardboard: { icon: '📦', color: '#8B4513', recyclable: true, description: 'Cardboard boxes, packaging materials' },
    metal: { icon: '🥫', color: '#C0C0C0', recyclable: true, description: 'Metal cans, containers, utensils' },
    organic: { icon: '🍎', color: '#228B22', recyclable: false, compostable: true, description: 'Food waste, plant materials' },
    paper: { icon: '📄', color: '#4169E1', recyclable: true, description: 'Paper documents, newspapers, magazines' },
    plastic: { icon: '🍾', color: '#FF6347', recyclable: true, description: 'Plastic bottles, bags, containers' }
  };

  /**
   * Handle file upload from input
   */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    }
  };

  /**
   * Capture image from webcam
   */
  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          setImage(file);
          setImagePreview(imageSrc);
          setPrediction(null);
          setError(null);
          setCameraActive(false);
        })
        .catch(err => {
          console.error('Capture error:', err);
          setError('Failed to capture image. Please try again.');
        });
    }
  }, [webcamRef]);

  /**
   * Send image to backend for prediction
   */
  const classifyImage = async () => {
    if (!image) {
      setError('Please select or capture an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', image);

      // Send to backend with timeout
      const response = await axios.post('/api/waste-classification/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        // Increase timeout to account for TensorFlow cold start on Windows/CPU
        timeout: 130000 // 130s: first call may take ~60–120s
      });

      if (response.data.success) {
        setPrediction(response.data.data);
      } else {
        setError(response.data.message || 'Classification failed');
      }
    } catch (err) {
      console.error('Classification error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setError('The AI model took too long to respond. On the first run it can take up to ~2 minutes to load. Please try again.');
      } else if (err.response?.status === 500) {
        setError('Server error during classification. Please try again or use a different image.');
      } else {
        setError(
          err.response?.data?.message || 
          err.message ||
          'Failed to classify image. Please check your connection and try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset to initial state
   */
  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    setCameraActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Toggle camera mode
   */
  const toggleCamera = () => {
    const newCameraState = !cameraActive;
    setMode('camera');
    
    // Clear any existing preview when activating camera
    if (newCameraState) {
      setImagePreview(null);
      setImage(null);
      setPrediction(null);
      setError(null);
      setCameraKey(prev => prev + 1); // Force fresh camera mount
    }
    setCameraActive(newCameraState);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RecyclingIcon sx={{ fontSize: 48, color: 'white' }} />
          <Box>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
              Waste Type Classifier
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Upload or capture an image to identify waste type using AI
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Left Column - Image Input */}
        <Box>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Automatic Waste Image Classifier
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoOutlinedIcon color="primary" />
              Select Image Source
            </Typography>

            {/* Mode Selection */}
            <ButtonGroup fullWidth sx={{ mb: 3 }}>
              <Button
                variant={mode === 'upload' ? 'contained' : 'outlined'}
                startIcon={<UploadFileIcon />}
                onClick={() => { setMode('upload'); setCameraActive(false); }}
              >
                Upload File
              </Button>
              <Button
                variant={mode === 'camera' ? 'contained' : 'outlined'}
                startIcon={<CameraAltIcon />}
                onClick={toggleCamera}
              >
                Use Camera
              </Button>
            </ButtonGroup>

            {/* Upload Mode */}
            {mode === 'upload' && !cameraActive && (
              <Box>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="waste-image-upload"
                />
                <label htmlFor="waste-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    size="large"
                    startIcon={<UploadFileIcon />}
                    sx={{ py: 2 }}
                  >
                    Choose Image File
                  </Button>
                </label>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                  Supported: JPEG, PNG, GIF, WebP (Max 10MB)
                </Typography>
              </Box>
            )}

            {/* Camera Mode */}
            {mode === 'camera' && cameraActive && (
              <Box>
                <Box sx={{ borderRadius: 2, overflow: 'hidden', mb: 2, bgcolor: '#000', position: 'relative' }}>
                  <Webcam
                    key={cameraKey}
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    screenshotQuality={0.92}
                    width="100%"
                    style={{ display: 'block', minHeight: '400px', objectFit: 'cover' }}
                    videoConstraints={{
                      width: { ideal: 1280 },
                      height: { ideal: 720 }
                    }}
                    onUserMediaError={(err) => {
                      console.error('Camera error:', err);
                      setError('Camera not available. Please check permissions or try Upload mode.');
                      setCameraActive(false);
                    }}
                  />
                  {/* Scanning line overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '3px',
                      background: 'linear-gradient(90deg, transparent, #00ff00, transparent)',
                      animation: 'scan 2s linear infinite',
                      '@keyframes scan': {
                        '0%': { transform: 'translateY(0)' },
                        '100%': { transform: 'translateY(400px)' }
                      }
                    }}
                  />
                  {/* Tracking label */}
                  <Typography
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      color: '#ff0000',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      textShadow: '0 0 8px rgba(255,0,0,0.8)'
                    }}
                  >
                    ● TRACKING ACTIVE
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<CameraAltIcon />}
                    onClick={captureImage}
                    disabled={cameraLoading}
                  >
                    {cameraLoading ? 'Loading...' : 'Capture Photo'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setCameraActive(false);
                      setCameraLoading(false);
                    }}
                    sx={{ minWidth: '100px' }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}

            {/* Image Preview */}
            {imagePreview && !cameraActive && (
              <Card sx={{ mt: 3 }}>
                <CardMedia
                  component="img"
                  image={imagePreview}
                  alt="Selected waste"
                  sx={{ maxHeight: 400, objectFit: 'contain', bgcolor: '#f5f5f5' }}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={classifyImage}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                    >
                      {loading ? 'Classifying...' : 'Classify Waste'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleReset}
                      startIcon={<RestartAltIcon />}
                      disabled={loading}
                    >
                      Reset
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            )}
          </Paper>
        </Box>

        {/* Right Column - Results */}
        <Box>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Classification Results
            </Typography>

            {!prediction && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <RecyclingIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography color="textSecondary">
                  Upload or capture an image to see classification results
                </Typography>
              </Box>
            )}

            {loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography color="textSecondary">
                  Analyzing image...
                </Typography>
              </Box>
            )}

            {prediction && (
              <Box>
                {/* Main Prediction */}
                <Card 
                  sx={{ 
                    mb: 3, 
                    bgcolor: wasteClasses[prediction.predictedClass]?.color || '#666',
                    color: 'white'
                  }}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        {wasteClasses[prediction.predictedClass]?.icon || '❓'}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', textTransform: 'capitalize', mb: 1 }}>
                        {prediction.predictedClass}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                        {wasteClasses[prediction.predictedClass]?.description}
                      </Typography>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={`${prediction.percentage}% Confidence`}
                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }}
                      />
                    </Box>
                  </CardContent>
                </Card>

                {/* Disposal Information */}
                <Alert 
                  severity={wasteClasses[prediction.predictedClass]?.recyclable ? 'success' : 'info'}
                  sx={{ mb: 3 }}
                >
                  <AlertTitle>Disposal Information</AlertTitle>
                  {wasteClasses[prediction.predictedClass]?.recyclable && (
                    <Typography variant="body2">
                      ♻️ This waste is <strong>recyclable</strong>. Please dispose in recycling bins.
                    </Typography>
                  )}
                  {wasteClasses[prediction.predictedClass]?.compostable && (
                    <Typography variant="body2">
                      🌱 This waste is <strong>compostable</strong>. Can be used for composting.
                    </Typography>
                  )}
                  {!wasteClasses[prediction.predictedClass]?.recyclable && 
                   !wasteClasses[prediction.predictedClass]?.compostable && (
                    <Typography variant="body2">
                      🗑️ Please dispose according to local waste management guidelines.
                    </Typography>
                  )}
                </Alert>

                {/* All Predictions */}
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  All Predictions:
                </Typography>
                <List dense>
                  {prediction.allPredictions.map((pred, idx) => (
                    <React.Fragment key={idx}>
                      <ListItem>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                              {wasteClasses[pred.class]?.icon} {pred.class}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {pred.percentage}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={parseFloat(pred.percentage)} 
                            sx={{ height: 6, borderRadius: 1 }}
                          />
                        </Box>
                      </ListItem>
                      {idx < prediction.allPredictions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </Paper>

          {/* Info Card */}
          <Paper elevation={2} sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
            <Typography variant="caption" color="textSecondary">
              <strong>💡 Tip:</strong> For best results, ensure the waste item is clearly visible, 
              well-lit, and the main subject of the photo. Avoid blurry or dark images.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default WasteClassifier;
