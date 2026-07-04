import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2b6cb0;
    box-shadow: 0 0 0 3px rgba(43, 108, 176, 0.1);
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 250px;
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  z-index: 1000;
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.15s;

  &:hover {
    background: #f7fafc;
  }

  &:last-child {
    border-bottom: none;
  }

  strong {
    display: block;
    font-size: 14px;
    color: #2d3748;
  }

  span {
    font-size: 12px;
    color: #718096;
  }
`;

const EmptyMessage = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  padding: 10px 12px;
  text-align: center;
  color: #718096;
  font-size: 13px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  z-index: 1000;
`;

export const PessoaSelect = ({ pessoas = [], value, onChange, placeholder }) => {
  const [termo, setTermo] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  const pessoasNormalizadas = useMemo(() => {
    return pessoas.map((p) => ({
      ...p,
      nome: p.NOME || p.nome || p.razao_social || p.nome_fantasia || '',
      codigo: p.PESSOA || p.pessoa || p.codigo || p.id || p.cod_pessoa || '',
      documento: p.CPF_CNPJ || p.cpf_cnpj || p.documento || p.cnpj || p.cpf || '',
    }));
  }, [pessoas]);

  useEffect(() => {
    if (value && pessoasNormalizadas.length > 0) {
      const encontrada = pessoasNormalizadas.find((p) => String(p.codigo) === String(value));
      if (encontrada) {
        setTermo(encontrada.nome);
      } else {
        setTermo(value);
      }
    } else if (!value) {
      setTermo('');
    }
  }, [value, pessoasNormalizadas]);

  const filtradas = useMemo(() => {
    if (!termo || termo.trim().length < 2) return [];

    const t = termo.toLowerCase().trim();

    return pessoasNormalizadas
      .filter(
        (p) =>
          p.nome.toLowerCase().includes(t) ||
          String(p.codigo).toLowerCase().includes(t) ||
          String(p.documento).toLowerCase().includes(t)
      )
      .slice(0, 30);
  }, [pessoasNormalizadas, termo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selecionarPessoa = (pessoa) => {
    setTermo(pessoa.nome);
    setShowDropdown(false);
    onChange(pessoa.codigo);
  };

  const handleChange = (e) => {
    const novoTermo = e.target.value;
    setTermo(novoTermo);
    setShowDropdown(novoTermo.trim().length >= 2);

    if (!novoTermo.trim()) {
      onChange('');
    }
  };

  const handleFocus = () => {
    if (termo.trim().length >= 2) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filtradas.length === 1) {
        selecionarPessoa(filtradas[0]);
      } else {
        setShowDropdown(false);
      }
    }

    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <Container ref={wrapperRef}>
      <Input
        type="text"
        value={termo}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Nome, código ou documento'}
        autoComplete="off"
      />

      {showDropdown && filtradas.length > 0 && (
        <Dropdown>
          {filtradas.map((pessoa, index) => (
            <DropdownItem
              key={pessoa.codigo || index}
              onClick={() => selecionarPessoa(pessoa)}
            >
              <strong>{pessoa.nome}</strong>
              <span>
                Código: {pessoa.codigo || '-'}
                {pessoa.documento ? ` | CNPJ/CPF: ${pessoa.documento}` : ''}
              </span>
            </DropdownItem>
          ))}
        </Dropdown>
      )}

      {showDropdown && filtradas.length === 0 && termo.trim().length >= 2 && (
        <EmptyMessage>Nenhuma pessoa encontrada para "{termo}"</EmptyMessage>
      )}
    </Container>
  );
};
