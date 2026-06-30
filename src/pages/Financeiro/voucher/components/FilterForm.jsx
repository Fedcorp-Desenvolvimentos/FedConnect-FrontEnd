import React, { useCallback } from 'react';
import { FaSearch, FaEraser, FaSlidersH, FaCalendar } from 'react-icons/fa';
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

  const handlePessoaChange = useCallback(
    (value) => {
      onFilterChange('favorecido', value);
    },
    [onFilterChange]
  );

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
          <label>Favorecido</label>
          <PessoaSelect
            pessoas={pessoas}
            value={filters.favorecido}
            onChange={handlePessoaChange}
            placeholder="Nome, código ou documento"
          />
        </FormGroup>

        <FormGroup>
          <label>Fatura</label>
          <input
            type="text"
            value={filters.fatura || ''}
            onChange={(e) => onFilterChange('fatura', e.target.value)}
            placeholder="Número da fatura"
          />
        </FormGroup>

        <FormGroup>
          <label>Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="pendentes">Pendentes</option>
            <option value="baixadas">Baixadas</option>
            <option value="todas">Todas</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Tipo</label>
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

      <FormGrid style={{ marginTop: '12px' }}>
        <FormGroup>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaCalendar style={{ color: '#2b6cb0' }} />
            Data de Corte
          </label>
          <input
            type="date"
            value={filters.data_corte || ''}
            onChange={(e) => onFilterChange('data_corte', e.target.value)}
          />
          <small>
            {filters.data_corte ? `Usando: ${filters.data_corte}` : 'Padrão: mês vigente'}
          </small>
        </FormGroup>
      </FormGrid>

      <Button type="button" className="ghost" onClick={onToggleAdvanced}>
        <FaSlidersH />
        {showAdvanced ? 'Ocultar filtros avançados' : 'Exibir filtros avançados'}
      </Button>

      {showAdvanced && (
        <FormGrid style={{ marginTop: '12px' }}>
          <FormGroup>
            <label>Co-estipulante</label>
            <input
              type="text"
              value={filters.co_estipulante || ''}
              onChange={(e) => onFilterChange('co_estipulante', e.target.value)}
              placeholder="Co-estipulante"
            />
          </FormGroup>

          <FormGroup>
            <label>Apólice</label>
            <input
              type="text"
              value={filters.apolice || ''}
              onChange={(e) => onFilterChange('apolice', e.target.value)}
              placeholder="Número da apólice"
            />
          </FormGroup>

          <FormGroup>
            <label>Recibo/Voucher</label>
            <input
              type="text"
              value={filters.recibo || ''}
              onChange={(e) => onFilterChange('recibo', e.target.value)}
              placeholder="Número do recibo/voucher"
            />
          </FormGroup>

          <FormGroup>
            <label>Vencimento Inicial</label>
            <input
              type="date"
              value={filters.vencimento_inicial || ''}
              onChange={(e) => onFilterChange('vencimento_inicial', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Vencimento Final</label>
            <input
              type="date"
              value={filters.vencimento_final || ''}
              onChange={(e) => onFilterChange('vencimento_final', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Com Voucher</label>
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

        <Button type="button" className="ghost" onClick={onClear} disabled={loading}>
          <FaEraser />
          Limpar filtros
        </Button>
      </Actions>
    </Card>
  );
};
