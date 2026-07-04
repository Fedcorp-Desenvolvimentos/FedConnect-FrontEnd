import React from 'react';
import { FaTimes, FaFileInvoice, FaChevronRight } from 'react-icons/fa';
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

const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('pt-BR');
  } catch {
    return '-';
  }
};

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
export const PreviewModalDetails = ({ open, data, onClose }) => {
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
              <span>Período de corte</span>
              <strong>{data.dataCorteFormatada}</strong>
            </div>
            <div>
              <span>Data de emissão</span>
              <strong>{formatDateTime(data.dataEmissao)}</strong>
            </div>
            <div>
              <span>Tipo de documento</span>
              <strong>{tituloDocumento}</strong>
            </div>
          </DocMetaGrid>

          <DocTable>
            <DocTableHead>
              <span>Favorecido / Fatura</span>
              <span>Produto</span>
              <span>Vencimento</span>
              <span style={{ textAlign: 'right' }}>Valor</span>
            </DocTableHead>

            {data.comissoes.map((c, index) => (
              <DocTableRow key={`${c.documento}-${c.favorecido}-${index}`}>
                <div className="primary-cell">
                  <strong>{c.favorecidoNome || c.favorecido || 'Favorecido'}</strong>
                  <span>
                    Fatura {c.fatura || '-'} · Parcela {c.parcela || '1'}
                  </span>
                </div>

                <div className="value-cell">
                  <span className="cell-label">Produto&nbsp;</span>
                  {c.produto || '-'}
                </div>

                <div className="value-cell">
                  <span className="cell-label">Vencimento&nbsp;</span>
                  {formatDate(c.vencimento)}
                </div>

                <div className="money-cell">{formatMoney(c.valorComissao)}</div>
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

          <RawDataToggle as="details">
            <summary>
              <FaChevronRight size={10} />
              Ver dados brutos recebidos da API (Resposta V2)
            </summary>
            <pre>{JSON.stringify(data.registrosBrutos, null, 2)}</pre>
          </RawDataToggle>
        </ModalBody>

        <ModalFooter>
          <Button className="ghost" onClick={onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </ModalCard>
    </ModalOverlay>
  );
};