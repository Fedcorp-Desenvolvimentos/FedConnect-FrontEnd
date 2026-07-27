// src/pages/CadastroPessoas/components/CedenteSelect.jsx

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSearch, FaTimes, FaSpinner, FaInbox, FaBuilding } from 'react-icons/fa';
import * as S from '../CadastroPessoasStyles';
import { useCedentes } from '../../../hooks/useCedentes';

// ==================== ANIMAÇÕES ====================
const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// ==================== ESTILOS ====================
const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 61, 93, 0.12);
  max-height: 280px;
  overflow-y: auto;
  z-index: 1000;
  animation: ${fadeSlideIn} 0.15s ease-out;
`;

const DropdownHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.9rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #94a3b8;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  border-bottom: 1px solid #f8fafc;
  transition: background 0.12s ease;

  &:hover {
    background: #f0f7ff;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.div`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: white;
  background: ${(props) => props.$bg};
`;

const RowInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

const RowName = styled.div`
  font-weight: 600;
  color: #0f3d5d;
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  mark {
    background: #fef08a;
    color: inherit;
    border-radius: 3px;
    padding: 0 1px;
  }
`;

const RowMeta = styled.div`
  font-size: 0.72rem;
  color: #94a3b8;
  display: flex;
  gap: 0.6rem;
`;

const SkeletonRow = styled.div`
  padding: 0.6rem 0.9rem;
  display: flex;
  gap: 0.65rem;
  align-items: center;

  div {
    border-radius: 6px;
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%);
    background-size: 400px 100%;
    animation: ${shimmer} 1.2s ease-in-out infinite;
  }
`;

const EmptyState = styled.div`
  padding: 1.75rem 1rem;
  text-align: center;
  color: #94a3b8;

  svg {
    font-size: 1.6rem;
    margin-bottom: 0.4rem;
    opacity: 0.6;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
  }
`;

// ==================== HELPERS ====================
const AVATAR_COLORS = ['#3b82f6', '#0f3d5d', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4'];

const getAvatarColor = (seed = '') => {
  const code = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const highlightMatch = (text = '', term = '') => {
  if (!term.trim()) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + term.length)}</mark>
      {text.slice(idx + term.length)}
    </>
  );
};

const normalize = (value = '') =>
  value.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

// ==================== COMPONENTE ====================
const CedenteSelect = ({ value, onChange, disabled, error, onCedenteSelecionado }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const wrapperRef = useRef(null);

  // ✅ Agora só usamos carregarCedentes: busca a lista inteira (15 registros) UMA vez
  const { cedentes, loading, carregarCedentes } = useCedentes();

  const selectedCedente = useMemo(() => {
    if (!value) return null;
    return cedentes.find((item) => String(item.codigo) === String(value)) || null;
  }, [cedentes, value]);

  const displayValue = searchInput || selectedCedente?.nome || selectedCedente?.cedente || value || '';

  // ✅ Filtro 100% client-side: nome, cedente, cnpj ou código
  const filteredCedentes = useMemo(() => {
    const term = normalize(searchInput.trim());
    if (!term) return cedentes;

    const digitsTerm = term.replace(/\D/g, '');

    return cedentes.filter((c) => {
      const nome = normalize(c.nome || c.cedente || '');
      const cnpjDigits = (c.cnpj || '').replace(/\D/g, '');
      const codigo = String(c.codigo || '');

      return (
        nome.includes(term) ||
        (digitsTerm && cnpjDigits.includes(digitsTerm)) ||
        codigo.includes(term)
      );
    });
  }, [cedentes, searchInput]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Carrega a lista completa uma única vez (se ainda não tiver sido carregada)
  const ensureLoaded = useCallback(async () => {
    if (cedentes.length === 0 && !loading) {
      await carregarCedentes();
    }
  }, [cedentes.length, loading, carregarCedentes]);

  useEffect(() => {
    if (isOpen) {
      ensureLoaded();
    }
  }, [isOpen, ensureLoaded]);

  const handleOpen = useCallback(async () => {
    if (!disabled) {
      setIsOpen(true);
      await ensureLoaded();
    }
  }, [disabled, ensureLoaded]);

  const handleSelectCedente = (cedente) => {
    const codigoCedente = cedente.codigo ? String(cedente.codigo) : '';
    onChange({
      target: {
        name: 'cedente',
        value: codigoCedente,
      },
    });
    if (onCedenteSelecionado) {
      onCedenteSelecionado(cedente);
    }
    setSearchInput('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({
      target: {
        name: 'cedente',
        value: '',
      },
    });
    setSearchInput('');
    setIsOpen(false);
  };

  const getDisplayName = (cedente) => cedente.nome || cedente.cedente || cedente.razao_social || 'Sem nome';

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
            <S.IconSquareButton type="button" onClick={handleClear} disabled={disabled} title="Limpar">
              <FaTimes />
            </S.IconSquareButton>
          )}
          <S.IconSquareButton type="button" onClick={handleOpen} disabled={disabled || loading} title="Buscar cedentes">
            {loading ? <FaSpinner className="spin" /> : <FaSearch />}
          </S.IconSquareButton>
        </S.InputWithButton>

        {isOpen && !disabled && (
          <Dropdown>
            {!loading && cedentes.length > 0 && (
              <DropdownHeader>
                <span>Cedentes</span>
                <span>
                  {filteredCedentes.length}/{cedentes.length}
                </span>
              </DropdownHeader>
            )}

            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <SkeletonRow key={i}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '60%', height: 10, marginBottom: 6 }} />
                      <div style={{ width: '35%', height: 8 }} />
                    </div>
                  </SkeletonRow>
                ))}
              </>
            ) : filteredCedentes.length === 0 ? (
              <EmptyState>
                <FaInbox />
                <p>Nenhum cedente encontrado para "{searchInput}"</p>
              </EmptyState>
            ) : (
              filteredCedentes.map((cedente) => {
                const nome = getDisplayName(cedente);
                return (
                  <Row key={cedente.codigo || cedente.id || nome} onClick={() => handleSelectCedente(cedente)}>
                    <Avatar $bg={getAvatarColor(nome)}>{getInitials(nome)}</Avatar>
                    <RowInfo>
                      <RowName>{highlightMatch(nome, searchInput)}</RowName>
                      <RowMeta>
                        {cedente.codigo && <span>#{cedente.codigo}</span>}
                        {cedente.cnpj && (
                          <span>
                            <FaBuilding style={{ marginRight: 3, fontSize: '0.65rem' }} />
                            {cedente.cnpj}
                          </span>
                        )}
                      </RowMeta>
                    </RowInfo>
                  </Row>
                );
              })
            )}
          </Dropdown>
        )}
      </div>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.FormGroup>
  );
};

export default CedenteSelect;
