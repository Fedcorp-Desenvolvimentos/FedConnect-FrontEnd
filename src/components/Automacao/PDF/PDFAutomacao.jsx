import { useState } from 'react';
import { Upload, Zap, CheckCircle, AlertCircle, Info } from 'lucide-react';
import './PDFAutomacao.css';
import { AutomacaoService } from '../../../services/automacaoService';
import PageTemplate from '../../PageTemplate/PageTemplate';
import { useGlobal } from '../../../context/GlobalContext';
import { useAuth } from '../../../context/AuthContext';
import { TbPdf, TbTrash } from 'react-icons/tb';

const PDFAutomacao = () => {
    const { user } = useAuth();
    const { loading } = useGlobal();

    const [separatorFile, setSeparatorFile] = useState(null);
    const [separatorNomeBase, setSeparatorNomeBase] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const admin = user?.nivel_acesso === "admin";

    if(!admin) {
        return (
        <PageTemplate
            title="Acesso Negado"
            subtitle="Você não tem permissão para acessar esta página"
            icon={<TbPdf />}
        >
            <div className="access-denied">
            <TbTrash size={48} />
            <p>Ops! Parece que você não tem acesso a esta funcionalidade.</p>
            <p>Se você acha que isso é um erro, entre em contato com o administrador do sistema.</p>
            </div>
        </PageTemplate>
        );
    }

    const resetFeedback = () => {
        setErrorMsg('');
        setSuccessMsg('');
    };

    const handleSeparatorFileChange = (e) => {
        setSeparatorFile(e.target.files[0] || null);
        resetFeedback();
    };

    const handleSeparatorNomeBaseChange = (e) => {
        setSeparatorNomeBase(e.target.value);
        resetFeedback();
    };

    const handleSepararSubmit = async () => {
        resetFeedback();

        console.log('Iniciando separação de PDF:', separatorFile, 'Nome base:', separatorNomeBase);
        
        if (!separatorFile) {
            setErrorMsg('Selecione um arquivo PDF para separar.');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const zipBlob = await AutomacaoService.separar_pdf(separatorFile, separatorNomeBase);

            console.log('PDF separado com sucesso, iniciando download');
            
            // Criar link para download
            const url = window.URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            const nomeDownload = separatorNomeBase || separatorFile.name.replace('.pdf', '');
            a.download = `${nomeDownload}_separado.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            console.log('Download iniciado');
            
            setSuccessMsg('PDF separado com sucesso! O download foi iniciado.');
            setSeparatorFile(null);
            setSeparatorNomeBase('');
            
            // Resetar o input file
            const fileInput = document.getElementById('separator-file-input');
            console.log('Resetando input file:', fileInput);
            
            if (fileInput) fileInput.value = '';
            
        } catch (error) {
            console.error('Erro ao separar PDF:', error);
            setErrorMsg(error.response?.data?.erro || 'Erro ao separar PDF');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageTemplate
            title="Automações de PDF's"
            subtitle="Automatize processos de PDFs forma eficiente"
            icon={<i className="bi bi-file-earmark-pdf-fill"></i>}
            loading={loading}
            emptyMessage="Nenhuma automação disponível para seu nível de acesso"
        >
        <div className="pdf-page">
            <div className="pdf-container">
                
                <div className="pdf-card pdf-card-main">
                    {/* Separador de PDFs */}
                    <div className="pdf-section pdf-section-border">
                        <div className="pdf-step-header">
                            <span className="pdf-step-number">1</span>
                            <h2 className="pdf-step-title">Separador de PDFs</h2>
                        </div>
                        
                        <div className="pdf-field-block">
                            <label className="pdf-step-title">Arquivo PDF para separar</label>
                            <div className={'pdf-upload ' + (separatorFile ? 'pdf-upload-filled' : 'pdf-upload-empty')}>
                                <input
                                    id="separator-file-input"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleSeparatorFileChange}
                                    className="pdf-upload-input"
                                />
                                <div className="pdf-upload-content">
                                    <Upload className={'pdf-upload-icon ' + (separatorFile ? 'filled' : 'empty')} />
                                    {separatorFile ? (
                                        <>
                                            <p className="pdf-upload-title">{separatorFile.name}</p>
                                            <p className="pdf-upload-subtitle">Arquivo selecionado com sucesso</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="pdf-upload-title">Clique para selecionar o PDF</p>
                                            <p className="pdf-upload-subtitle">O PDF será separado em um arquivo por página</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="pdf-field-block">
                            <label className="pdf-step-title">Nome base (opcional)</label>
                            <input
                                type="text"
                                className="pdf-input"
                                value={separatorNomeBase}
                                onChange={handleSeparatorNomeBaseChange}
                                placeholder="Ex: fatura_2025_01"
                            />
                            <div className="pdf-info-box">
                                <Info className="pdf-info-icon" />
                                <p className="pdf-info-text">
                                    Os arquivos serão nomeados como: <strong>{separatorNomeBase || 'nome_original'}_pagina_001.pdf</strong>
                                </p>
                            </div>
                        </div>
                        
                        {errorMsg && (
                            <div className="pdf-alert pdf-alert-error">
                                <AlertCircle className="pdf-alert-icon pdf-alert-icon-error" />
                                <p className="pdf-alert-text">{errorMsg}</p>
                            </div>
                        )}
                        
                        {successMsg && (
                            <div className="pdf-alert pdf-alert-success">
                                <CheckCircle className="pdf-alert-icon pdf-alert-icon-success" />
                                <p className="pdf-alert-text">{successMsg}</p>
                            </div>
                        )}
                        
                        <div className="pdf-actions">
                            <button
                                type="button"
                                onClick={handleSepararSubmit}
                                disabled={isLoading || !separatorFile}
                                className="pdf-btn pdf-btn-primary"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="pdf-spinner" />
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Zap className="pdf-btn-icon" />
                                        <span>Separar PDF</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pdf-tips-card">
                    <div className="pdf-tips-header">
                        <Info className="pdf-tips-icon" />
                        <h3 className="pdf-tips-title">Dicas de uso</h3>
                    </div>
                    <ul className="pdf-tips-list">
                        <li>
                            - O separador divide cada página do PDF em um arquivo individual.
                        </li>
                        <li>
                            - Os arquivos gerados serão compactados em um único arquivo ZIP.
                        </li>
                        <li>
                            - Use o "Nome base" para personalizar o prefixo dos arquivos gerados.
                        </li>
                        <li>
                            - PDFs com apenas uma página não podem ser separados.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </PageTemplate>
    );
};

export default PDFAutomacao;