// // src/pages/Financeiro/voucher/components/FaturasTable.jsx

// import React, { useState } from 'react';
// import { FaFileInvoiceDollar, FaChevronDown, FaChevronRight, FaSpinner } from 'react-icons/fa';
// import { Card, CardHeader, TableWrapper, Table, StatusBadge, EmptyState } from '../EmissaoRecibosVoucherStyles';
// import styled from 'styled-components';

// const DetailRow = styled.tr`
//   background: #f7fafc;
  
//   td {
//     padding: 0 !important;
//   }
// `;

// const DetailContent = styled.div`
//   padding: 16px 20px;
//   border-top: 1px solid #e2e8f0;
// `;

// const DetailGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//   gap: 12px;
//   margin-top: 8px;
// `;

// const DetailItem = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 2px;

//   label {
//     font-size: 11px;
//     font-weight: 600;
//     color: #718096;
//     text-transform: uppercase;
//   }

//   span {
//     font-size: 14px;
//     color: #2d3748;
//   }
// `;

// const ExpandButton = styled.button`
//   background: none;
//   border: none;
//   color: #2b6cb0;
//   cursor: pointer;
//   padding: 4px;
//   font-size: 14px;
  
//   &:hover {
//     color: #1a365d;
//   }
// `;

// const formatDate = (date) => {
//   if (!date) return '-';
//   try {
//     return new Date(date).toLocaleDateString('pt-BR');
//   } catch {
//     return '-';
//   }
// };

// const formatMoney = (value) => {
//   if (value === null || value === undefined) return 'R$ 0,00';
//   return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
// };

// const getFaturaKey = (fatura) => {
//   return String(fatura.FATURA || fatura.fatura || fatura.id || '');
// };

// export const FaturasTable = ({
//   faturas,
//   faturasDetalhadas,
//   selectedFaturas,
//   loadingFaturaDetalhes,
//   onToggleFatura,
//   onToggleAllFaturas,
//   onBuscarDetalhes,
//   loading,
// }) => {
//   const [expandedFaturas, setExpandedFaturas] = useState(new Set());

//   const allSelected = faturas.length > 0 && faturas.every(f => {
//     const key = getFaturaKey(f);
//     return selectedFaturas.has(key);
//   });

//   const toggleExpand = (faturaKey) => {
//     setExpandedFaturas(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(faturaKey)) {
//         newSet.delete(faturaKey);
//       } else {
//         newSet.add(faturaKey);
//         // Busca detalhes ao expandir
//         onBuscarDetalhes(faturaKey);
//       }
//       return newSet;
//     });
//   };

//   const getStatusInfo = (status) => {
//     const statusMap = {
//       'P': { label: 'Pendente', className: 'pending' },
//       'B': { label: 'Baixada', className: 'paid' },
//       'A': { label: 'Ativa', className: 'active' },
//       'C': { label: 'Cancelada', className: 'canceled' },
//     };
//     return statusMap[status] || { label: status || 'Desconhecido', className: 'pending' };
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <div>
//             <FaFileInvoiceDollar />
//             <h2>2. Faturas</h2>
//             <span>Carregando...</span>
//           </div>
//         </CardHeader>
//         <EmptyState>Carregando faturas...</EmptyState>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <div>
//           <FaFileInvoiceDollar />
//           <h2>2. Faturas</h2>
//           <span style={{ fontSize: 13, color: '#718096' }}>
//             ({faturas.length} encontradas)
//           </span>
//           {selectedFaturas.size > 0 && (
//             <span className="badge">
//               {selectedFaturas.size} selecionadas
//             </span>
//           )}
//         </div>
//         {faturas.length > 0 && (
//           <button type="button" className="link-button" onClick={onToggleAllFaturas}>
//             {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
//           </button>
//         )}
//       </CardHeader>

//       {faturas.length === 0 ? (
//         <EmptyState>Nenhuma fatura encontrada.</EmptyState>
//       ) : (
//         <TableWrapper>
//           <Table>
//             <thead>
//               <tr>
//                 <th style={{ width: 30 }}></th>
//                 <th style={{ width: 40 }}>
//                   <input
//                     type="checkbox"
//                     checked={allSelected}
//                     onChange={onToggleAllFaturas}
//                   />
//                 </th>
//                 <th>Fatura</th>
//                 <th>Administradora</th>
//                 <th>Apólice</th>
//                 <th>Vencimento</th>
//                 <th>Prêmio Líquido</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {faturas.map((fatura, index) => {
//                 const key = getFaturaKey(fatura);
//                 const isSelected = selectedFaturas.has(key);
//                 const isExpanded = expandedFaturas.has(key);
//                 const detalhes = faturasDetalhadas[key];
//                 const isLoadingDetalhes = loadingFaturaDetalhes && !detalhes;
//                 const statusInfo = getStatusInfo(fatura.STATUS || fatura.status);

//                 return (
//                   <React.Fragment key={`fatura-${key}-${index}`}>
//                     <tr 
//                       className={isSelected ? 'selected' : ''}
//                     >
//                       <td>
//                         <ExpandButton onClick={() => toggleExpand(key)}>
//                           {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
//                         </ExpandButton>
//                       </td>
//                       <td onClick={(e) => e.stopPropagation()}>
//                         <input
//                           type="checkbox"
//                           checked={isSelected}
//                           onChange={() => onToggleFatura(fatura)}
//                         />
//                       </td>
//                       <td 
//                         onClick={() => onToggleFatura(fatura)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <strong>{key}</strong>
//                       </td>
//                       <td onClick={() => onToggleFatura(fatura)} style={{ cursor: 'pointer' }}>
//                         {fatura.ADMINISTRADORA || fatura.administradora || '-'}
//                       </td>
//                       <td onClick={() => onToggleFatura(fatura)} style={{ cursor: 'pointer' }}>
//                         {fatura.APOLICE || fatura.apolice || '-'}
//                       </td>
//                       <td onClick={() => onToggleFatura(fatura)} style={{ cursor: 'pointer' }}>
//                         {formatDate(fatura.VENCIMENTO || fatura.vencimento)}
//                       </td>
//                       <td onClick={() => onToggleFatura(fatura)} style={{ cursor: 'pointer' }}>
//                         <strong>{formatMoney(fatura.PREMIO_LIQ || fatura.premio_liq || fatura.VALOR || 0)}</strong>
//                       </td>
//                       <td onClick={() => onToggleFatura(fatura)} style={{ cursor: 'pointer' }}>
//                         <StatusBadge className={statusInfo.className}>
//                           {statusInfo.label}
//                         </StatusBadge>
//                       </td>
//                     </tr>

//                     {isExpanded && (
//                       <DetailRow>
//                         <td colSpan={8}>
//                           <DetailContent>
//                             {isLoadingDetalhes ? (
//                               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                                 <FaSpinner className="spin" />
//                                 <span>Carregando detalhes da fatura...</span>
//                               </div>
//                             ) : detalhes ? (
//                               <>
//                                 <strong style={{ fontSize: 15, color: '#2d3748' }}>
//                                   Detalhes da Fatura {key}
//                                 </strong>
//                                 <DetailGrid>
//                                   <DetailItem>
//                                     <label>Data Emissão</label>
//                                     <span>{formatDate(detalhes.DATA_FAT)}</span>
//                                   </DetailItem>
//                                   <DetailItem>
//                                     <label>Data Vencimento</label>
//                                     <span>{formatDate(detalhes.VENCIMENTO)}</span>
//                                   </DetailItem>
//                                   <DetailItem>
//                                     <label>Prêmio Bruto</label>
//                                     <span>{formatMoney(detalhes.PREMIO_BRUTO)}</span>
//                                   </DetailItem>
//                                   <DetailItem>
//                                     <label>Prêmio Líquido</label>
//                                     <span>{formatMoney(detalhes.PREMIO_LIQ)}</span>
//                                   </DetailItem>
//                                   <DetailItem>
//                                     <label>CNPJ Administradora</label>
//                                     <span>{detalhes.CNPJ_ADMINISTRADORA || '-'}</span>
//                                   </DetailItem>
//                                   <DetailItem>
//                                     <label>Qtde Boletos</label>
//                                     <span>{detalhes.QTD_BOLETOS || 0}</span>
//                                   </DetailItem>
//                                   {detalhes.BOLETOS && detalhes.BOLETOS.length > 0 && (
//                                     <DetailItem>
//                                       <label>Último Boleto</label>
//                                       <span>
//                                         R$ {detalhes.BOLETOS[0].VALOR?.toFixed(2) || '0,00'} 
//                                         {' - '}
//                                         {detalhes.BOLETOS[0].STATUS_BOLETO === 'A' ? 'Ativo' : 
//                                          detalhes.BOLETOS[0].STATUS_BOLETO === 'C' ? 'Cancelado' : '-'}
//                                       </span>
//                                     </DetailItem>
//                                   )}
//                                   {detalhes.BAIXAS && detalhes.BAIXAS.length > 0 && (
//                                     <DetailItem>
//                                       <label>Última Baixa</label>
//                                       <span>
//                                         {formatDate(detalhes.BAIXAS[0].DT_BAIXA)}
//                                         {' - R$ '}
//                                         {detalhes.BAIXAS[0].VALOR?.toFixed(2) || '0,00'}
//                                       </span>
//                                     </DetailItem>
//                                   )}
//                                 </DetailGrid>
//                               </>
//                             ) : (
//                               <span style={{ color: '#718096' }}>
//                                 Clique em "Buscar detalhes" para carregar as informações completas
//                               </span>
//                             )}
//                           </DetailContent>
//                         </td>
//                       </DetailRow>
//                     )}
//                   </React.Fragment>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </TableWrapper>
//       )}
//     </Card>
//   );
// };