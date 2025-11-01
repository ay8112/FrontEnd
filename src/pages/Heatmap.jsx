import React, { useEffect, useRef, useState } from 'react';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, useMap, CircleMarker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchHeatmapData();
    const interval = setInterval(fetchHeatmapData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchHeatmapData = async () => {
    try {
      const res = await axios.get('/api/heatmap-data');
      setHeatmapData(res.data || []);
    } catch (err) {
      console.error('Failed to load heatmap data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#000' }}>
          {t('cityHeatmapTitle')}
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
              {t('heatmapSubtitle')}
            </Typography>
            
            <Box sx={{ height: 750, width: '100%', borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
              <MapContainer 
                center={[26.8467, 80.9462]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
                />
                <HeatmapLayer points={heatmapData} />
                <ReportMarkers points={heatmapData} />
              </MapContainer>
            </Box>
            
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#666' }}>
              Basemap &copy; <a href="https://carto.com/" target="_blank" rel="noreferrer">CARTO</a> | {t('showingCount', { count: heatmapData.length })}
            </Typography>
          </>
        )}
      </Paper>
    </Container>
  );
};

// Heat layer component
const HeatmapLayer = ({ points }) => {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    // Remove previous layer
    if (layerRef.current) {
      layerRef.current.remove();
      layerRef.current = null;
    }

    // Build heat points [lat, lng, intensity]
    const heatPoints = (points || [])
      .filter(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))
      .map(p => [
        p.latitude, 
        p.longitude, 
        // Boost intensity for better visibility, especially with few points
        Math.max(0.5, Math.min(1, (p.severity || 1) / 3))
      ]);

    if (typeof L.heatLayer === 'function' && heatPoints.length > 0) {
      layerRef.current = L.heatLayer(heatPoints, { 
        radius: 40,  // Increased from 25 for better visibility
        blur: 20,    // Increased from 15
        minOpacity: 0.3,  // Minimum opacity for visibility
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.0: '#0000ff',
          0.3: '#00ff00',
          0.6: '#ffff00',
          1.0: '#ff0000'
        }
      });
      layerRef.current.addTo(map);
    } else if (heatPoints.length === 0) {
      console.info('No heatmap data to display');
    } else {
      console.warn('leaflet.heat not available; heat layer disabled');
    }

    return () => {
      if (layerRef.current) {
        layerRef.current.remove();
      }
    };
  }, [map, points]);

  return null;
};

// Report markers component for better visibility with few points
const ReportMarkers = ({ points }) => {
  const { t } = useTranslation();
  if (!points || points.length === 0) return null;

  const getColor = (severity) => {
    if (severity >= 4) return '#ff0000'; // Red
    if (severity >= 3) return '#ffff00'; // Yellow
    if (severity >= 2) return '#00ff00'; // Green
    return '#0000ff'; // Blue
  };

  return (
    <>
      {points.map((point, idx) => (
        Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && (
          <CircleMarker
            key={idx}
            center={[point.latitude, point.longitude]}
            radius={8}
            pathOptions={{
              fillColor: getColor(point.severity || 1),
              fillOpacity: 0.6,
              color: '#ffffff',
              weight: 2,
              opacity: 0.9
            }}
          >
            <Popup>
              <strong>{t('reportLocation')}</strong>
              <br />
              {t('severity')}: {point.severity || 1}/5
              <br />
              {t('latitude')}: {point.latitude.toFixed(6)}
              <br />
              {t('longitude')}: {point.longitude.toFixed(6)}
            </Popup>
          </CircleMarker>
        )
      ))}
    </>
  );
};

export default Heatmap;
