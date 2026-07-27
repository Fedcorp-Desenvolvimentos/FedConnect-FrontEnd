import React, { useCallback, useState, useEffect } from 'react';
import { FaSearch, FaEraser, FaSlidersH } from 'react-icons/fa';
import { Card, CardHeader, FormGrid, FormGroup, Divider, Actions, Button } from '../ComissoesStyles';
import { PessoaSelect } from './PessoaSelect';
import { buscarCedentes } from '../../../../services/cedenteService';

export const FilterForm = ({
  filters,
  pessoas,
  produtos,
  loading,
  showAdvanced,
  onFilterChange,
  onSearch,
  onClear,
  onToggleAdvanced,
}) => {
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    buscarCedentes()
      .then((res) => {
        const data = res?.dados || res?.data || [];
        setEmpresas(Array.isArray(data) ? data : []);
      })
      .catch(() => setEmpresas([]));
  }, []);
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
        <FormGrid style={{ gridTemplateColumns: '1fr' }}>
          <FormGroup>
            <label>Favorecido</label>
            <PessoaSelect
              pessoas={pessoas}
              value={filters.favorecido}
              onChange={handlePessoaChange}
              placeholder="Nome, código ou documento"
            />
          </FormGroup>
        </FormGrid>

        <FormGrid style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
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
          <label>Produto</label>
          <select
            value={filters.produto || ''}
            onChange={(e) => onFilterChange('produto', e.target.value)}
            disabled={!filters.favorecido || produtos.length === 0}
          >
            <option value="">Todos os produtos</option>
            {produtos.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </FormGroup>
        </FormGrid>

        <FormGrid style={{ gridTemplateColumns: '1fr' }}>
          <FormGroup>
            <label>Empresa</label>
            <select
              value={filters.empresa || ''}
              onChange={(e) => onFilterChange('empresa', e.target.value)}
            >
              <option value="">Todas as empresas</option>
              {empresas.map((emp) => (
                <option key={emp.CEDENTE || emp.cedente || emp.id} value={emp.CEDENTE || emp.cedente || emp.nome}>
                  {emp.CEDENTE || emp.cedente || emp.nome}
                </option>
              ))}
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

          </FormGrid>
        </>
      )}
    </Card>
  );
};