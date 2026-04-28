// AutomacaoPage.jsx

import { useState } from "react";
import "./BBZAutomacao.css";
import { useAuth } from "../../../context/AuthContext";
import PageLayout from "../../Layouts/PageLayout/PageLayout";
import { TbAutomation, TbUpload, TbRefresh, TbCheck } from "react-icons/tb";
import { FaFilePdf } from "react-icons/fa6";

import { AutomacaoService } from "../../../services/automacaoService";
import { useSnackbar } from "notistack";

const BBZAutomacao = () => {
    const { user } = useAuth();
    const nivelAcesso = user?.nivel_acesso || 0;
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        const pdfFiles = files.filter(file => file.type === 'application/pdf');
        
        if (pdfFiles.length !== files.length) {
            enqueueSnackbar("Apenas arquivos PDF são permitidos", { variant: "error" });
        }
        
        setSelectedFiles(pdfFiles);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            enqueueSnackbar("Selecione pelo menos um arquivo PDF", { variant: "warning" });
            return;
        }

        setIsUploading(true);

        try {
            const uploadResult = await AutomacaoService.upload_pdfs_bbz(selectedFiles);
            
            if (!uploadResult.sucesso) {
                enqueueSnackbar(uploadResult.erro || "Erro no upload", { variant: "error" });
                return;
            }
            
            const qtdArquivos = uploadResult.resultado?.arquivos_salvos?.length || 0;
            enqueueSnackbar(`✅ Upload concluído: ${qtdArquivos} arquivo(s) salvo(s) na pasta`, { 
                variant: "success",
                autoHideDuration: 4000
            });
            
            // Limpar seleção após upload bem sucedido
            setSelectedFiles([]);
            document.getElementById('file-input').value = '';
            
        } catch (error) {
            console.error("Erro no upload:", error);
            enqueueSnackbar("Erro ao fazer upload dos arquivos", { variant: "error" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleProcessar = async () => {
        setIsProcessing(true);
        
        try {
            const processResult = await AutomacaoService.processar_pdfs_bbz(true);
            
            if (processResult.sucesso) {
                enqueueSnackbar(`🔄 Processamento concluído!`, { variant: "success" });
                
                if (processResult.resultado) {
                    const { pdfs_movidos, backups_criados, pdfs_sem_correspondencia } = processResult.resultado;
                    
                    // Mostrar resumo detalhado
                    enqueueSnackbar(
                        <div className="result-summary">
                            <strong>📊 Resumo do processamento:</strong>
                            <p>✅ Movidos: {pdfs_movidos || 0} arquivo(s)</p>
                            <p>📦 Backups criados: {backups_criados || 0}</p>
                            <p>❌ Sem correspondência: {pdfs_sem_correspondencia || 0}</p>
                        </div>,
                        { variant: "info", autoHideDuration: 8000 }
                    );
                }
            } else {
                enqueueSnackbar(processResult.erro || "Erro no processamento", { variant: "error" });
            }
        } catch (error) {
            console.error("Erro no processamento:", error);
            enqueueSnackbar("Erro ao processar os arquivos", { variant: "error" });
        } finally {
            setIsProcessing(false);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <PageLayout
            title="Automação da BBZ"
            subtitle="Gerencie e monitore suas automações de forma eficiente"
            icon={<TbAutomation />}
            className="automacao-page"
        >
            <div className="automacao-content">
                {/* Seção de Upload */}
                <div className="upload-section">
                    <h2>
                        <TbUpload size={20} />
                        Upload de PDFs
                    </h2>
                    <p>Faça upload dos arquivos PDF para a pasta de origem no servidor</p>
                    
                    <div className="file-input-area">
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={handleFileSelect}
                            disabled={isUploading}
                        />
                        <label htmlFor="file-input" className="file-label">
                            <FaFilePdf size={18} />
                            Selecionar arquivos PDF
                        </label>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                        <div className="files-list">
                            <h3>Arquivos selecionados ({selectedFiles.length})</h3>
                            <ul>
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>
                                        <span>{file.name}</span>
                                        <button onClick={() => removeFile(index)} disabled={isUploading}>
                                            ❌
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="button-group">
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? "Enviando..." : "📤 Enviar para o servidor"}
                                </button>
                                <button 
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setSelectedFiles([]);
                                        document.getElementById('file-input').value = '';
                                    }}
                                    disabled={isUploading}
                                >
                                    Limpar tudo
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {isUploading && (
                        <div className="progress-indicator">
                            <div className="spinner"></div>
                            <p>Enviando arquivos para o servidor...</p>
                        </div>
                    )}
                </div>

                {/* Seção de Processamento */}
                <div className="process-section">
                    <h2>
                        <TbRefresh size={20} />
                        Processar PDFs
                    </h2>
                    <p>Processa os PDFs que estão na pasta de origem, movendo-os para as pastas corretas dos condomínios</p>
                    
                    <div className="button-group">
                        <button 
                            className="btn btn-success"
                            onClick={handleProcessar}
                            disabled={isProcessing}
                        >
                            {isProcessing ? "Processando..." : "🔄 Processar PDFs agora"}
                        </button>
                    </div>
                    
                    {isProcessing && (
                        <div className="progress-indicator">
                            <div className="spinner"></div>
                            <p>Processando arquivos e movendo para as pastas corretas...</p>
                        </div>
                    )}
                    
                    <div className="stats-badge">
                        <TbCheck size={14} />
                        <span>Os arquivos serão organizados automaticamente por <strong>ano/mês</strong> dentro da pasta de cada condomínio</span>
                    </div>
                </div>
                
                {/* Seção de Informações */}
                {/* <div className="info-section">
                    <h3>📌 Como funciona o fluxo completo</h3>
                    <ul>
                        <li><strong>1. Upload:</strong> Selecione os PDFs e clique em "Enviar para o servidor" - os arquivos vão para a pasta de origem</li>
                        <li><strong>2. Processamento:</strong> Clique em "Processar PDFs agora" - o sistema identifica cada condomínio pelo nome do arquivo</li>
                        <li><strong>3. Organização:</strong> Os PDFs são movidos para a pasta correta (ano/mês do condomínio)</li>
                        <li><strong>4. Backup:</strong> Arquivos existentes são automaticamente movidos para pasta "old" como backup</li>
                        <li><strong>💡 Dica:</strong> Você pode fazer upload de vários arquivos de uma vez e depois processar tudo junto</li>
                    </ul>
                </div> */}
            </div>
        </PageLayout>
    );
};

export default BBZAutomacao;