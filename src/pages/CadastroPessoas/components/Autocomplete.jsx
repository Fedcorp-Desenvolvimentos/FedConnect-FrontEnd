// src/pages/CadastroPessoas/components/Autocomplete.jsx

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSearch, FaTimes, FaSpinner, FaInbox } from 'react-icons/fa';

const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

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
  background: ${(props) => props.$bg || '#3b82f6'};
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
  flex-wrap: wrap;
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

const Autocomplete = ({
  value,
  onChange,
  disabled,
  error,
  placeholder = 'Buscar...',
  label = '',
  name = '',
  items = [],
  loading = false,
  onSearch,
  onSelect,
  getItemId,
  getItemLabel,
  getItemSubLabel,
  getAvatarSeed,
  minSearchLength = 0,
  debounceTime = 300,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const wrapperRef = useRef(null);
  const searchTimerRef = useRef(null);

  const selectedItem = useMemo(() => {
    if (!value || !items.length) return null;
    const idGetter = getItemId || ((item) => item.id || item.codigo);
    return items.find((item) => String(idGetter(item)) === String(value)) || null;
  }, [items, value, getItemId]);

  const displayValue = useMemo(() => {
    if (searchInput) return searchInput;
    if (selectedItem) {
      const labelGetter = getItemLabel || ((item) => item.nome || item.label || '');
      return labelGetter(selectedItem);
    }
    return value || '';
  }, [searchInput, selectedItem, value, getItemLabel]);

  const filteredItems = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term || !items.length) return items;

    const labelGetter = getItemLabel || ((item) => item.nome || item.label || '');
    const idGetter = getItemId || ((item) => item.id || item.codigo || '');

    return items.filter((item) => {
      const label = labelGetter(item).toLowerCase();
      const id = String(idGetter(item));
      return label.includes(term) || id.includes(term);
    });
  }, [items, debouncedSearch, getItemLabel, getItemId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (searchInput.length >= minSearchLength) {
      searchTimerRef.current = setTimeout(() => {
        setDebouncedSearch(searchInput);
        if (onSearch) {
          onSearch(searchInput);
        }
      }, debounceTime);
    } else {
      setDebouncedSearch(searchInput);
      if (onSearch && searchInput === '') {
        onSearch('');
      }
    }

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchInput, minSearchLength, debounceTime, onSearch]);

  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
    }
  }, [disabled]);

  const handleSelectItem = (item) => {
    const idGetter = getItemId || ((i) => i.id || i.codigo);
    const labelGetter = getItemLabel || ((i) => i.nome || i.label || '');

    const itemValue = idGetter(item);
    const itemLabel = labelGetter(item);

    onChange({
      target: {
        name: name,
        value: itemValue !== undefined ? String(itemValue) : '',
      },
    });

    if (onSelect) {
      onSelect(item);
    }

    setSearchInput('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({
      target: {
        name: name,
        value: '',
      },
    });
    setSearchInput('');
    setDebouncedSearch('');
    setIsOpen(false);
    if (onSearch) {
      onSearch('');
    }
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    if (!isOpen && e.target.value.trim().length >= minSearchLength) {
      setIsOpen(true);
    }
  };

  const renderDefaultItem = (item) => {
    const labelGetter = getItemLabel || ((i) => i.nome || i.label || 'Sem nome');
    const subLabelGetter = getItemSubLabel || ((i) => i.subLabel || '');
    const avatarSeed = getAvatarSeed ? getAvatarSeed(item) : labelGetter(item);
    const label = labelGetter(item);

    return (
      <Row onClick={() => handleSelectItem(item)}>
        <Avatar $bg={getAvatarColor(avatarSeed)}>{getInitials(label)}</Avatar>
        <RowInfo>
          <RowName>{highlightMatch(label, searchInput)}</RowName>
          <RowMeta>
            {subLabelGetter(item) && <span>{subLabelGetter(item)}</span>}
          </RowMeta>
        </RowInfo>
      </Row>
    );
  };

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ 
          display: 'block', 
          fontSize: '0.8rem', 
          fontWeight: 500, 
          color: '#475569', 
          marginBottom: '0.25rem' 
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
        </div>
      )}
      
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <input
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleOpen}
            disabled={disabled}
            placeholder={loading ? 'Carregando...' : placeholder}
            style={{
              flex: 1,
              width: '100%',
              padding: '0.55rem 0.75rem',
              border: `1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
              borderRadius: '8px',
              fontSize: '0.875rem',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              background: disabled ? '#f8fafc' : 'white',
              outline: 'none',
            }}
            onBlur={(e) => {
              if (!isOpen) {
                e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0';
                e.target.style.boxShadow = 'none';
              }
            }}
          />
          
          {value && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.4rem',
                height: '2.4rem',
                minWidth: '2.4rem',
                padding: 0,
                border: 'none',
                borderRadius: '8px',
                background: disabled ? '#e2e8f0' : '#f1f5f9',
                color: disabled ? '#94a3b8' : '#475569',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.target.style.background = '#e2e8f0';
                  e.target.style.color = '#0f3d5d';
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled) {
                  e.target.style.background = '#f1f5f9';
                  e.target.style.color = '#475569';
                }
              }}
            >
              <FaTimes />
            </button>
          )}
          
          <button
            type="button"
            onClick={handleOpen}
            disabled={disabled || loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.4rem',
              height: '2.4rem',
              minWidth: '2.4rem',
              padding: 0,
              border: 'none',
              borderRadius: '8px',
              background: disabled ? '#e2e8f0' : '#f1f5f9',
              color: disabled ? '#94a3b8' : '#475569',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!disabled && !loading) {
                e.target.style.background = '#e2e8f0';
                e.target.style.color = '#0f3d5d';
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled && !loading) {
                e.target.style.background = '#f1f5f9';
                e.target.style.color = '#475569';
              }
            }}
          >
            {loading ? <FaSpinner className="spin" style={{ animation: 'spin 1s linear infinite' }} /> : <FaSearch />}
          </button>
        </div>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>

        {isOpen && !disabled && (
          <Dropdown>
            {!loading && items.length > 0 && (
              <DropdownHeader>
                <span>Resultados</span>
                <span>{filteredItems.length}/{items.length}</span>
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
            ) : filteredItems.length === 0 ? (
              <EmptyState>
                <FaInbox />
                <p>Nenhum resultado encontrado</p>
                {searchInput && <p style={{ fontSize: '0.7rem', marginTop: '4px' }}>para "{searchInput}"</p>}
              </EmptyState>
            ) : (
              filteredItems.map((item) => {
                const idGetter = getItemId || ((i) => i.id || i.codigo);
                const key = idGetter(item) || Math.random();
                return <div key={key}>{renderDefaultItem(item)}</div>;
              })
            )}
          </Dropdown>
        )}
      </div>
      
      {error && <span style={{ display: 'block', fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
};

export default Autocomplete;