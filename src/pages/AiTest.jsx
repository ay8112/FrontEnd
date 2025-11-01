import React, { useState } from 'react';
import { Container, Box, Typography, Button, Paper, CircularProgress } from '@mui/material';

export default function AiTest() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setResult(null);
    setError(null);
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onClassify = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('http://localhost:3000/api/classify', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to classify');
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 6 }}>
      <Paper elevation={6} sx={{ p: 3, backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.8)', borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Quick AI Test
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload a waste image to test the real AI model instantly. No login required.
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button variant="contained" component="label">
            Choose Image
            <input hidden type="file" accept="image/*" onChange={onFileChange} />
          </Button>
          {preview && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img src={preview} alt="preview" style={{ maxWidth: '100%', borderRadius: 12 }} />
            </Box>
          )}
          <Box>
            <Button disabled={!file || loading} variant="outlined" onClick={onClassify}>
              {loading ? (<><CircularProgress size={18} sx={{ mr: 1 }} /> Classifying...</>) : 'Classify Image'}
            </Button>
          </Box>
          {error && (
            <Typography color="error" variant="body2">{error}</Typography>
          )}
          {result && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Prediction</Typography>
              <Typography>Waste Type: <strong>{result.wasteType}</strong></Typography>
              <Typography>Confidence: <strong>{Math.round((result.confidence || 0) * 100)}%</strong></Typography>
              <Typography variant="caption" color="text.secondary">Endpoint: /api/classify</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
