// // src/components/Mapa/Mapa.jsx
// import { useState } from 'react';
// import RioMap from './RioMapa';

// function Mapa() {
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [filterType, setFilterType] = useState(null);
  
//   const handleLocationClick = (location) => {
//     setSelectedLocation(location);
//     console.log('Local selecionado:', location);
//   };
  
//   // Seus locais personalizados
//   const myLocations = [
//     {
//       id: 1,
//       name: "Minha Empresa",
//       lat: -22.909167,
//       lng: -43.178889,
//       type: "poi",
//       description: "Sede da empresa"
//     },
//     {
//       id: 2,
//       name: "Escola Municipal",
//       lat: -22.915000,
//       lng: -43.190000,
//       type: "poi",
//       description: "Escola do bairro"
//     }
//   ];
  
//   return (
//     <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       {/* Header com controles */}
//       <div style={{ 
//         padding: '16px', 
//         backgroundColor: '#f5f5f5', 
//         borderBottom: '1px solid #ddd' 
//       }}>
//         <h2 style={{ margin: '0 0 16px 0' }}>Mapa do Rio de Janeiro</h2>
        
//         <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
//           <button 
//             onClick={() => setFilterType(null)}
//             style={{
//               padding: '6px 12px',
//               backgroundColor: !filterType ? '#FF5722' : '#fff',
//               color: !filterType ? '#fff' : '#333',
//               border: '1px solid #ddd',
//               borderRadius: '20px',
//               cursor: 'pointer'
//             }}
//           >
//             Todos
//           </button>
//           <button 
//             onClick={() => setFilterType('bairro')}
//             style={{
//               padding: '6px 12px',
//               backgroundColor: filterType === 'bairro' ? '#FF5722' : '#fff',
//               color: filterType === 'bairro' ? '#fff' : '#333',
//               border: '1px solid #ddd',
//               borderRadius: '20px',
//               cursor: 'pointer'
//             }}
//           >
//             Bairros
//           </button>
//           <button 
//             onClick={() => setFilterType('ponto_turistico')}
//             style={{
//               padding: '6px 12px',
//               backgroundColor: filterType === 'ponto_turistico' ? '#FF5722' : '#fff',
//               color: filterType === 'ponto_turistico' ? '#fff' : '#333',
//               border: '1px solid #ddd',
//               borderRadius: '20px',
//               cursor: 'pointer'
//             }}
//           >
//             Pontos Turísticos
//           </button>
//           <button 
//             onClick={() => setFilterType('poi')}
//             style={{
//               padding: '6px 12px',
//               backgroundColor: filterType === 'poi' ? '#FF5722' : '#fff',
//               color: filterType === 'poi' ? '#fff' : '#333',
//               border: '1px solid #ddd',
//               borderRadius: '20px',
//               cursor: 'pointer'
//             }}
//           >
//             Pontos de Interesse
//           </button>
//         </div>
        
//         {selectedLocation && (
//           <div style={{ 
//             padding: '12px', 
//             backgroundColor: '#fff', 
//             border: '1px solid #ddd',
//             borderRadius: '4px'
//           }}>
//             <strong>📍 {selectedLocation.name}</strong>
//             <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
//               {selectedLocation.description}
//             </p>
//           </div>
//         )}
//       </div>
      
//       {/* Mapa */}
//       <div style={{ flex: 1, minHeight: 0 }}>
//         <RioMap 
//           locations={myLocations}
//           onLocationClick={handleLocationClick}
//           filterType={filterType}
//           center={[-22.906847, -43.172897]}
//           zoom={12}
//         />
//       </div>
//     </div>
//   );
// }

// export default Mapa;