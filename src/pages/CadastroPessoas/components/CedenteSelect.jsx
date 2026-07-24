// src/pages/CadastroPessoas/components/CedenteSelect.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import * as S from '../CadastroPessoasStyles';
import { useCedentes } from '../../../hooks/useCedentes';

const CedenteSelect = ({ value, onChange, disabled, error, onCedenteSelecionado }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const wrapperRef = useRef(null);
  const { cedentes, loading, buscarCedentesPorNome, carregarCedentes } = useCedentes();

  const selectedCedente = useMemo(() => {
    if (!value) return null;
    return cedentes.find((item) => String(item.codigo) === String(value)) || null;
  }, [cedentes, value]);

  const displayValue = searchInput || selectedCedente?.nome || selectedCedente?.cedente || value || '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Carrega cedentes ao focar se tiver valor
  useEffect(() => {
    if (isOpen && value && cedentes.length === 0 && !loading) {
      carregarCedentes();
    }
  }, [isOpen, value, cedentes.length, loading, carregarCedentes]);

  const handleOpen = useCallback(async () => {
    if (!disabled) {
      setIsOpen(true);
      if (cedentes.length === 0) {
        await carregarCedentes();
      }
    }
  }, [cedentes.length, carregarCedentes, disabled]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.length >= 2) {
        buscarCedentesPorNome(searchInput);
      } else if (searchInput === '') {
        carregarCedentes();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, buscarCedentesPorNome, carregarCedentes]);

  const handleSelectCedente = (cedente) => {
    const codigoCedente = cedente.codigo ? String(cedente.codigo) : '';
    onChange({
      target: {
        name: 'cedente',
        value: codigoCedente
      }
    });
    if (onCedenteSelecionado) {
      onCedenteSelecionado(cedente);
    }
    setSearchInput(cedente.nome || cedente.cedente || '');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({
      target: {
        name: 'cedente',
        value: ''
      }
    });
    setSearchInput('');
    setIsOpen(false);
  };

  const getDisplayName = (cedente) => {
    return cedente.nome || cedente.cedente || cedente.razao_social || 'Sem nome';
  };

  return (
    <S.FormGroup $flex="1 1 100%">
      <S.FormLabel>Cedente</S.FormLabel>
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <S.InputWithButton>
          <S.FormInput
            type="text"
            value={displayValue}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={handleOpen}
            disabled={disabled}
            $error={error}
            placeholder={loading ? 'Carregando cedentes...' : 'Buscar cedente...'}
          />
          {value && (
            <S.IconSquareButton
              type="button"
              onClick={handleClear}
              disabled={disabled}
              title="Limpar"
            >
              <FaTimes />
            </S.IconSquareButton>
          )}
          <S.IconSquareButton
            type="button"
            onClick={handleOpen}
            disabled={disabled || loading}
            title="Buscar cedentes"
          >
            {loading ? <FaSpinner className="spin" /> : <FaSearch />}
          </S.IconSquareButton>
        </S.InputWithButton>

        {isOpen && !disabled && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              maxHeight: '250px',
              overflowY: 'auto',
              zIndex: 1000,
            }}
          >
            {loading ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                <FaSpinner className="spin" /> Carregando...
              </div>
            ) : cedentes.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                Nenhum cedente encontrado
              </div>
            ) : (
              cedentes.map((cedente) => (
                <div
                  key={cedente.codigo || cedente.id || Math.random()}
                  onClick={() => handleSelectCedente(cedente)}
                  style={{
                    padding: '0.6rem 1rem',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background 0.15s ease',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  <div style={{ fontWeight: 600, color: '#0f3d5d' }}>
                    {getDisplayName(cedente)}
                  </div>
                  {cedente.cnpj && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      CNPJ: {cedente.cnpj}
                    </div>
                  )}
                  {cedente.codigo && (
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      Código: {cedente.codigo}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.FormGroup>
  );
};

export default CedenteSelect;