import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Container, Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { useTranslation } from 'react-i18next';

const COLORS = ['#1976d2', '#dc004e', '#388e3c', '#fbc02d', '#8e24aa', '#ff9800', '#00bcd4'];

const AnalyticsDashboard = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [volumeData, setVolumeData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [chartRes, heatRes] = await Promise.all([
        api.get('/api/chart-data'),
        api.get('/api/heatmap-data')
      ]);
      setCategoryData(chartRes.data?.categoryDistribution || []);
      setVolumeData(chartRes.data?.volumeDaily || []);
      setHeatmapData(heatRes.data || []);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!categoryData) return;
    const header = 'Category,Count\n';
    const rows = categoryData.map(d => `${JSON.stringify(d.category)},${d.count}`).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'category-distribution.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = async () => {
    const chartEl = document.getElementById('charts-section');
    if (!chartEl) return;
    const canvas = await html2canvas(chartEl);
    const link = document.createElement('a');
    link.download = 'analytics-dashboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const exportPDF = async () => {
    const chartEl = document.getElementById('charts-section');
    if (!chartEl) return;
    const canvas = await html2canvas(chartEl);
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 100);
    pdf.save('analytics-dashboard.pdf');
  };

  const categoryChart = useMemo(() => {
    return (categoryData || []).map((d, i) => ({ name: d.category, value: d.count, fill: COLORS[i % COLORS.length] }));
  }, [categoryData]);

  const volumeChart = useMemo(() => {
    return (volumeData || []).map(d => ({ date: d.date, count: d.count }));
  }, [volumeData]);

  const HeatLayer = ({ points }) => {
    const map = useMap();
    const heatRef = useRef(null);
    useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const L = await import('leaflet');
          let hasHeat = false;
          try { await import('leaflet.heat'); hasHeat = true; } catch (_) { hasHeat = false; }
          if (!mounted) return;
          if (!hasHeat || typeof L.heatLayer !== 'function') {
            console.warn('leaflet.heat not installed; skipping heat layer');
            return;
          }
          if (heatRef.current) {
            heatRef.current.remove();
            heatRef.current = null;
          }
          const heatPoints = (points || [])
            .filter(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
            .map(p => [p.latitude, p.longitude, Math.max(0.2, Math.min(1, (p.severity || 1) / 5))]);
          heatRef.current = L.heatLayer(heatPoints, { radius: 25, blur: 15 });
          heatRef.current.addTo(map);
        } catch (e) {
          console.warn('Heatmap init failed:', e);
        }
      })();
      return () => { mounted = false; if (heatRef.current) heatRef.current.remove(); };
    }, [map, points]);
    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
  <Typography variant="h4" sx={{ mb: 2 }}>{t('analytics')}</Typography>
        <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={exportCSV}>{t('exportCSV')}</Button>
          <Button variant="outlined" onClick={exportPNG}>{t('exportPNG')}</Button>
          <Button variant="outlined" onClick={exportPDF}>{t('exportPDF')}</Button>
        </Box>
        {loading ? <CircularProgress /> : (
          <Box id="charts-section" sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 320, height: 320 }}>
              <Typography variant="h6">{t('wasteCategory')}</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categoryChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {categoryChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ReTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ flex: 1, minWidth: 320, height: 320 }}>
              <Typography variant="h6">{t('reportVolume')}</Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={volumeChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" hide={volumeChart.length > 20} />
                  <YAxis allowDecimals={false} />
                  <ReTooltip />
                  <Legend />
                  <Bar dataKey="count" name={t('reports')} fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ flex: 1, minWidth: 420 }}>
              <Typography variant="h6">{t('hotspots')}</Typography>
              <MapContainer center={[26.8467, 80.9462]} zoom={12} style={{ height: 320, width: '100%' }}>
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
                />
                <HeatLayer points={heatmapData} />
              </MapContainer>
              <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                Basemap &copy; <a href="https://carto.com/" target="_blank" rel="noreferrer">CARTO</a>
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AnalyticsDashboard;
