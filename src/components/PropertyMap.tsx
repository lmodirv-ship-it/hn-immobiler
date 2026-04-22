import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPriceDb, getPrimaryImage, type PropertyWithImages } from '@/lib/property-helpers';

// Fix default marker icons (Leaflet + bundlers)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom neon marker
const neonIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    width: 28px; height: 28px; border-radius: 50%;
    background: hsl(180 100% 50% / 0.85);
    border: 2px solid hsl(180 100% 70%);
    box-shadow: 0 0 12px hsl(180 100% 50% / 0.8), 0 0 24px hsl(180 100% 50% / 0.4);
    display:flex;align-items:center;justify-content:center;
    color:#000;font-weight:700;font-size:12px;
  ">●</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
    } else {
      map.fitBounds(L.latLngBounds(points.map((p) => L.latLng(p[0], p[1]))), { padding: [40, 40] });
    }
  }, [points, map]);
  return null;
}

interface Props {
  properties: PropertyWithImages[];
  height?: string;
}

const PropertyMap = ({ properties, height = '70vh' }: Props) => {
  const { lang } = useLanguage();
  const points = useMemo(
    () =>
      properties
        .filter((p) => p.lat != null && p.lng != null)
        .map((p) => [Number(p.lat), Number(p.lng)] as [number, number]),
    [properties]
  );

  const center: [number, number] = points[0] || [33.5731, -7.5898]; // Casablanca

  return (
    <div className="rounded-2xl overflow-hidden glow-border" style={{ height }}>
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%', background: 'hsl(220 35% 8%)' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds points={points} />
        {properties.map((p) =>
          p.lat != null && p.lng != null ? (
            <Marker key={p.id} position={[Number(p.lat), Number(p.lng)]} icon={neonIcon as any}>
              <Popup>
                <Link to={`/properties/${p.id}`} className="block w-56">
                  <img src={getPrimaryImage(p)} alt={p.title} className="w-full h-28 object-cover rounded-md mb-2" />
                  <div className="font-semibold text-sm line-clamp-1 text-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.city}</div>
                  <div className="text-sm font-bold text-primary mt-1">
                    {formatPriceDb(Number(p.price), p.transaction_type, lang)}
                  </div>
                </Link>
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
};

export default PropertyMap;