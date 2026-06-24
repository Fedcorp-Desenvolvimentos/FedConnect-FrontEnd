// src/pages/Financeiro/voucher/components/FilterForm.jsx

import React from 'react';
import { FaSearch, FaEraser, FaSlidersH } from 'react-icons/fa';
import { Card, CardHeader, FormGrid, FormGroup, Actions, Button } from '../EmissaoRecibosVoucherStyles';
import { PessoaSelect } from './PessoaSelect';

export const FilterForm = ({
  filters,
  pessoas,
  loading,
  showAdvanced,
  onFilterChange,
  onSearch,
  onClear,
  onToggleAdvanced,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

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
            onChange={(value) => onFilterChange('favorecido', value)}
            placeholder="Nome, código ou documento"
          />
        </FormGroup>

        <FormGroup>
          Fatura
          <input
            type="text"
            value={filters.fatura}
            onChange={(e) => onFilterChange('fatura', e.target.value)}
            placeholder="Número da fatura"
          />
        </FormGroup>

        <FormGroup>
          Status
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="baixadas">Baixadas</option>
            <option value="pendentes">Pendentes</option>
          </select>
        </FormGroup>

        <FormGroup>
          Tipo
          <select
            value={filters.tipo}
            onChange={(e) => onFilterChange('tipo', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="A">Peaga</option>
            <option value="B">Outros</option>
            <option value="C">Fedcorp</option>
            <option value="D">Corretora</option>
            <option value="E">Lider</option>
            <option value="F">Condocorp</option>
            <option value="G">Cartão</option>
            <option value="H">Benefício</option>
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
              value={filters.coEstipulante}
              onChange={(e) => onFilterChange('coEstipulante', e.target.value)}
              placeholder="Co-estipulante"
            />
          </FormGroup>

          <FormGroup>
            Apólice
            <input
              type="text"
              value={filters.apolice}
              onChange={(e) => onFilterChange('apolice', e.target.value)}
              placeholder="Número da apólice"
            />
          </FormGroup>

          <FormGroup>
            Recibo
            <input
              type="text"
              value={filters.recibo}
              onChange={(e) => onFilterChange('recibo', e.target.value)}
              placeholder="Número do recibo"
            />
          </FormGroup>

          <FormGroup>
            Vencimento Inicial
            <input
              type="date"
              value={filters.vencimentoInicial}
              onChange={(e) => onFilterChange('vencimentoInicial', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            Vencimento Final
            <input
              type="date"
              value={filters.vencimentoFinal}
              onChange={(e) => onFilterChange('vencimentoFinal', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            Com Voucher
            <select
              value={filters.comVoucher === null ? '' : String(filters.comVoucher)}
              onChange={(e) => {
                const val = e.target.value;
                onFilterChange('comVoucher', val === '' ? null : val === 'true');
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