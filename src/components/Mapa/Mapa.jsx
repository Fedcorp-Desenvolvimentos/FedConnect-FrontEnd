// src/components/Mapa/RioMapa.jsx
import { MapContainer, TileLayer, ZoomControl, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Ícone para imobiliárias/empresas
const businessIcon = L.divIcon({
  html: `<div style="
    width: 28px;
    height: 28px;
    background-color: #FF5722;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s;
  ">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  </div>`,
  iconSize: [28, 28],
  className: 'custom-business-marker'
});

// Ícone para localização central (bairro buscado)
const centerIcon = L.divIcon({
  html: `<div style="
    width: 40px;
    height: 40px;
    background-color: #2563eb;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  ">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    </svg>
  </div>`,
  iconSize: [40, 40],
  className: 'custom-center-marker'
});

const RioMap = ({ 
  center = [-22.906847, -43.172897],
  zoom = 12,
  businesses = [],  // Array de empresas da busca
  centerLocation = null,  // Localização do bairro/cidade buscada
  onBusinessClick,
  height = "400px"
}) => {
  
  // Calcular bounds para mostrar todos os marcadores
  const getBounds = () => {
    const bounds = L.latLngBounds();
    
    if (centerLocation) {
      bounds.extend([centerLocation.lat, centerLocation.lng]);
    }
    
    businesses.forEach(business => {
      if (business.location) {
        bounds.extend([business.location.latitude, business.location.longitude]);
      }
    });
    
    return bounds.isValid() ? bounds : null;
  };
  
  return (
    <div style={{ position: 'relative', height: height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        bounds={getBounds()}
        boundsOptions={{ padding: [30, 30] }}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        
        {/* Marcador central do bairro/cidade */}
        {centerLocation && (
          <Marker 
            position={[centerLocation.lat, centerLocation.lng]}
            icon={centerIcon}
          >
            <Popup>
              <div style={{ padding: '8px', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#2563eb' }}>
                  📍 Área de Busca
                </h3>
                <p style={{ margin: '0', fontSize: '14px' }}>
                  {centerLocation.formatted_address || 'Centro da busca'}
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                  {businesses.length} empresas encontradas nesta região
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Marcadores das empresas */}
        {businesses.map((business, idx) => {
          if (!business.location) return null;
          
          return (
            <Marker 
              key={business.id || idx}
              position={[business.location.latitude, business.location.longitude]}
              icon={businessIcon}
              eventHandlers={{
                click: () => {
                  if (onBusinessClick) {
                    onBusinessClick(business);
                  }
                }
              }}
            >
              <Popup>
                <div style={{ padding: '8px', minWidth: '250px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold', fontSize: '16px' }}>
                    {business.displayName?.text || 'Nome não disponível'}
                  </h3>
                  
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
                    <strong>📍 Endereço:</strong><br />
                    {business.formattedAddress || 'Endereço não disponível'}
                  </p>
                  
                  {business.nationalPhoneNumber && (
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                      <strong>📞 Telefone:</strong><br />
                      <a 
                        href={`https://wa.me/55${business.nationalPhoneNumber.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#25D366', textDecoration: 'none' }}
                      >
                        {business.nationalPhoneNumber}
                      </a>
                    </p>
                  )}
                  
                  {business.websiteUri && (
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px' }}>
                      <strong>🌐 Site:</strong><br />
                      <a 
                        href={business.websiteUri}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2563eb', textDecoration: 'none' }}
                      >
                        Visitar website
                      </a>
                    </p>
                  )}
                  
                  <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                    <a
                      href={`https://google.com/maps/search/${encodeURIComponent(business.displayName?.text + ' ' + business.formattedAddress)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      Abrir no Maps
                    </a>
                    <button
                      onClick={() => onBusinessClick?.(business)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      
      {/* Legenda */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        zIndex: 1000,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        padding: '8px 12px',
        fontSize: '12px',
        display: 'flex',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: '#2563eb', borderRadius: '50%' }}></div>
          <span>Área de Busca</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '14px', height: '14px', backgroundColor: '#FF5722', borderRadius: '50%' }}></div>
          <span>Empresas</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📊 {businesses.length} empresas</span>
        </div>
      </div>
    </div>
  );
};

export default RioMap;