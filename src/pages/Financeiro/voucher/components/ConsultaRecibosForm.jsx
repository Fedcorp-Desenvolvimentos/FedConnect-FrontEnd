// src/pages/Financeiro/voucher/components/ConsultaRecibosForm.jsx (ou similar)

import React, { useCallback } from 'react';
import { FaSearch, FaEraser, FaSlidersH } from 'react-icons/fa';
import { Card, CardHeader, FormGrid, FormGroup, Actions, Button } from '../EmissaoRecibosVoucherStyles';
import { PessoaSelect } from './PessoaSelect';

export const ConsultaRecibosForm = ({
  filters,
  pessoas,
  loading,
  showAdvanced,
  onFilterChange,
  onSearch,        // 🔥 Recebe a função do hook
  onClear,
  onToggleAdvanced,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();  // 🔥 Chama a função do hook
  };

  const handlePessoaChange = useCallback((value) => {
    onFilterChange('favorecido', value);
  }, [onFilterChange]);

  return (
    <Card as="form" onSubmit={handleSubmit}>
      <CardHeader>
        <div>
          <FaSearch />
          <h2>1. Consulta</h2>
        </div>
      </CardHeader>

      <FormGrid>
        <FormGroup>
          Favorecido
          <PessoaSelect
            pessoas={pessoas}
            value={filters.favorecido}
            onChange={handlePessoaChange}
            placeholder="Nome, código ou documento"
          />
        </FormGroup>

        <FormGroup>
          Fatura
          <input
            type="text"
            value={filters.fatura || ''}
            onChange={(e) => onFilterChange('fatura', e.target.value)}
            placeholder="Número da fatura"
          />
        </FormGroup>

        <FormGroup>
          Status
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="pendentes">Pendentes</option>
            <option value="baixadas">Baixadas</option>
          </select>
        </FormGroup>

        <FormGroup>
          Tipo
          <select
            value={filters.tipo || ''}
            onChange={(e) => onFilterChange('tipo', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="BENEFICIO">Benefício</option>
            <option value="CONDOCORP">Condocorp</option>
            <option value="PEAGA">Peaga</option>
          </select>
        </FormGroup>
      </FormGrid>

      <Button type="button" className="ghost" onClick={onToggleAdvanced}>
        <FaSlidersH />
        {showAdvanced ? 'Ocultar filtros avançados' : 'Exibir filtros avançados'}
      </Button>

      {showAdvanced && (
        <FormGrid>
          <FormGroup>
            Co-estipulante
            <input
              type="text"
              value={filters.co_estipulante || ''}
              onChange={(e) => onFilterChange('co_estipulante', e.target.value)}
              placeholder="Co-estipulante"
            />
          </FormGroup>

          <FormGroup>
            Apólice
            <input
              type="text"
              value={filters.apolice || ''}
              onChange={(e) => onFilterChange('apolice', e.target.value)}
              placeholder="Número da apólice"
            />
          </FormGroup>

          <FormGroup>
            Recibo/Voucher
            <input
              type="text"
              value={filters.recibo || ''}
              onChange={(e) => onFilterChange('recibo', e.target.value)}
              placeholder="Número do recibo/voucher"
            />
          </FormGroup>

          <FormGroup>
            Vencimento Inicial
            <input
              type="date"
              value={filters.vencimento_inicial || ''}
              onChange={(e) => onFilterChange('vencimento_inicial', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            Vencimento Final
            <input
              type="date"
              value={filters.vencimento_final || ''}
              onChange={(e) => onFilterChange('vencimento_final', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            Com Voucher
            <select
              value={filters.com_voucher === null ? '' : String(filters.com_voucher)}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange('com_voucher', val === '' ? null : val === 'true');
              }}
            >
              <option value="">Todos</option>
              <option value="true">Com Voucher</option>
              <option value="false">Sem Voucher</option>
            </select>
          </FormGroup>
        </FormGrid>
      )}

      <Actions>
        <Button type="submit" className="primary" disabled={loading}>
          <FaSearch />
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>

        <Button type="button" className="ghost" onClick={onClear}>
          <FaEraser />
          Limpar filtros
        </Button>
      </Actions>
    </Card>
  );
};