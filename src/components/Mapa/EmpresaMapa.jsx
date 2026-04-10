// src/components/Mapa/EmpresasMap.jsx
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Ícone personalizado para empresas
const createCompanyIcon = (color = '#FF5722') => L.divIcon({
  html: `<div style="
    width: 32px;
    height: 32px;
    background-color: ${color};
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    transition: transform 0.2s;
  ">
    🏢
  </div>`,
  iconSize: [32, 32],
  className: 'company-marker',
  popupAnchor: [0, -16]
});

// Componente para centralizar o mapa
function MapController({ center, zoom }) {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.length === 2) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

const EmpresasMap = ({ 
  empresas = [], 
  center = [-22.906847, -43.172897],
  zoom = 12,
  onEmpresaClick,
  selectedEmpresaId = null
}) => {
  
  // Se tem empresas, centraliza na primeira
  const mapCenter = empresas.length > 0 && empresas[0].location 
    ? [empresas[0].location.latitude, empresas[0].location.longitude]
    : center;
  
  const mapZoom = empresas.length > 0 ? 14 : zoom;
  
  const getIconColor = (index) => {
    const colors = ['#FF5722', '#2196F3', '#4CAF50', '#FFC107', '#9C27B0', '#E91E63'];
    return colors[index % colors.length];
  };
  
  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {empresas.map((empresa, index) => {
          if (!empresa.location) return null;
          
          return (
            <Marker 
              key={empresa.id || index}
              position={[empresa.location.latitude, empresa.location.longitude]}
              icon={createCompanyIcon(getIconColor(index))}
              eventHandlers={{
                click: () => {
                  if (onEmpresaClick) {
                    onEmpresaClick(empresa);
                  }
                }
              }}
            >
              <Popup>
                <div style={{ padding: '12px', minWidth: '250px', maxWidth: '300px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                    {empresa.displayName?.text || 'Empresa'}
                  </h3>
                  
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
                    <strong>📍 Endereço:</strong><br />
                    {empresa.formattedAddress}
                  </p>
                  
                  {empresa.nationalPhoneNumber && (
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                      <strong>📞 Telefone:</strong><br />
                      <a 
                        href={`https://wa.me/55${empresa.nationalPhoneNumber.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#25D366', textDecoration: 'none' }}
                      >
                        {empresa.nationalPhoneNumber}
                      </a>
                    </p>
                  )}
                  
                  {empresa.websiteUri && (
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                      <strong>🌐 Site:</strong><br />
                      <a 
                        href={empresa.websiteUri}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2196F3', textDecoration: 'none' }}
                      >
                        Visitar site
                      </a>
                    </p>
                  )}
                  
                  <div style={{ 
                    marginTop: '12px', 
                    paddingTop: '8px', 
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button
                      onClick={() => {
                        window.open(`https://google.com/maps/search/${encodeURIComponent(empresa.displayName?.text + ' ' + empresa.formattedAddress)}`, '_blank');
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        background: '#FF5722',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗺️ Ver rota
                    </button>
                    
                    <button
                      onClick={() => {
                        if (onEmpresaClick) onEmpresaClick(empresa);
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      📋 Ver detalhes
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default EmpresasMap;