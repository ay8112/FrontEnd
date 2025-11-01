import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ModerationPanel from './pages/ModerationPanel';
import ProtectedRoute from './components/ProtectedRoute';
import AiTest from './pages/AiTest';
import Achievements from './pages/Achievements';
import TwitterUpdates from './pages/TwitterUpdates';
import ForgotPassword from './pages/ForgotPassword';
import AdminForgotPassword from './pages/AdminForgotPassword';
import ManageAdmins from './pages/ManageAdmins';
import MonthlyStats from './pages/MonthlyStats';
import VerifyOtp from './pages/VerifyOtp';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ClearCache from './pages/ClearCache';
import './i18n';
import Heatmap from './pages/Heatmap';
import ChatBot from './components/ChatBot';
import WasteClassifier from './components/WasteClassifier';
import CleanYourAreaPage from './pages/CleanYourAreaPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Component to conditionally render ChatBot
const ConditionalChatBot = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Don't show chatbot on login, register, and password reset pages
  const excludedPaths = ['/login', '/admin-login', '/register', '/forgot-password', '/verify-otp'];
  const isExcludedPath = excludedPaths.includes(location.pathname);
  
  // Only show if user is logged in and not on excluded pages
  if (user && !isExcludedPath) {
    return <ChatBot />;
  }
  
  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-test" element={<AiTest />} />
            <Route path="/clean-your-area" element={<CleanYourAreaPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/moderation"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ModerationPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AnalyticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/heatmap"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Heatmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-admins"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <ManageAdmins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/monthly-stats"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <MonthlyStats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/heatmap"
              element={
                <ProtectedRoute>
                  <Heatmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/waste-classifier"
              element={
                <ProtectedRoute>
                  <WasteClassifier />
                </ProtectedRoute>
              }
            />
            <Route path="/clear-cache" element={<ClearCache />} />
              <Route
                path="/twitter-updates"
                element={
                  <ProtectedRoute>
                    <TwitterUpdates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/social-media-updates"
                element={
                  <ProtectedRoute>
                    <TwitterUpdates />
                  </ProtectedRoute>
                }
              />
          </Routes>
          <ConditionalChatBot />
          <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
