import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/adminService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell 
} from 'recharts';
import {
  Container, Grid, Paper, Typography, CircularProgress,
  Select, MenuItem, FormControl, InputLabel, TextField, Box
} from '@mui/material';
import { Alert } from '@mui/material';
import AppLayout from '../components/AppLayout';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import BarChartIcon from '@mui/icons-material/BarChart';
import MapIcon from '@mui/icons-material/Map';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    byType: [],
    byLocation: [],
    byStatus: []
  });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    location: '',
    wasteType: ''
  });

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, typeRes, locationRes, statusRes] = await Promise.all([
          adminAPI.getStats(filters),
          adminAPI.getReportsByType(filters),
          adminAPI.getReportsByLocation(filters),
          adminAPI.getReportsByStatus(filters)
        ]);

        setStats({
          totalReports: statsRes.data.totalReports,
          byType: typeRes.data,
          byLocation: locationRes.data,
          byStatus: statusRes.data
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const { t } = useTranslation();
  const sidebarItems = [
    { key: 'dashboard', label: t('adminDashboard'), icon: <DashboardIcon />, to: '/admin' },
    { key: 'moderation', label: t('moderationPanel'), icon: <GavelIcon />, to: '/admin/moderation' },
    { key: 'analytics', label: t('analytics'), icon: <BarChartIcon />, to: '/admin/analytics' },
    { key: 'heatmap', label: t('heatmap'), icon: <MapIcon />, to: '/admin/heatmap' },
    { key: 'manage-admins', label: 'Manage Admins', icon: <GroupIcon />, to: '/admin/manage-admins' },
    { key: 'monthly-stats', label: 'Monthly Stats', icon: <TrendingUpIcon />, to: '/admin/monthly-stats' },
  ];

  return (
    <AppLayout sidebarItems={sidebarItems}>
      {loading && (
        <Container sx={{ mt: 4, textAlign: 'center' }}>
          <CircularProgress />
        </Container>
      )}
      {error && !loading && (
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      )}

      {!loading && !error && (
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#000', fontWeight: 700 }}>
            {t('adminDashboard')}
          </Typography>

      {/* Filters */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            name="startDate"
            label={t('startDate')}
            value={filters.startDate}
            onChange={handleFilterChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            name="endDate"
            label={t('endDate')}
            value={filters.endDate}
            onChange={handleFilterChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>{t('location')}</InputLabel>
            <Select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              label={t('location')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              {stats.byLocation.map((loc) => (
                <MenuItem key={loc.name} value={loc.name}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>{t('wasteType')}</InputLabel>
            <Select
              name="wasteType"
              value={filters.wasteType}
              onChange={handleFilterChange}
              label={t('wasteType')}
            >
              <MenuItem value="">{t('all')}</MenuItem>
              {stats.byType.map((type) => (
                <MenuItem key={type.name} value={type.name}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Stats Overview */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 0 12px rgba(0,170,255,0.25)' }}>
        <Typography variant="h6" gutterBottom>
          {t('totalReports')}: {stats.totalReports}
        </Typography>
      </Paper>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Waste Type Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 0 12px rgba(0,170,255,0.25)' }}>
            <Typography variant="h6" gutterBottom>
              {t('wasteTypeDistribution')}
            </Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={stats.byType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats.byType.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        {/* Reports by Location */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 0 12px rgba(0,170,255,0.25)' }}>
            <Typography variant="h6" gutterBottom>
              {t('reportsByLocation')}
            </Typography>
            <BarChart width={400} height={300} data={stats.byLocation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Paper>
        </Grid>

        {/* Reports by Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 0 12px rgba(0,170,255,0.25)' }}>
            <Typography variant="h6" gutterBottom>
              {t('reportsByStatus')}
            </Typography>
            <BarChart width={800} height={300} data={stats.byStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>
        </Box>
      )}
    </AppLayout>
  );
};

export default AdminDashboard;