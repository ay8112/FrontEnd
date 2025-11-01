import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';

const VoiceInput = ({ onResult, onError, lang = 'en-IN', ariaLabel = 'Voice input' }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript;
      }
      if (finalTranscript && onResult) onResult(finalTranscript.trim());
    };
    rec.onerror = (e) => { onError && onError(e.error || 'speech_error'); setListening(false); };
    rec.onend = () => setListening(false);

    recognitionRef.current = rec;
    return () => { try { rec.abort(); } catch (_) {} };
  }, [lang, onResult, onError]);

  const start = () => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.start(); setListening(true); } catch (_) {}
  };
  const stop = () => { try { recognitionRef.current?.stop(); } catch (_) {} };

  const available = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button
        type="button"
        variant={listening ? 'contained' : 'outlined'}
        color={listening ? 'secondary' : 'primary'}
        size="small"
        startIcon={<KeyboardVoiceIcon />}
        onClick={listening ? stop : start}
        disabled={!available}
        aria-label={ariaLabel}
      >
        {listening ? 'Stop' : 'Speak'}
      </Button>
      {!available && (
        <Typography variant="caption" color="text.secondary">Voice input not supported in this browser.</Typography>
      )}
    </Box>
  );
};

export default VoiceInput;
