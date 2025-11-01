import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language || 'en');

  // Determine storage key based on user role
  const getStorageKey = () => {
    return isAdmin() ? 'lang_admin' : 'lang_user';
  };

  // Load language on mount based on role
  React.useEffect(() => {
    try {
      const storageKey = isAdmin() ? 'lang_admin' : 'lang_user';
      const saved = localStorage.getItem(storageKey);
      if (saved && ['en', 'hi'].includes(saved)) {
        setLang(saved);
        i18n.changeLanguage(saved);
      }
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const changeLang = (val) => {
    setLang(val);
    i18n.changeLanguage(val);
    try { 
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, val);
    } catch (_) {}
  };

  const handleLogout = () => {
    // Clear chatbot data on logout
    try {
      localStorage.removeItem('chatbot_messages');
      localStorage.removeItem('chatbot_lang');
      
      // Dispatch custom event to notify ChatBot component
      window.dispatchEvent(new Event('user-logout'));
    } catch (err) {
      console.error('Error clearing chatbot data:', err);
    }
    
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" role="banner" aria-label="Top navigation bar">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')} aria-label="Home">
          {t('appName')}
        </Typography>
        {/* Clean Your Area Page Link - Available to all */}
        <Button 
          color="inherit" 
          onClick={() => navigate('/clean-your-area')} 
          aria-label="Clean Your Area"
          sx={{ mr: 2 }}
        >
          🌿 {lang === 'hi' ? 'स्वच्छ भारत' : 'Clean India'}
        </Button>
        <FormControl size="small" sx={{ mr: 2, minWidth: 120 }} aria-label={t('language')}>
          <InputLabel id="lang-select-label">{t('language')}</InputLabel>
          <Select
            labelId="lang-select-label"
            id="lang-select"
            value={lang}
            label={t('language')}
            onChange={(e) => changeLang(e.target.value)}
            inputProps={{ 'aria-label': t('language') }}
          >
            <MenuItem value="en">{t('english')}</MenuItem>
            <MenuItem value="hi">{t('hindi')}</MenuItem>
          </Select>
        </FormControl>
        {user ? (
          <Box>
            {isAdmin() && (
              <>
                <Button color="inherit" onClick={() => navigate('/admin')} aria-label="Admin Dashboard">
                  {t('adminDashboard')}
                </Button>
                <Button color="inherit" onClick={() => navigate('/dashboard')} aria-label="Dashboard">
                  {t('dashboard')}
                </Button>
              </>
            )}
            <Button color="inherit" onClick={handleLogout} aria-label="Logout">
              {t('logout')}
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')} aria-label="Login">
              {t('login')}
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')} aria-label="Register">
              {t('register')}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
