// src/pages/CadastroPessoas/components/PessoaAutocomplete.jsx

import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';
import { usePessoasSearch } from '../../../hooks/usePessoasSearch';
import * as S from '../CadastroPessoasStyles';

const PessoaAutocomplete = ({ 
  value, 
  onChange, 
  disabled, 
  error, 
  placeholder = "Buscar pessoa por nome ou CPF/CNPJ...",
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const wrapperRef = useRef(null);
  const { resultados, loading, buscarPessoasPorNome, limparResultados } = usePessoasSearch();

  // Encontra a pessoa selecionada
  const selectedPessoa = resultados.find(p => String(p.pessoa || p.PESSOA || p.codigo) === String(value));

  // O que mostrar no input
  const displayValue = searchInput || selectedPessoa?.nome || selectedPessoa?.NOME || value || '';

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Busca ao digitar
  useEffect(() => {
    if (searchInput.length >= 2) {
      buscarPessoasPorNome(searchInput);
    } else {
      limparResultados();
    }
  }, [searchInput, buscarPessoasPorNome, limparResultados]);

  const handleSelectPessoa = (pessoa) => {
    const codigo = pessoa.pessoa || pessoa.PESSOA || pessoa.codigo || '';
    const nome = pessoa.nome || pessoa.NOME || '';
    
    onChange({
      target: {
        name: 'favorecido',
        value: codigo
      }
    });
    
    // Se tiver callback, chama com a pessoa selecionada
    if (onSelect) {
      onSelect(pessoa);
    }
    
    setSearchInput(nome);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({
      target: {
        name: 'favorecido',
        value: ''
      }
    });
    setSearchInput('');
    limparResultados();
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      if (searchInput.length >= 2) {
        buscarPessoasPorNome(searchInput);
      }
    }
  };

  const formatDocumento = (doc) => {
    if (!doc) return '';
    const digits = doc.replace(/\D/g, '');
    if (digits.length === 14) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return doc;
  };

  return (
    <S.FormGroup $flex="1 1 100%">
      <S.FormLabel>Favorecido (Buscar Pessoa)</S.FormLabel>
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <S.InputWithButton>
          <S.FormInput
            type="text"
            value={displayValue}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={handleFocus}
            disabled={disabled}
            $error={error}
            placeholder={placeholder}
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
            disabled={disabled || loading}
            title="Buscar pessoas"
          >
            {loading ? <FaSpinner className="spin" /> : <FaSearch />}
          </S.IconSquareButton>
        </S.InputWithButton>

        {isOpen && !disabled && (resultados.length > 0 || loading) && (
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
                <FaSpinner className="spin" /> Buscando pessoas...
              </div>
            ) : resultados.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8' }}>
                Nenhuma pessoa encontrada
              </div>
            ) : (
              resultados.map((pessoa) => {
                const codigo = pessoa.pessoa || pessoa.PESSOA || pessoa.codigo || '';
                const nome = pessoa.nome || pessoa.NOME || '';
                const cpfCnpj = pessoa.cpf_cnpj || pessoa.CPF_CNPJ || '';
                
                return (
                  <div
                    key={codigo}
                    onClick={() => handleSelectPessoa(pessoa)}
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
                      {codigo} - {nome}
                    </div>
                    {cpfCnpj && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {formatDocumento(cpfCnpj)}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.FormGroup>
  );
};

export default PessoaAutocomplete;