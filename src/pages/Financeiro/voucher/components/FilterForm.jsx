import React, { useCallback } from 'react';
import { FaSearch, FaEraser, FaSlidersH, FaCalendarAlt } from 'react-icons/fa';
import { Card, CardHeader, FormGrid, FormGroup, DataCorteGroup, Divider, Actions, Button } from '../EmissaoRecibosVoucherStyles';
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
          <h2>Consulta</h2>
          <span>Defina o período e, se precisar, refine com filtros adicionais</span>
        </div>
      </CardHeader>

      {/*
        A data de corte é o filtro que mais impacta o resultado, por isso
        abre a grade em destaque, seguida dos filtros de uso mais comum.
      */}
      <FormGrid>
        <DataCorteGroup>
          <label>
            <FaCalendarAlt style={{ marginRight: 5, position: 'relative', top: 1 }} />
            Data de corte
          </label>
          <input
            type="date"
            value={filters.data_corte || ''}
            onChange={(e) => onFilterChange('data_corte', e.target.value)}
            required
          />
          <small>{filters.data_corte ? `Usando ${filters.data_corte}` : 'Padrão: mês vigente'}</small>
        </DataCorteGroup>

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
      </FormGrid>

      <Actions style={{ marginTop: 14, marginBottom: showAdvanced ? 0 : undefined }}>
        <Button type="submit" className="primary" disabled={loading}>
          <FaSearch />
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>

        <Button type="button" className="ghost" onClick={onClear} disabled={loading}>
          <FaEraser />
          Limpar filtros
        </Button>

        {/* <Button type="button" className="ghost" onClick={onToggleAdvanced} style={{ marginLeft: 'auto' }}>
          <FaSlidersH />
          {showAdvanced ? 'Ocultar filtros avançados' : 'Filtros avançados'}
        </Button> */}
      </Actions>

      {showAdvanced && (
        <>
          <Divider />
          <FormGrid>
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
              <label>Vencimento inicial</label>
              <input
                type="date"
                value={filters.vencimento_inicial || ''}
                onChange={(e) => onFilterChange('vencimento_inicial', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <label>Vencimento final</label>
              <input
                type="date"
                value={filters.vencimento_final || ''}
                onChange={(e) => onFilterChange('vencimento_final', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <label>Com voucher</label>
              <select
                value={filters.com_voucher === null ? '' : String(filters.com_voucher)}
                onChange={(e) => {
                  const val = e.target.value;
                  onFilterChange('com_voucher', val === '' ? null : val === 'true');
                }}
              >
                <option value="">Todos</option>
                <option value="true">Com voucher</option>
                <option value="false">Sem voucher</option>
              </select>
            </FormGroup>
          </FormGrid>
        </>
      )}
    </Card>
  );
};