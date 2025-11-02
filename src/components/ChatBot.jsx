import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  Avatar,
  Fab,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Chip,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatLang, setChatLang] = useState('en');
  const [aiMode, setAiMode] = useState(true); // AI mode enabled by default
  const [showSuggestions, setShowSuggestions] = useState(true); // Show suggestions initially
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Quick suggestion topics
  const suggestions = {
    en: [
      { label: '📝 Report Submission', query: 'How do I submit a waste report?' },
      { label: '🌐 Language Switching', query: 'How to change language?' },
      { label: '📸 Photo/Camera', query: 'How to upload photos?' },
      { label: '🎤 Voice Input', query: 'How to use voice input?' },
      { label: '📊 Dashboard', query: 'Tell me about the dashboard' },
      { label: '📥 Export/Download', query: 'How to export reports?' },
      { label: '🔒 Privacy/Security', query: 'Is my data secure?' },
      { label: '📍 Location/GPS', query: 'How does location tracking work?' },
      { label: '❓ Help/Support', query: 'How can I get help?' },
      { label: '🚀 Getting Started', query: 'How do I get started?' },
      { label: '📈 Report Status', query: 'How to track my report status?' },
      { label: '🗑️ Waste Types', query: 'What waste types can I report?' },
      { label: '📋 Categories', query: 'What are waste categories?' },
      { label: '🏆 Achievements', query: 'How do achievements work?' },
      { label: '🗺️ Heatmap', query: 'What is the heatmap?' },
    ],
    hi: [
      { label: '📝 रिपोर्ट सबमिट करें', query: 'मैं कचरा रिपोर्ट कैसे करूं?' },
      { label: '🌐 भाषा बदलें', query: 'भाषा कैसे बदलें?' },
      { label: '📸 फोटो/कैमरा', query: 'फोटो कैसे अपलोड करें?' },
      { label: '🎤 वॉइस इनपुट', query: 'वॉइस इनपुट कैसे उपयोग करें?' },
      { label: '📊 डैशबोर्ड', query: 'डैशबोर्ड के बारे में बताएं' },
      { label: '📥 एक्सपोर्ट/डाउनलोड', query: 'रिपोर्ट कैसे एक्सपोर्ट करें?' },
      { label: '🔒 गोपनीयता/सुरक्षा', query: 'क्या मेरा डेटा सुरक्षित है?' },
      { label: '📍 स्थान/जीपीएस', query: 'स्थान ट्रैकिंग कैसे काम करता है?' },
      { label: '❓ मदद/सहायता', query: 'मुझे मदद कैसे मिलेगी?' },
      { label: '🚀 शुरू करें', query: 'मैं कैसे शुरू करूं?' },
      { label: '📈 रिपोर्ट स्टेटस', query: 'अपनी रिपोर्ट का स्टेटस कैसे देखें?' },
      { label: '🗑️ कचरा प्रकार', query: 'मैं किस प्रकार का कचरा रिपोर्ट कर सकता हूं?' },
      { label: '📋 श्रेणियां', query: 'कचरा श्रेणियां क्या हैं?' },
      { label: '🏆 उपलब्धियां', query: 'उपलब्धियां कैसे काम करती हैं?' },
      { label: '🗺️ हीटमैप', query: 'हीटमैप क्या है?' },
    ]
  };

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatbot_messages');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
        // Hide suggestions if there are existing messages
        if (parsed.length > 0) {
          setShowSuggestions(false);
        }
      }
    } catch (err) {
      console.error('Error loading chatbot messages:', err);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      if (messages.length > 0) {
        localStorage.setItem('chatbot_messages', JSON.stringify(messages));
      }
    } catch (err) {
      console.error('Error saving chatbot messages:', err);
    }
  }, [messages]);

  // Listen for logout event to clear chat data
  useEffect(() => {
    const handleLogout = () => {
      // Clear all chat data
      setMessages([]);
      setInput('');
      setOpen(false);
      setIsLoading(false);
      
      // Stop voice input if active
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }

      // Clear localStorage
      try {
        localStorage.removeItem('chatbot_messages');
        localStorage.removeItem('chatbot_lang');
      } catch (err) {
        console.error('Error clearing chatbot data:', err);
      }
    };

    // Add event listener for logout
    window.addEventListener('user-logout', handleLogout);

    // Cleanup
    return () => {
      window.removeEventListener('user-logout', handleLogout);
    };
  }, [isListening]);

  // Initialize chat language from i18n or localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chatbot_lang');
    if (saved && ['en', 'hi'].includes(saved)) {
      setChatLang(saved);
    } else {
      setChatLang(i18n.language || 'en');
    }
  }, [i18n.language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = chatLang === 'hi' ? 'hi-IN' : 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('🎤 Voice recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('📝 Recognized:', transcript);
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        
        // Show user-friendly error messages
        if (event.error === 'no-speech') {
          const msg = chatLang === 'hi' 
            ? 'कोई आवाज़ नहीं सुनी गई। कृपया पुनः प्रयास करें।'
            : 'No speech detected. Please try again.';
          setTimeout(() => alert(msg), 100);
        } else if (event.error === 'not-allowed') {
          const msg = chatLang === 'hi' 
            ? 'माइक्रोफ़ोन की अनुमति आवश्यक है। कृपया ब्राउज़र सेटिंग्स जांचें।'
            : 'Microphone permission required. Please check browser settings.';
          setTimeout(() => alert(msg), 100);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('🛑 Voice recognition ended');
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [chatLang]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user', timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Show loading immediately for better UX
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      // Get user ID from localStorage if available
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id || user.id;

      // Call AI-powered backend endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000); // 18 second timeout (longer than backend)

      const res = await api.post('/api/chatbot', {
        message: currentInput,
        lang: chatLang,
        userId,
        useAI: aiMode
      }, {
        signal: controller.signal,
        timeout: 18000
      });

      clearTimeout(timeoutId);

      const botReply = res.data.reply;
      const source = res.data.source || 'unknown';
      const cached = res.data.cached || false;

      // Simulate thinking time for cached responses
      const delay = cached ? 300 : 500;

      setTimeout(() => {
        const botMessage = { 
          text: botReply, 
          sender: 'bot', 
          timestamp: new Date(),
          source,
          isAI: source === 'ai',
          cached
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, delay);

    } catch (err) {
      console.error('Chatbot error:', err);
      
      let errorMsg;
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMsg = chatLang === 'hi' 
          ? 'प्रतिक्रिया में बहुत समय लग रहा है। कृपया छोटा प्रश्न पूछें।'
          : 'Response taking too long. Please ask a shorter question.';
      } else {
        errorMsg = chatLang === 'hi' 
          ? 'माफ़ करें, मुझे समस्या हो रही है। कृपया पुनः प्रयास करें।'
          : 'Sorry, I\'m having trouble. Please try again.';
      }
      
      setTimeout(() => {
        const botMessage = { text: errorMsg, sender: 'bot', timestamp: new Date() };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 300);
    }
  };

  const handleSuggestionClick = (query) => {
    setInput(query);
    // Auto-send the query
    setTimeout(() => {
      const sendBtn = document.querySelector('[aria-label="Send message"]');
      if (sendBtn) sendBtn.click();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      const msg = chatLang === 'hi' 
        ? 'वॉइस इनपुट आपके ब्राउज़र में समर्थित नहीं है।'
        : 'Voice input is not supported in your browser.';
      alert(msg);
      return;
    }

    if (isListening) {
      // Second click - STOP listening
      console.log('🛑 User clicked to STOP listening');
      recognitionRef.current.stop();
      // State will be updated by onend handler
    } else {
      // First click - START listening
      console.log('🎤 User clicked to START listening');
      try {
        recognitionRef.current.lang = chatLang === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
        // State will be updated by onstart handler
      } catch (error) {
        console.error('❌ Error starting voice recognition:', error);
        const msg = chatLang === 'hi' 
          ? 'वॉइस इनपुट शुरू करने में समस्या। कृपया पुनः प्रयास करें।'
          : 'Could not start voice input. Please try again.';
        alert(msg);
      }
    }
  };

  const handleLangChange = (val) => {
    setChatLang(val);
    localStorage.setItem('chatbot_lang', val);
    i18n.changeLanguage(val);
    if (recognitionRef.current) {
      recognitionRef.current.lang = val === 'hi' ? 'hi-IN' : 'en-US';
    }
  };

  const handleClearChat = () => {
    // Confirm before clearing
    const confirmMsg = chatLang === 'hi' 
      ? 'क्या आप सभी चैट संदेश मिटाना चाहते हैं?' 
      : 'Are you sure you want to clear all chat messages?';
    
    if (window.confirm(confirmMsg)) {
      setMessages([]);
      setInput('');
      setShowSuggestions(true); // Show suggestions again after clearing
      
      try {
        localStorage.removeItem('chatbot_messages');
      } catch (err) {
        console.error('Error clearing messages:', err);
      }
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="Open chatbot"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chat Window */}
      <Collapse in={open}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: { xs: 'calc(100vw - 48px)', sm: 400 },
            maxWidth: 400,
            height: 550,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            borderRadius: 3,
            overflow: 'hidden',
          }}
          role="region"
          aria-label="Chatbot window"
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="h6">UP Swachhta Mitra Assistant</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={chatLang === 'hi' ? 'चैट साफ़ करें' : 'Clear Chat'}>
                <IconButton
                  size="small"
                  onClick={handleClearChat}
                  sx={{ color: 'white' }}
                  aria-label="Clear chat history"
                >
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel sx={{ color: 'white' }}>Lang</InputLabel>
                <Select
                  value={chatLang}
                  onChange={(e) => handleLangChange(e.target.value)}
                  label="Lang"
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '.MuiSvgIcon-root': { color: 'white' },
                  }}
                >
                  <MenuItem value="en">EN</MenuItem>
                  <MenuItem value="hi">HI</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Messages Area */}
          <List
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#f5f5f5',
            }}
            aria-live="polite"
            aria-atomic="false"
            role="log"
          >
            {messages.length === 0 && (
              <ListItem sx={{ justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
                  {chatLang === 'hi'
                    ? 'नमस्ते! मैं UP Swachhta Mitra सहायक हूँ। मैं आपकी कैसे मदद कर सकता हूँ?'
                    : 'Hello! I am UP Swachhta Mitra Assistant. How can I help you?'}
                </Typography>

                {/* Quick Suggestions */}
                {showSuggestions && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mb: 1, 
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'primary.main'
                      }}
                    >
                      {chatLang === 'hi' ? '💡 त्वरित सुझाव - किसी भी विषय पर क्लिक करें:' : '💡 Quick Topics - Click any to learn more:'}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        justifyContent: 'center',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        p: 1
                      }}
                    >
                      {suggestions[chatLang].map((suggestion, idx) => (
                        <Chip
                          key={idx}
                          label={suggestion.label}
                          onClick={() => handleSuggestionClick(suggestion.query)}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: 'white',
                            },
                            transition: 'all 0.2s'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </ListItem>
            )}
            {messages.map((msg, idx) => (
              <ListItem
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                    maxWidth: '80%',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: msg.sender === 'user' ? 'secondary.main' : 'primary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {msg.sender === 'user' ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
                  </Avatar>
                  <Box>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: msg.sender === 'user' ? '#e3f2fd' : 'white',
                      }}
                    >
                      <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
                        {msg.text}
                      </Typography>
                    </Paper>
                    {msg.sender === 'bot' && msg.isAI && (
                      <Chip
                        icon={<AutoAwesomeIcon />}
                        label={chatLang === 'hi' ? 'AI द्वारा संचालित' : 'AI Powered'}
                        size="small"
                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                        color="primary"
                        variant="outlined"
                      />
                    )}
                    {/* Show suggestions after each bot message */}
                    {msg.sender === 'bot' && idx === messages.length - 1 && !isLoading && (
                      <Box sx={{ mt: 2, width: '100%' }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'block', 
                            mb: 1, 
                            fontWeight: 'bold',
                            color: 'primary.main'
                          }}
                        >
                          {chatLang === 'hi' ? '💡 अन्य प्रश्न पूछें:' : '💡 Ask about:'}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.8,
                            maxWidth: '400px'
                          }}
                        >
                          {suggestions[chatLang].slice(0, 8).map((suggestion, sIdx) => (
                            <Chip
                              key={sIdx}
                              label={suggestion.label}
                              onClick={() => handleSuggestionClick(suggestion.query)}
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={{
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                height: '24px',
                                '&:hover': {
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                },
                                transition: 'all 0.2s'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              </ListItem>
            ))}
            {isLoading && (
              <ListItem sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                  <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
                    <CircularProgress size={20} />
                  </Paper>
                </Box>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'white',
              borderTop: '1px solid #ddd',
              display: 'flex',
              gap: 1,
              alignItems: 'flex-end',
            }}
          >
            <Tooltip title={aiMode ? (chatLang === 'hi' ? 'AI मोड चालू' : 'AI Mode ON') : (chatLang === 'hi' ? 'FAQ मोड' : 'FAQ Mode')}>
              <IconButton
                size="small"
                color={aiMode ? 'primary' : 'default'}
                onClick={() => setAiMode(!aiMode)}
                aria-label="Toggle AI mode"
              >
                <AutoAwesomeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chatbot.placeholder')}
              variant="outlined"
              size="small"
              disabled={isLoading}
              inputProps={{
                'aria-label': t('chatbot.inputLabel'),
              }}
            />
            <Tooltip title={isListening ? 'Stop listening' : 'Voice input'}>
              <IconButton
                color={isListening ? 'error' : 'default'}
                onClick={toggleVoiceInput}
                disabled={isLoading}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
              >
                {isListening ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={t('chatbot.send')}>
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                aria-label={t('chatbot.sendLabel')}
              >
                <SendIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatBot;
