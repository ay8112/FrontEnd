import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default icon paths in CRA
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Marker.prototype.options.icon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function FlyTo({ center, zoom }) {
  const map = useMap();
  const target = useMemo(() => L.latLng(center.lat, center.lng), [center]);
  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.flyTo(target, zoom, { duration: 0.5 });
    }
  }, [center, zoom, map, target]);
  return null;
}

const LocationMap = ({ lat, lng, onChange, height = 260, draggable = true }) => {
  const center = { lat: lat ?? 0, lng: lng ?? 0 };

  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const m = e.target;
        const pos = m.getLatLng();
        if (onChange) onChange({ latitude: pos.lat, longitude: pos.lng });
      },
    }),
    [onChange]
  );

  // Render nothing if coords missing
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;

  return (
    <div style={{ width: '100%', height }}>
      <MapContainer center={center} zoom={15} style={{ width: '100%', height: '100%', borderRadius: 12 }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <FlyTo center={center} zoom={15} />
        <Marker position={center} draggable={draggable} eventHandlers={eventHandlers} />
      </MapContainer>
    </div>
  );
};

export default LocationMap;
