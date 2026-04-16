// components/Faturamento/ModalBoleto.js
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { verificarVencimento } from "../../../utils/Faturamento/verificarVencimento";
import { formatarValor } from "../../../utils/Faturamento/formatarValor";
import { formatarData } from "../../../utils/Faturamento/formatarData";
import './styles/ModalBoleto.css';
import { renderStatusBadge } from './utils/constants';

export const ModalBoleto = ({ isOpen, onClose, boleto, parcela }) => {
    if (!boleto) return null;

    const vencBoleto = verificarVencimento(boleto.DATA_VENCIMENTO);
    
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="modal-overlay" />
                <Dialog.Content className="modal-content">
                    <Dialog.Close asChild>
                        <button className="modal-close" aria-label="Fechar">
                            <X size={20} />
                        </button>
                    </Dialog.Close>

                    <Dialog.Title className="modal-title">
                        Detalhes do Boleto
                    </Dialog.Title>

                    <div className="modal-body">
                        <div className="info-section">
                            <h3>Informações do Documento</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Documento:</label>
                                    <span>{boleto.DOCUMENTO || "N/A"}</span>
                                </div>
                                <div className="info-item">
                                    <label>Nosso Número:</label>
                                    <span>{boleto.NOSSO_NUMERO || "N/A"}</span>
                                </div>
                                {/* <div className="info-item">
                                    <label>ID NFS-E:</label>
                                    <span>{boleto.ID_NFS_E || "N/A"}</span>
                                </div>
                                <div className="info-item">
                                    <label>Nº NFSe:</label>
                                    <span>{boleto.NUMERO_NOTA || "N/A"}</span>
                                </div> */}
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Dados do Cliente</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Nome:</label>
                                    <span>{boleto.NOME_COBRADO || "N/A"}</span>
                                </div>
                                <div className="info-item">
                                    <label>CNPJ/CPF:</label>
                                    <span>{boleto.CNPJ_COBRADO || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>Informações Financeiras</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Valor:</label>
                                    <span className="valor-destaque">{formatarValor(boleto.VALOR)}</span>
                                </div>
                                <div className="info-item">
                                    <label>Linha Digitável:</label>
                                    <span>{boleto.LINHA_DIGITAVEL || "Não informado"}</span>
                                </div>
                                 <div className="info-item">
                                    <label>Código de Barras:</label>
                                    <span>{boleto.CODIGO_BARRAS || "Não informado"}</span>
                                </div>
                                <div className="info-item">
                                    <label>Parcela:</label>
                                    <span>{boleto.PARCELA_BOLETO ? boleto.PARCELA_BOLETO + "x" : "Não informado"}</span>
                                </div>
                                <div className="info-item">
                                    <label>Vencimento:</label>
                                    <span className={`vencimento-detalhe ${vencBoleto.status}`}>
                                        {formatarData(boleto.DATA_VENCIMENTO)}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <label>Data Baixa:</label>
                                    <span>{parcela?.DT_BAIXA ? formatarData(parcela.DT_BAIXA) : boleto.DT_CANCEL ? formatarData(boleto.DT_CANCEL) : "Não baixado"}</span>
                                </div>
                                <div className="info-item">
                                    <label>Status:</label>
                                    {renderStatusBadge([boleto], parcela ? [parcela] : [], boleto.STATUS_BOLETO)}
                                </div>
                                <div className="info-item">
                                    <label>Data de Emissão:</label>
                                    <span>{formatarData(boleto.DATA_EMISSAO) || "Não emitido"}</span>
                                </div>
                                <div className="info-item">
                                    <label>Data de Vencimento:</label>
                                    <span>{formatarData(boleto.DATA_VENCIMENTO) || "Não informado"}</span>
                                </div>
                                 <div className="info-item">
                                    <label>Data de Vencimento:</label>
                                    <span>{formatarData(boleto.DATA_VENCIMENTO) || "Não informado"}</span>
                                </div>
                            </div>
                        </div>

                        {boleto.LINK_BOLETO && (
                            <div className="info-section">
                                <h3>Ações</h3>
                                <a 
                                    href={boleto.LINK_BOLETO} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn-boleto"
                                >
                                    Visualizar Boleto
                                </a>
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};