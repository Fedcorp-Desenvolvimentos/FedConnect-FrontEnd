import React from 'react';
import { formatDateBR } from '../../../../utils/formatters';
import { FaTimes, FaFileInvoice, FaChevronRight, FaPrint, FaSpinner } from 'react-icons/fa';
import {
  ModalOverlay,
  ModalCard,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DocMetaGrid,
  DocTable,
  DocTableHead,
  DocTableRow,
  DocSummary,
  RawDataToggle,
  Button,
} from '../ComissoesStyles';

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

// Fonte única em utils/formatters: `new Date('2026-08-01')` é meia-noite UTC
// e volta um dia ao renderizar em UTC-3 — datas do ERP vêm como YYYY-MM-DD.
const formatDate = (date) => formatDateBR(date, '-');

const formatDateTime = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleString('pt-BR');
  } catch {
    return '-';
  }
};

/**
 * Pré-visualização do documento (recibo ou voucher) montada a partir dos
 * dados já retornados pela API para as comissões selecionadas — o mesmo
 * payload que seria enviado na emissão real, exibido de forma legível
 * antes de confirmar.
 */
export const PreviewModalDetails = ({ open, data, onClose, onEmitir, loading }) => {
  if (!open || !data) return null;

  const tituloDocumento = data.tipoDocumento === 'voucher' ? 'Voucher' : 'Recibo';

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <div>
            <h2>
              <FaFileInvoice style={{ marginRight: 8 }} />
              Pré-visualização · {tituloDocumento}
            </h2>
            <p>Gerado a partir de {data.totalComissoes} comissão(ões) selecionada(s)</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <FaTimes />
          </button>
        </ModalHeader>

        <ModalBody>
          <DocMetaGrid>
            <div>
              <span>Data de emissão</span>
              <strong>{formatDateTime(data.dataEmissao)}</strong>
            </div>
            <div>
              <span>Tipo de documento</span>
              <strong>{tituloDocumento}</strong>
            </div>
            {data.tipoDocumento === 'voucher' && data.empresaPagadora && (
              <div>
                <span>Empresa pagadora (Recebemos de)</span>
                <strong>{data.empresaPagadora.nome} · {data.empresaPagadora.cnpj}</strong>
              </div>
            )}
            {data.comissoes.length > 0 && (data.comissoes[0].administradora || data.comissoes[0].cedente_nome) && (
              <div>
                <span>Administradora</span>
                <strong>{data.comissoes[0].administradora || data.comissoes[0].cedente_nome}</strong>
              </div>
            )}
            {data.comissoes.length > 0 && (data.comissoes[0].cedente_cnpj || data.comissoes[0].administradora_cnpj) && (
              <div>
                <span>CNPJ Administradora</span>
                <strong>{data.comissoes[0].cedente_cnpj || data.comissoes[0].administradora_cnpj}</strong>
              </div>
            )}
          </DocMetaGrid>

          <DocTable>
            <DocTableHead>
              <span>Favorecido / Fatura</span>
              <span>Produto</span>
              <span>Condomínio</span>
              <span>Administradora</span>
              <span style={{ textAlign: 'right' }}>Valor</span>
            </DocTableHead>

            {data.comissoes.map((c, index) => (
              <DocTableRow key={`${c.documento}-${c.favorecido}-${index}`}>
                <div className="primary-cell">
                  <strong>{c.favorecido_nome || c.favorecidoNome || c.favorecido || 'Favorecido'}</strong>
                  <span>
                    Fatura {c.fatura || '-'} · Parc. {c.parcela || '1'}
                  </span>
                </div>

                <div className="value-cell">
                  <span className="cell-label">Produto&nbsp;</span>
                  {c.produto || '-'}
                </div>

                <div className="value-cell">
                  <span className="cell-label">Condomínio&nbsp;</span>
                  {c.co_estipulante || '-'}
                </div>

                <div className="value-cell">
                  <span className="cell-label">Admin&nbsp;</span>
                  {c.cedente_nome || c.administradora || '-'}
                </div>

                <div className="money-cell">{formatMoney(c.valor_comissao)}</div>
              </DocTableRow>
            ))}
          </DocTable>

          <DocSummary>
            <div className="row">
              <span>Total bruto</span>
              <strong>{formatMoney(data.valorTotalBruto)}</strong>
            </div>

            {data.retencoesAplicadas.length === 0 && (
              <div className="row">
                <span>Retenções</span>
                <strong>Nenhuma retenção aplicada</strong>
              </div>
            )}

            {data.retencoesAplicadas.map((r) => (
              <div className="row deduction" key={r.tipo}>
                <span>
                  {r.tipo} ({r.aliquota})
                </span>
                <strong>- {formatMoney(r.valor)}</strong>
              </div>
            ))}

            <div className="row total">
              <span>Valor líquido</span>
              <strong>{formatMoney(data.valorLiquido)}</strong>
            </div>
          </DocSummary>
        </ModalBody>

        <ModalFooter>
          <Button className="ghost" onClick={onClose}>
            Fechar
          </Button>
          <Button className="primary" onClick={onEmitir} disabled={loading}>
            {loading ? <FaSpinner className="spin" /> : <FaPrint />}
            {loading ? 'Emitindo...' : `Emitir ${tituloDocumento}`}
          </Button>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};