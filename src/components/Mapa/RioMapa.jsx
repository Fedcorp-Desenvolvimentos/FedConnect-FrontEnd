// src/components/Mapa/RioMapa.jsx
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

// Ícone personalizado para marcadores de bairro/cidade
const locationIcon = L.divIcon({
  html: `<div style="
    width: 32px;
    height: 32px;
    background-color: #FF5722;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
  ">
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      width: 14px;
      height: 14px;
      background-color: white;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    "></div>
  </div>`,
  iconSize: [32, 32],
  className: 'custom-location-marker'
});

// Ícone para pontos de interesse
const poiIcon = L.divIcon({
  html: `<div style="
    width: 24px;
    height: 24px;
    background-color: #2196F3;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    position: relative;
  ">
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      width: 10px;
      height: 10px;
      background-color: white;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    "></div>
  </div>`,
  iconSize: [24, 24],
  className: 'custom-poi-marker'
});

// Dados fixos de exemplo (bairros do Rio de Janeiro)
const fixedLocations = [
  {
    id: 1,
    name: "Copacabana",
    lat: -22.970722,
    lng: -43.182365,
    type: "bairro",
    description: "Praia famosa, calçadão e vida noturna agitada"
  },
  {
    id: 2,
    name: "Ipanema",
    lat: -22.984973,
    lng: -43.204667,
    type: "bairro",
    description: "Praia elegante, Arpoador e posto 9"
  },
  {
    id: 3,
    name: "Leblon",
    lat: -22.983282,
    lng: -43.215927,
    type: "bairro",
    description: "Bairro nobre, restaurantes e praia"
  },
  {
    id: 4,
    name: "Barra da Tijuca",
    lat: -22.999167,
    lng: -43.365833,
    type: "bairro",
    description: "Praia extensa, shoppings e área residencial"
  },
  {
    id: 5,
    name: "Centro",
    lat: -22.906847,
    lng: -43.172897,
    type: "centro",
    description: "Centro histórico, museus e comércio"
  },
  {
    id: 6,
    name: "Santa Teresa",
    lat: -22.920833,
    lng: -43.188889,
    type: "bairro",
    description: "Bairro boêmio, arte e cultura"
  },
  {
    id: 7,
    name: "Jardim Botânico",
    lat: -22.967778,
    lng: -43.224167,
    type: "poi",
    description: "Jardim Botânico, natureza e tranquilidade"
  },
  {
    id: 8,
    name: "Cristo Redentor",
    lat: -22.951944,
    lng: -43.210556,
    type: "ponto_turistico",
    description: "Uma das 7 maravilhas do mundo moderno"
  },
  {
    id: 9,
    name: "Pão de Açúcar",
    lat: -22.949167,
    lng: -43.153889,
    type: "ponto_turistico",
    description: "Vista panorâmica incrível da cidade"
  },
  {
    id: 10,
    name: "Maracanã",
    lat: -22.912167,
    lng: -43.230167,
    type: "poi",
    description: "Estádio lendário do futebol brasileiro"
  }
];

const RioMap = ({ 
  center = [-22.906847, -43.172897],
  zoom = 12,
  locations = fixedLocations,
  onLocationClick,
  showAllMarkers = true,
  filterType = null
}) => {
  const [map, setMap] = useState(null);
  
  const filteredLocations = filterType 
    ? locations.filter(loc => loc.type === filterType)
    : locations;
  
  const getIcon = (type) => {
    if (type === 'bairro' || type === 'centro') {
      return locationIcon;
    }
    return poiIcon;
  };
  
  const centerMap = (lat, lng, zoomLevel = 14) => {
    if (map) {
      map.setView([lat, lng], zoomLevel);
    }
  };
  
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        
        {showAllMarkers && filteredLocations.map((location) => (
          <Marker 
            key={location.id}
            position={[location.lat, location.lng]}
            icon={getIcon(location.type)}
            eventHandlers={{
              click: () => {
                if (onLocationClick) {
                  onLocationClick(location);
                }
              }
            }}
          >
            <Popup>
              <div style={{ padding: '8px', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                  {location.name}
                </h3>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                  {location.description}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
                  Tipo: {location.type}
                </p>
                <div style={{ marginTop: '8px' }}>
                  <small style={{ color: '#999' }}>
                    📍 {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
                  </small>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        padding: '8px 12px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        🗺️ Mapa do Rio de Janeiro
      </div>
    </div>
  );
};

export default RioMap;