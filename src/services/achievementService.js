// Utilities to manage achievements, thresholds, and persistence
import api from './api';

export const BADGE_THRESHOLDS = [
  { count: 10, name: 'Bronze', icon: '🥉' },
  { count: 20, name: 'Silver', icon: '🥈' },
  { count: 50, name: 'Diamond', icon: '💎' },
  { count: 100, name: 'Titanium', icon: '🛡️' },
  { count: 300, name: 'Vibranium', icon: '🔷' },
  { count: 700, name: 'Ultra Civic', icon: '🌟' },
];

const LS_KEYS = {
  reportCount: 'ccai_report_count',
  earnedBadges: 'ccai_earned_badges',
  lastBadge: 'ccai_last_badge_name',
};

// Fetch actual report count from backend API
export async function fetchReportCountFromAPI() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, setting count to 0');
      setReportCount(0);
      return 0;
    }
    
    console.log('Fetching reports from API...');
    const response = await api.get('/api/reports');
    
    const data = response.data;
    console.log('API response:', data);
    console.log('First report submittedBy:', data[0]?.submittedBy);
    
    // Get current user's ID from token
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    console.log('Full token payload:', tokenPayload);
    const userId = tokenPayload.id;
    console.log('Current user ID:', userId);
    
    // Filter reports by current user (submittedBy field contains user ID)
    const userReports = Array.isArray(data) 
      ? data.filter(report => report.submittedBy === userId) 
      : [];
    
    const count = userReports.length;
    console.log('User report count from API:', count);
    // Update localStorage with actual count
    setReportCount(count);
    return count;
  } catch (err) {
    console.error('Failed to fetch report count:', err);
    // Don't fallback to localStorage - return 0 if API fails
    console.log('API failed, returning 0');
    setReportCount(0);
    return 0;
  }
}

export function getReportCount() {
  const raw = localStorage.getItem(LS_KEYS.reportCount);
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function setReportCount(n) {
  const val = Math.max(0, Math.floor(Number(n) || 0));
  localStorage.setItem(LS_KEYS.reportCount, String(val));
  return val;
}

export function incrementReportCount(delta = 1) {
  return setReportCount(getReportCount() + (Number(delta) || 1));
}

export function computeCurrentBadge(count) {
  const thresholds = [...BADGE_THRESHOLDS].sort((a, b) => a.count - b.count);
  let current = null;
  for (const t of thresholds) {
    if (count >= t.count) current = t;
  }
  return current; // null if none yet
}

export function getEarnedBadges() {
  try {
    const raw = localStorage.getItem(LS_KEYS.earnedBadges);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {}
  return [];
}

export function addEarnedBadge(badge) {
  const list = getEarnedBadges();
  const exists = list.some((b) => b.name === badge.name);
  if (!exists) {
    const withDate = { ...badge, date: new Date().toISOString() };
    const updated = [...list, withDate].sort((a, b) => a.count - b.count);
    localStorage.setItem(LS_KEYS.earnedBadges, JSON.stringify(updated));
    localStorage.setItem(LS_KEYS.lastBadge, badge.name);
    return withDate;
  }
  return list.find((b) => b.name === badge.name);
}

export function getLastBadgeName() {
  return localStorage.getItem(LS_KEYS.lastBadge) || null;
}

export function sanitizeName(name) {
  if (!name || typeof name !== 'string') return 'Citizen';
  // Strip all non printable and angle brackets to avoid HTML injection in certificate DOM
  const cleaned = name.replace(/[<>\u0000-\u001F]/g, '').trim();
  return cleaned || 'Citizen';
}
