import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useSnackbar } from "notistack";
import { useLoading } from "../../../hooks/useLoading";
import { 
  TbAutomation, 
  TbUpload, 
  TbRefresh, 
  TbCheck,
  TbTrash,
  TbInfoCircle,
  TbFile
} from "react-icons/tb";
import { FaSpinner } from "react-icons/fa";
import { AutomacaoService } from "../../../services/automacaoService";
import * as S from "./BBZAutomacaoStyles";
import { BBZAutomacaoHelp } from "./BBZAutomacaoHelp";
import PageLayout from "../../../components/PageLayout/PageLayout";

const BBZAutomacao = () => {
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const { withLoading } = useLoading();
    const nivelAcesso = user?.nivel_acesso || 0;
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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
            const uploadResult = await withLoading(
                () => AutomacaoService.upload_pdfs_bbz(selectedFiles),
                "Enviando arquivos..."
            );
            
            if (!uploadResult.sucesso) {
                enqueueSnackbar(uploadResult.erro || "Erro no upload", { variant: "error" });
                return;
            }
            
            const qtdArquivos = uploadResult.resultado?.arquivos_salvos?.length || 0;
            enqueueSnackbar(`Upload concluído: ${qtdArquivos} arquivo(s) salvo(s)`, { 
                variant: "success",
                autoHideDuration: 4000
            });
            
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
            const processResult = await withLoading(
                () => AutomacaoService.processar_pdfs_bbz(true),
                "Processando arquivos..."
            );
            
            if (processResult.sucesso) {
                enqueueSnackbar(`Processamento concluído!`, { variant: "success" });
                
                if (processResult.resultado) {
                    const { pdfs_movidos, backups_criados, pdfs_sem_correspondencia } = processResult.resultado;
                    
                    enqueueSnackbar(
                        <S.ResultSummary>
                            <strong>📊 Resumo do processamento:</strong>
                            <p>✅ Movidos: {pdfs_movidos || 0} arquivo(s)</p>
                            <p>📦 Backups criados: {backups_criados || 0}</p>
                            <p>❌ Sem correspondência: {pdfs_sem_correspondencia || 0}</p>
                        </S.ResultSummary>,
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

    const limparTodos = () => {
        setSelectedFiles([]);
        document.getElementById('file-input').value = '';
    };

    return (
        <PageLayout
            title="Automação da BBZ"
            subtitle="Gerencie e monitore suas automações de forma eficiente"
            icon={<TbAutomation />}
            helpContent={<BBZAutomacaoHelp />}
        >
            <S.Container>
                {/* Seção de Upload */}
                <S.Section>
                    <S.SectionTitle>
                        <TbUpload size={20} /> Upload de PDFs
                    </S.SectionTitle>
                    <S.SectionDescription>
                        Faça upload dos arquivos PDF para a pasta de origem no servidor
                    </S.SectionDescription>
                    
                    <S.FileInputArea>
                        <S.FileInput id="file-input" type="file" multiple accept=".pdf" onChange={handleFileSelect} disabled={isUploading} />
                        <S.FileLabel htmlFor="file-input" disabled={isUploading}>
                            <TbFile size={18} />
                            Selecionar arquivos PDF
                        </S.FileLabel>
                    </S.FileInputArea>
                    
                    {selectedFiles.length > 0 && (
                        <S.FilesList>
                            <S.FilesListTitle>Arquivos selecionados ({selectedFiles.length})</S.FilesListTitle>
                            <S.FilesListUl>
                                {selectedFiles.map((file, index) => (
                                    <S.FilesListLi key={index}>
                                        <span>{file.name}</span>
                                        <S.RemoveButton onClick={() => removeFile(index)} disabled={isUploading}>
                                            <TbTrash size={14} />
                                        </S.RemoveButton>
                                    </S.FilesListLi>
                                ))}
                            </S.FilesListUl>
                            
                            <S.ButtonGroup>
                                <S.PrimaryButton onClick={handleUpload} disabled={isUploading}>
                                    {isUploading ? <FaSpinner className="spinner" /> : <TbUpload />}
                                    {isUploading ? "Enviando..." : "Enviar para o servidor"}
                                </S.PrimaryButton>
                                <S.SecondaryButton onClick={limparTodos} disabled={isUploading}>
                                    <TbTrash /> Limpar tudo
                                </S.SecondaryButton>
                            </S.ButtonGroup>
                        </S.FilesList>
                    )}
                    
                    {isUploading && (
                        <S.ProgressIndicator>
                            <S.Spinner />
                            <p>Enviando arquivos para o servidor...</p>
                        </S.ProgressIndicator>
                    )}
                </S.Section>

                {/* Seção de Processamento */}
                <S.Section $highlight>
                    <S.SectionTitle>
                        <TbRefresh size={20} /> Processar PDFs
                    </S.SectionTitle>
                    <S.SectionDescription>
                        Processa os PDFs que estão na pasta de origem, movendo-os para as pastas corretas dos condomínios
                    </S.SectionDescription>
                    
                    <S.ButtonGroup>
                        <S.SuccessButton onClick={handleProcessar} disabled={isProcessing}>
                            {isProcessing ? <FaSpinner className="spinner" /> : <TbRefresh />}
                            {isProcessing ? "Processando..." : "Processar PDFs agora"}
                        </S.SuccessButton>
                    </S.ButtonGroup>
                    
                    {isProcessing && (
                        <S.ProgressIndicator>
                            <S.Spinner />
                            <p>Processando arquivos e movendo para as pastas corretas...</p>
                        </S.ProgressIndicator>
                    )}
                    
                    <S.InfoBadge>
                        <TbCheck size={14} />
                        <span>Os arquivos serão organizados automaticamente por <strong>ano/mês</strong> dentro da pasta de cada condomínio</span>
                    </S.InfoBadge>
                </S.Section>
            </S.Container>
        </PageLayout>
    );
};

export default BBZAutomacao;