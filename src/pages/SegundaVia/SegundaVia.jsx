import { useState, useMemo } from 'react';
import { FaSearch, FaFileInvoiceDollar, FaSpinner, FaTimesCircle, FaCheckCircle, FaExclamationTriangle, FaBuilding, FaBarcode } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import * as S from './SegundaViaStyles';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import { consultarSegundaVia, emitirSegundaVia } from '../../services/boletofedbnk';

const STATUS_LABEL = {
  pago: 'Pago',
  pendente: 'Pendente',
  vencido: 'Vencido',
};

const STATUS_ICON = {
  pago: <FaCheckCircle />,
  pendente: <FaExclamationTriangle />,
  vencido: <FaTimesCircle />,
};

const SegundaVia = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [consulted, setConsulted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emitindo, setEmitindo] = useState(false);
  const [boletos, setBoletos] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [administradora, setAdministradora] = useState('');
  const [numeroFatura, setNumeroFatura] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filtro, setFiltro] = useState('');
  const [faturaInput, setFaturaInput] = useState('');

  const filteredBoletos = useMemo(() => {
    if (!filtro.trim()) return boletos;
    const term = filtro.toLowerCase();
    return boletos.filter(b =>
      b.condominio.toLowerCase().includes(term) ||
      b.fatura.toLowerCase().includes(term) ||
      b.nossoNumero.toLowerCase().includes(term)
    );
  }, [boletos, filtro]);

  const allFilteredSelected = filteredBoletos.length > 0 &&
    filteredBoletos.every(b => selectedIds.has(b.id));

  const someFilteredSelected = filteredBoletos.some(b => selectedIds.has(b.id));

  const selectedCount = selectedIds.size;

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredBoletos.forEach(b => next.delete(b.id));
        return next;
      });
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev);
        filteredBoletos.forEach(b => next.add(b.id));
        return next;
      });
    }
  };

  const emitirSelecionados = async () => {
    const selecionados = boletos.filter(b => selectedIds.has(b.id));
    if (selecionados.length === 0) {
      enqueueSnackbar('Selecione ao menos um boleto para emitir a segunda via.', { variant: 'warning' });
      return;
    }

    const indices = selecionados.map(b => b.id - 1);
    const payload = indices.map(i => dadosOriginais[i]);

    setEmitindo(true);

    try {
      const blob = await emitirSegundaVia(numeroFatura, payload);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `segunda-via-${numeroFatura}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      enqueueSnackbar(`${selecionados.length} boleto(s) emitido(s) com sucesso!`, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Erro ao emitir segunda via. Tente novamente.', { variant: 'error' });
    } finally {
      setEmitindo(false);
    }
  };

  const consultarFatura = async () => {
    if (!faturaInput.trim()) {
      enqueueSnackbar('Digite um número de fatura para consultar.', { variant: 'warning' });
      return;
    }

    // Reset state on new search
    setConsulted(false);
    setBoletos([]);
    setSelectedIds(new Set());
    setFiltro('');
    setLoading(true);

    try {
      const response = await consultarSegundaVia(faturaInput.trim());

      if (response.sucesso && response.dados.length > 0) {
        const parseBrl = (str) => {
          if (!str) return 0;
          if (typeof str === 'number') return str;
          return Number(str.replace(/\./g, '').replace(',', '.'));
        };

        const normalizados = response.dados.map((item, index) => ({
          id: index + 1,
          fatura: item.FATURA_NUM,
          condominio: item.CO_ESTIPULANTE || item.ESTIPULANTE,
          valor: parseBrl(item.VALOR_DOCUMENTO || item.VALOR_TOTAL),
          vencimento: item.VENCIMENTO,
          nossoNumero: item.NOSSO_NUMERO,
          linhaDigitavel: item.LINHA_DIGITAVEL,
          status: 'pendente',
        }));

        setAdministradora(response.dados[0].EMISSOR);
        setNumeroFatura(response.dados[0].FATURA_NUM);
        setDadosOriginais(response.dados);
        setBoletos(normalizados);
        setSelectedIds(new Set(normalizados.map(b => b.id)));
        setConsulted(true);
        enqueueSnackbar(`${normalizados.length} boleto(s) encontrado(s) para a fatura ${response.dados[0].FATURA_NUM}`, { variant: 'success' });
      } else {
        enqueueSnackbar('Nenhum boleto encontrado para esta fatura.', { variant: 'warning' });
      }
    } catch (error) {
      enqueueSnackbar('Erro ao consultar fatura. Tente novamente.', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatValor = (valor) =>
    Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatData = (data) => {
    if (!data) return '-';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <PageLayout
      title="Segunda Via de Boletos"
      subtitle="Consulte e emita a segunda via dos seus boletos"
    >
      <S.ListContainer>
        <S.ListCard>
          <S.ListCardHeader>
            <S.ListTitle>
              <i className="bi bi-receipt"></i> Boletos
            </S.ListTitle>
          </S.ListCardHeader>

          {/* Search bar */}
          <S.FaturaInputWrapper style={{ maxWidth: 500, marginBottom: '1.5rem' }}>
            <S.FaturaInput
              type="text"
              placeholder="Digite o número da fatura..."
              value={faturaInput}
              onChange={e => setFaturaInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && consultarFatura()}
              disabled={loading}
            />
            <S.ConsultButton onClick={consultarFatura} disabled={!faturaInput.trim() || loading}>
              {loading ? <FaSpinner className="spinner" /> : <FaFileInvoiceDollar style={{ marginRight: 6 }} />}
              {loading ? 'Consultando...' : 'Consultar'}
            </S.ConsultButton>
          </S.FaturaInputWrapper>

          {consulted && !loading && (
            <>
              {/* Info box + emit button side by side */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <S.InfoBox style={{ flex: 1, marginBottom: 0 }}>
                  <FaBuilding />
                  <div>
                    <p><strong>Administradora:</strong> {administradora}</p>
                    <p style={{ marginTop: 4 }}><strong>Fatura:</strong> {numeroFatura} &mdash; <strong>{boletos.length}</strong> boleto(s) encontrado(s)</p>
                  </div>
                </S.InfoBox>

                <S.PrimaryButton
                  onClick={emitirSelecionados}
                  disabled={emitindo || selectedCount === 0}
                  title={selectedCount === 0 ? 'Selecione ao menos um boleto' : `Emitir ${selectedCount} boleto(s)`}
                >
                  {emitindo ? <FaSpinner className="spinner" /> : <FaFileInvoiceDollar />}
                  {emitindo
                    ? 'Emitindo...'
                    : selectedCount > 0
                      ? `Emitir ${selectedCount} boleto${selectedCount !== 1 ? 's' : ''}`
                      : 'Emitir Segunda Via'}
                </S.PrimaryButton>
              </div>

              {/* Filter + select-all in one toolbar row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <S.SearchBarWrapper style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
                  <FaSearch />
                  <S.SearchInput
                    type="text"
                    placeholder="Filtrar por condomínio, fatura ou nosso número..."
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                  />
                  {filtro && (
                    <FaTimesCircle
                      style={{ cursor: 'pointer', opacity: 0.5 }}
                      onClick={() => setFiltro('')}
                      title="Limpar filtro"
                    />
                  )}
                </S.SearchBarWrapper>

                <S.SecondaryButton onClick={toggleAll} style={{ whiteSpace: 'nowrap' }}>
                  {allFilteredSelected ? 'Desmarcar Todos' : 'Marcar Todos'}
                </S.SecondaryButton>
              </div>

              {filteredBoletos.length === 0 ? (
                <S.EmptyState>
                  <FaSearch />
                  <h3>Nenhum boleto encontrado</h3>
                  <p>Tente alterar o termo da busca.</p>
                </S.EmptyState>
              ) : (
                <>
                  <S.TableWrapper>
                    <S.Table>
                      <thead>
                        <tr>
                          <th style={{ width: 50, textAlign: 'center' }}>
                            <S.CheckboxLabel title={allFilteredSelected ? 'Desmarcar todos' : 'Marcar todos'}>
                              <S.CheckboxInput
                                type="checkbox"
                                checked={allFilteredSelected}
                                ref={el => {
                                  if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                                }}
                                onChange={toggleAll}
                              />
                            </S.CheckboxLabel>
                          </th>
                          <th>Condomínio</th>
                          <th>Valor</th>
                          <th>Vencimento</th>
                          <th>Nosso Número</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBoletos.map(boleto => (
                          <tr
                            key={boleto.id}
                            onClick={() => toggleSelect(boleto.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                              <S.CheckboxLabel>
                                <S.CheckboxInput
                                  type="checkbox"
                                  checked={selectedIds.has(boleto.id)}
                                  onChange={() => toggleSelect(boleto.id)}
                                />
                              </S.CheckboxLabel>
                            </td>
                            <td><strong>{boleto.condominio}</strong></td>
                            <td><S.Valor>{formatValor(boleto.valor)}</S.Valor></td>
                            <td>{formatData(boleto.vencimento)}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{boleto.nossoNumero}</td>
                          </tr>
                        ))}
                      </tbody>
                    </S.Table>
                  </S.TableWrapper>

                  {/* Subtle count footer — no redundant button */}
                  {selectedCount > 0 && (
                    <S.SelectedInfo style={{ marginTop: '0.75rem', display: 'block', textAlign: 'right' }}>
                      <strong>{selectedCount}</strong> boleto{selectedCount !== 1 ? 's' : ''} selecionado{selectedCount !== 1 ? 's' : ''}
                    </S.SelectedInfo>
                  )}
                </>
              )}
            </>
          )}
        </S.ListCard>
      </S.ListContainer>
    </PageLayout>
  );
};

export default SegundaVia;