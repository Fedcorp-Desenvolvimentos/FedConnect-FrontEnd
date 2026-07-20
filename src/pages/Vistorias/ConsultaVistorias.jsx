// src/pages/Vistorias/ConsultaVistorias.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { FaClipboardCheck, FaSearch, FaTrash, FaFileExcel, FaFilePdf, FaEye } from 'react-icons/fa';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import {
  listarEstados,
  listarVistoriadores,
  listarAdministradoras,
  consultarVistorias,
  exportarExcel,
  exportarPDF
} from '../../services/vistoriasService';
import * as S from './ConsultaVistoriasStyles';

// Componente de Autocomplete genérico
const AutocompleteInput = styled(S.Input)`
  width: 100%;
  height: 46px;
  min-height: 46px;
  max-height: 46px;
  box-sizing: border-box;
  padding-right: ${props => props.$hasValue ? '35px' : '1rem'};
`;

const Autocomplete = ({ value, onChange, onSelect, options, labelKey, valueKey, placeholder, disabled, loading, shimmerLoading, name }) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => {
    const label = opt[labelKey] || '';
    return label.toLowerCase().includes(inputValue.toLowerCase());
  });

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setShowDropdown(true);
    if (!val) {
      if (onSelect) onSelect('', '');
      if (onChange) onChange({ target: { name, value: '' } });
    }
  };

  const handleSelect = (opt) => {
    const label = opt[labelKey] || '';
    const val = opt[valueKey] || '';
    setInputValue(label);
    setShowDropdown(false);
    if (onSelect) onSelect(val, label);
    if (onChange) onChange({ target: { name, value: val } });
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue('');
    setShowDropdown(false);
    if (onSelect) onSelect('', '');
    if (onChange) onChange({ target: { name, value: '' } });
  };

  if (shimmerLoading) {
    return <S.ShimmerInput />;
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <AutocompleteInput
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder || "Digite para buscar..."}
          disabled={disabled}
          autoComplete="off"
          $hasValue={!!inputValue}
        />
        {inputValue && !disabled && (
          <button
            onClick={handleClear}
            type="button"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        )}
      </div>
      {showDropdown && filteredOptions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '2px solid #e2e8f0',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '250px',
          overflowY: 'auto',
        }}>
          {filteredOptions.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '10px 12px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
            >
              <div style={{ fontWeight: '500', color: '#333' }}>{opt[labelKey]}</div>
              {opt[valueKey] && (
                <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                  Código: {opt[valueKey]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {showDropdown && filteredOptions.length === 0 && inputValue.length >= 1 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '2px solid #e2e8f0',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '10px',
          textAlign: 'center',
          color: '#999',
          fontSize: '13px',
          zIndex: 1000
        }}>
          Nenhum resultado encontrado
        </div>
      )}
    </div>
  );
};

const ConsultaVistorias = () => {
  const { user, isAuthenticated } = useAuth();

  // Estados para filtros
  const [formData, setFormData] = useState({
    dt_inicio: '',
    dt_fim: '',
    estado: '',
    administradora: '',
    cod_vistoriador: '',
    fatura: ''
  });

  // Estados para dados dos selects
  const [estados, setEstados] = useState([]);
  const [vistoriadores, setVistoriadores] = useState([]);
  const [administradoras, setAdministradoras] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  // Estados para resultados
  const [vistorias, setVistorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [expandedRow, setExpandedRow] = useState(null);

  const LIMIT = 50;
  const resultadosRef = useRef(null);

  // Carrega dados dos selects
  useEffect(() => {
    const carregarDados = async () => {
      setLoadingFilters(true);
      try {
        const [estadosRes, vistoriadoresRes, administradorasRes] = await Promise.all([
          listarEstados(),
          listarVistoriadores(),
          listarAdministradoras()
        ]);

        if (estadosRes?.sucesso) setEstados(estadosRes.data || []);
        if (vistoriadoresRes?.sucesso) setVistoriadores(vistoriadoresRes.data || []);
        if (administradorasRes?.sucesso) setAdministradoras(administradorasRes.data || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoadingFilters(false);
      }
    };

    carregarDados();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAdministradoraSelect = useCallback((codigo, nome) => {
    setFormData(prev => ({ ...prev, administradora: codigo }));
  }, []);

  const handleVistoriadorSelect = useCallback((codigo, nome) => {
    setFormData(prev => ({ ...prev, cod_vistoriador: codigo }));
  }, []);

  const handleEstadoSelect = useCallback((codigo, nome) => {
    setFormData(prev => ({ ...prev, estado: codigo }));
  }, []);

  // Consulta vistorias
  const handleConsultar = useCallback(async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErro('');
    setExpandedRow(null);

    try {
      const params = {
        ...formData,
        limit: LIMIT,
        offset: 0
      };

      const resultado = await consultarVistorias(params);

      if (resultado?.sucesso) {
        setVistorias(resultado.data || []);
        setTotalRegistros(resultado.total_registros || 0);
        setHasMore(resultado.has_more || false);
        setOffset(0);
      } else {
        setErro('Erro ao consultar vistorias');
      }
    } catch (error) {
      console.error('Erro ao consultar vistorias:', error);
      setErro(error.message || 'Erro ao consultar vistorias');
    } finally {
      setLoading(false);
    }
  }, [formData]);

  // Limpa filtros
  const handleLimparFiltros = useCallback(() => {
    setFormData({
      dt_inicio: '',
      dt_fim: '',
      estado: '',
      administradora: '',
      cod_vistoriador: '',
      fatura: ''
    });
    setVistorias([]);
    setTotalRegistros(0);
    setHasMore(false);
    setOffset(0);
    setErro('');
    setExpandedRow(null);
  }, []);

  // Exporta para Excel
  const handleExportarExcel = async () => {
    try {
      await exportarExcel(formData);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      setErro(error.message || 'Erro ao exportar Excel');
    }
  };

  // Exporta para PDF
  const handleExportarPDF = async () => {
    try {
      await exportarPDF(formData);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      setErro(error.message || 'Erro ao exportar PDF');
    }
  };

  // Formata data
  const formatarData = (data) => {
    if (!data) return '-';
    try {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
  };

  // Formata valor
  const formatarValor = (valor) => {
    if (!valor) return '-';
    try {
      const num = parseFloat(valor);
      return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch {
      return valor;
    }
  };

  // Prepara opções para os autocompletes
  const opcoesEstados = estados.map(e => ({ label: e, value: e }));
  const opcoesVistoriadores = vistoriadores.map(v => ({ label: v.nome_vistoriador, value: v.cod_vistoriador }));
  const opcoesAdministradoras = administradoras.map(a => ({ label: a.nome, value: a.pessoa }));

  if (!isAuthenticated) {
    return (
      <PageLayout title="Consulta de Vistorias" icon={<FaClipboardCheck />}>
        <S.Container>
          <S.ErrorMessage>Você precisa estar logado para acessar esta página.</S.ErrorMessage>
        </S.Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Consulta de Vistorias"
      subtitle="Consulte e exporte relatórios de vistorias realizadas"
      icon={<FaClipboardCheck />}
    >
      <S.Container>
        <S.Form onSubmit={handleConsultar}>
          <S.FiltrosGrid>
            <S.FormGroup>
              <S.Label>Data Início</S.Label>
              <S.Input
                type="date"
                name="dt_inicio"
                value={formData.dt_inicio}
                onChange={handleChange}
                disabled={loading}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Data Fim</S.Label>
              <S.Input
                type="date"
                name="dt_fim"
                value={formData.dt_fim}
                onChange={handleChange}
                disabled={loading}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Estado</S.Label>
              <Autocomplete
                value={formData.estado}
                onChange={handleChange}
                onSelect={handleEstadoSelect}
                options={opcoesEstados}
                labelKey="label"
                valueKey="value"
                placeholder="Digite o estado..."
                disabled={loading}
                shimmerLoading={loadingFilters}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Administradora</S.Label>
              <Autocomplete
                value={formData.administradora}
                onChange={handleChange}
                onSelect={handleAdministradoraSelect}
                options={opcoesAdministradoras}
                labelKey="label"
                valueKey="value"
                placeholder="Digite o nome da administradora..."
                disabled={loading}
                shimmerLoading={loadingFilters}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Vistoriador</S.Label>
              <Autocomplete
                value={formData.cod_vistoriador}
                onChange={handleChange}
                onSelect={handleVistoriadorSelect}
                options={opcoesVistoriadores}
                labelKey="label"
                valueKey="value"
                placeholder="Digite o nome do vistoriador..."
                disabled={loading}
                shimmerLoading={loadingFilters}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Fatura</S.Label>
              <S.Input
                type="text"
                name="fatura"
                value={formData.fatura}
                onChange={handleChange}
                placeholder="Número da fatura"
                disabled={loading}
              />
            </S.FormGroup>
          </S.FiltrosGrid>

          <S.ButtonGroup>
            <S.Button type="submit" disabled={loading}>
              <FaSearch /> {loading ? 'Consultando...' : 'Consultar'}
            </S.Button>
            <S.Button type="button" $secondary onClick={handleLimparFiltros} disabled={loading}>
              <FaTrash /> Limpar
            </S.Button>
            <S.Button type="button" $secondary onClick={handleExportarExcel} disabled={loading || vistorias.length === 0}>
              <FaFileExcel /> Excel
            </S.Button>
            <S.Button type="button" $secondary onClick={handleExportarPDF} disabled={loading || vistorias.length === 0}>
              <FaFilePdf /> PDF
            </S.Button>
          </S.ButtonGroup>
        </S.Form>

        {erro && <S.ErrorMessage>{erro}</S.ErrorMessage>}

        {(loading || vistorias.length > 0) && (
          <S.ResultContainer ref={resultadosRef}>
            <S.ResultHeader>
              <h3>
                Resultados
                <S.TotalBadge>{totalRegistros} registros</S.TotalBadge>
              </h3>
            </S.ResultHeader>

            <S.TableWrapper>
              <S.Table>
                <thead>
                  <tr>
                    <th style={{ width: '40px', textAlign: 'center' }}></th>
                    <th>Código</th>
                    <th>Data Realização</th>
                    <th>Estado</th>
                    <th>Administradora</th>
                    <th>Vistoriador</th>
                    <th>Metragem</th>
                    <th>Fatura</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {vistorias.map((vistoria, index) => (
                    <S.TableRow
                      key={index}
                      className={expandedRow === index ? 'expanded' : ''}
                      onClick={() => setExpandedRow(prev => prev === index ? null : index)}
                    >
                      <td style={{ textAlign: 'center' }}>
                        {expandedRow === index ? '▼' : '▶'}
                      </td>
                      <td><S.FaturaNumero>{vistoria.CONTROLE_MOVIMENTO || '-'}</S.FaturaNumero></td>
                      <td>{formatarData(vistoria.DT_REALIZACAO)}</td>
                      <td>{vistoria.ESTADO_MOV || '-'}</td>
                      <td>{vistoria.NOME_ADMINISTRADORA || '-'}</td>
                      <td>{vistoria.VISTORIADOR || '-'}</td>
                      <td>{vistoria.METRAGEM ? `${vistoria.METRAGEM} m²` : '-'}</td>
                      <td>{vistoria.FATURA || '-'}</td>
                      <td><span className="valor">{formatarValor(vistoria.VALOR_COBRAR)}</span></td>
                    </S.TableRow>
                  ))}
                </tbody>
              </S.Table>
            </S.TableWrapper>

            {vistorias.length > 0 && (
              <S.PaginationContainer>
                <S.PaginationInfo>
                  Mostrando <strong>{offset + 1}</strong> a <strong>{offset + vistorias.length}</strong> de <strong>{totalRegistros}</strong> registros
                </S.PaginationInfo>
                <S.PaginationControls>
                  <S.PageButton
                    onClick={() => {
                      if (offset > 0) {
                        const newOffset = Math.max(0, offset - LIMIT);
                        setOffset(newOffset);
                        handleConsultar();
                      }
                    }}
                    disabled={offset === 0 || loading}
                  >
                    Anterior
                  </S.PageButton>
                  <span style={{ margin: '0 0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                    Página {Math.floor(offset / LIMIT) + 1}
                  </span>
                  <S.PageButton
                    onClick={() => {
                      if (hasMore) {
                        setOffset(offset + LIMIT);
                        handleConsultar();
                      }
                    }}
                    disabled={!hasMore || loading}
                  >
                    Próxima
                  </S.PageButton>
                </S.PaginationControls>
              </S.PaginationContainer>
            )}
          </S.ResultContainer>
        )}

        {/* Modal de detalhes */}
        {expandedRow !== null && vistorias[expandedRow] && (
          <S.ModalOverlay onClick={() => setExpandedRow(null)}>
            <S.ModalContent onClick={(e) => e.stopPropagation()}>
              <S.ModalHeader>
                <h3>Detalhes da Vistoria</h3>
                <S.ModalClose onClick={() => setExpandedRow(null)}>×</S.ModalClose>
              </S.ModalHeader>
              <S.ModalBody>
                <S.ModalSection>
                  <h4>Informações Gerais</h4>
                  <S.ModalInfoGrid>
                    <S.ModalInfoItem>
                      <label>Código</label>
                      <span>{vistorias[expandedRow].CONTROLE_MOVIMENTO || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Data Realização</label>
                      <span>{formatarData(vistorias[expandedRow].DT_REALIZACAO)}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Data Solicitação</label>
                      <span>{formatarData(vistorias[expandedRow].DT_SOLICITACAO)}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Estado</label>
                      <span>{vistorias[expandedRow].ESTADO_MOV || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Status</label>
                      <span>{vistorias[expandedRow].STATUS || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Tipo Vistoria</label>
                      <span>{vistorias[expandedRow].TIPO_VISTORIA || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Metragem</label>
                      <span>{vistorias[expandedRow].METRAGEM ? `${vistorias[expandedRow].METRAGEM} m²` : '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Mobiliado</label>
                      <span>{vistorias[expandedRow].MOBILIADO === 'S' ? 'Sim' : 'Não'}</span>
                    </S.ModalInfoItem>
                  </S.ModalInfoGrid>
                </S.ModalSection>

                <S.ModalSection>
                  <h4>Administradora e Vistoriador</h4>
                  <S.ModalInfoGrid>
                    <S.ModalInfoItem>
                      <label>Administradora</label>
                      <span>{vistorias[expandedRow].NOME_ADMINISTRADORA || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Código Administradora</label>
                      <span>{vistorias[expandedRow].ADMINISTRADORA || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Vistoriador</label>
                      <span>{vistorias[expandedRow].VISTORIADOR || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Código Vistoriador</label>
                      <span>{vistorias[expandedRow].COD_VISTORIADOR || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Solicitante</label>
                      <span>{vistorias[expandedRow].SOLICITANTE || '-'}</span>
                    </S.ModalInfoItem>
                  </S.ModalInfoGrid>
                </S.ModalSection>

                <S.ModalSection>
                  <h4>Endereço</h4>
                  <S.ModalInfoGrid>
                    <S.ModalInfoItem>
                      <label>Endereço</label>
                      <span>{vistorias[expandedRow].ENDERECO_MOV || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Cidade</label>
                      <span>{vistorias[expandedRow].CIDADE_MOV || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Bairro</label>
                      <span>{vistorias[expandedRow].BAIRRO_MOV || '-'}</span>
                    </S.ModalInfoItem>
                  </S.ModalInfoGrid>
                </S.ModalSection>

                <S.ModalSection>
                  <h4>Fatura e Valores</h4>
                  <S.ModalInfoGrid>
                    <S.ModalInfoItem>
                      <label>Fatura</label>
                      <span>{vistorias[expandedRow].FATURA || '-'}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Valor</label>
                      <span className="valor-destaque">{formatarValor(vistorias[expandedRow].VALOR_COBRAR)}</span>
                    </S.ModalInfoItem>
                    <S.ModalInfoItem>
                      <label>Apólice</label>
                      <span>{vistorias[expandedRow].APOLICE || '-'}</span>
                    </S.ModalInfoItem>
                  </S.ModalInfoGrid>
                </S.ModalSection>

                {vistorias[expandedRow].OBS_VISTORIA && (
                  <S.ModalSection>
                    <h4>Observação</h4>
                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6' }}>
                      {vistorias[expandedRow].OBS_VISTORIA}
                    </p>
                  </S.ModalSection>
                )}
              </S.ModalBody>
            </S.ModalContent>
          </S.ModalOverlay>
        )}
      </S.Container>
    </PageLayout>
  );
};

export default ConsultaVistorias;
