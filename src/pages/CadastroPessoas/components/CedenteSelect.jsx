import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import * as S from '../CadastroPessoasStyles';
import { useCedentes } from '../hooks/useCedentes';

const CedenteSelect = ({ value, onChange, disabled, error, onCedenteSelecionado }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { cedentes, loading, buscarCedentesPorNome, carregarCedentes } = useCedentes();

  const selectedCedente = useMemo(() => {
    if (!value) return null;
    return cedentes.find((item) => String(item.codigo) === String(value)) || null;
  }, [cedentes, value]);

  const displayValue = searchInput || selectedCedente?.cedente || value || '';

  const handleOpen = useCallback(async () => {
    setIsOpen(true);
    if (cedentes.length === 0) {
      await carregarCedentes();
    }
  }, [cedentes.length, carregarCedentes]);

  const handleClose = () => {
    setIsOpen(false);
  };

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
    const nomeCedente = cedente.cedente || '';
    onChange({
      target: {
        name: 'cedente',
        value: codigoCedente
      }
    });
    if (onCedenteSelecionado) {
      onCedenteSelecionado(cedente);
    }
    setSearchInput(nomeCedente);
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

  return (
    <S.FormGroup $flex="1 1 100%">
      <S.FormLabel>Cedente</S.FormLabel>
      <div style={{ position: 'relative' }}>
        <S.InputWithButton>
          <S.FormInput
            type="text"
            value={displayValue}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={handleOpen}
            disabled={disabled}
            $error={error}
            placeholder="Buscar cedente..."
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
            disabled={disabled}
            title="Buscar cedentes"
          >
            <FaSearch />
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
                Carregando...
              </div>
            ) : cedentes.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                Nenhum cedente encontrado
              </div>
            ) : (
              cedentes.map((cedente) => (
                <div
                  key={cedente.codigo || cedente.id || cedente.cedente}
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
                    {cedente.cedente || cedente.nome || 'Sem nome'}
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