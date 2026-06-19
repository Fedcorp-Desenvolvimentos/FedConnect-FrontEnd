// // AutomacaoPage.jsx

// import { useState } from "react";
// import "../../styles/ConsultasHome.css";
// import { useAuth } from "../../context/AuthContext";
// import PageLayout from "../PageLayout/PageLayout";
// import { TbAutomation } from "react-icons/tb";
// import { AutomacaoService } from "../../services/automacaoService";
// import { useSnackbar } from "notistack";

// const AutomacaoPage = () => {
//     const { user } = useAuth();
//     const nivelAcesso = user?.nivel_acesso || 0;
//     const [selectedFiles, setSelectedFiles] = useState([]);
//     const [isUploading, setIsUploading] = useState(false);
//     const { enqueueSnackbar } = useSnackbar();

//     console.log("Usuário autenticado:", user)
//     console.log("Nível de acesso:", nivelAcesso)

//     const handleFileSelect = (event) => {
//         const files = Array.from(event.target.files);
//         const pdfFiles = files.filter(file => file.type === 'application/pdf');
        
//         if (pdfFiles.length !== files.length) {
//         enqueueSnackbar("Apenas arquivos PDF são permitidos", { variant: "error" });
//         }
        
//         setSelectedFiles(pdfFiles);
//     };

//     const handleUpload = async () => {
//         if (selectedFiles.length === 0) {
//             enqueueSnackbar("Selecione pelo menos um arquivo PDF", { variant: "error" });
//             return;
//         }

//         setIsUploading(true);

//         try {
//             // 1. Primeiro faz upload (salva na pasta origem)
//             const uploadResult = await AutomacaoService.upload_pdfs_bbz(selectedFiles);
            
//             if (!uploadResult.sucesso) {
//             enqueueSnackbar(uploadResult.erro || "Erro no upload", { variant: "error" });
//             return;
//             }
            
//             enqueueSnackbar(`Upload concluído: ${uploadResult.resultado?.arquivos_salvos?.length || 0} arquivos`, { variant: "success" });
            
//             // 2. Depois processa (move para pastas corretas)
//             // const processResult = await AutomacaoService.processar_pdfs_bbz(true);
            
//             // if (processResult.sucesso) {
//             // enqueueSnackbar(`Processamento concluído!`, { variant: "success" });
            
//             // if (processResult.resultado) {
//             //     enqueueSnackbar(
//             //     <div>
//             //         <strong>Resultado:</strong>
//             //         <div>✅ Movidos: {processResult.resultado.pdfs_movidos || 0}</div>
//             //         <div>📦 Backups: {processResult.resultado.backups_criados || 0}</div>
//             //         <div>❌ Sem correspondência: {processResult.resultado.pdfs_sem_correspondencia || 0}</div>
//             //     </div>,
//             //     { variant: "info", autoHideDuration: 5000 }
//             //     );
//             // }
            
//             // setSelectedFiles([]);
//             // document.getElementById('file-input').value = '';
//             // } else {
//             // enqueueSnackbar(processResult.erro || "Erro no processamento", { variant: "error" });
//             // }
//         } catch (error) {
//             console.error("Erro:", error);
//             enqueueSnackbar("Erro ao processar arquivos", { variant: "error" });
//         } finally {
//             setIsUploading(false);
//         }
//     };

//     const handleProcessar = async () => {
//         try {
//             const processResult = await AutomacaoService.processar_pdfs_bbz(true);
            
//             if (processResult.sucesso) {
//             enqueueSnackbar(`Processamento concluído!`, { variant: "success" });
            
//             if (processResult.resultado) {
//                 enqueueSnackbar(
//                 <div>
//                     <strong>Resultado:</strong>
//                     <div>✅ Movidos: {processResult.resultado.pdfs_movidos || 0}</div>
//                     <div>📦 Backups: {processResult.resultado.backups_criados || 0}</div>
//                     <div>❌ Sem correspondência: {processResult.resultado.pdfs_sem_correspondencia || 0}</div>
//                 </div>,
//                 { variant: "info", autoHideDuration: 5000 }
//                 );
//             }
            
//             setSelectedFiles([]);
//             document.getElementById('file-input').value = '';
//             } else {
//             enqueueSnackbar(processResult.erro || "Erro no processamento", { variant: "error" });
//             }
//         } catch (error) {
//             console.error("Erro:", error);
//             enqueueSnackbar("Erro ao processar arquivos", { variant: "error" });
//         }
//     }

//     const removeFile = (index) => {
//         setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     };

//     return (
//         <PageLayout
//         title="Automação de processos"
//         subtitle="Gerencie e monitore suas automações de forma eficiente"
//         icon={<TbAutomation />}
//         className="automacao-page"
//         >
//         <div className="automacao-content">
//             <div className="upload-section">
//             <h2>Upload de PDFs BBZ</h2>
//             <p>Selecione múltiplos arquivos PDF para transferir automaticamente para as pastas correspondentes</p>
            
//             <div className="file-input-area">
//                 <input
//                 id="file-input"
//                 type="file"
//                 multiple
//                 accept=".pdf"
//                 onChange={handleFileSelect}
//                 disabled={isUploading}
//                 />
//                 <label htmlFor="file-input" className="file-label">
//                 📄 Selecionar PDFs
//                 </label>
//             </div>

//             <button onClick={handleProcessar}>Processar PDF's</button>
            
//             {selectedFiles.length > 0 && (
//                 <div className="files-list">
//                 <h3>Arquivos selecionados ({selectedFiles.length})</h3>
//                 <ul>
//                     {selectedFiles.map((file, index) => (
//                     <li key={index}>
//                         <span>{file.name}</span>
//                         <button onClick={() => removeFile(index)} disabled={isUploading}>
//                         ❌
//                         </button>
//                     </li>
//                     ))}
//                 </ul>
                
//                 <button 
//                     className="upload-button"
//                     onClick={handleUpload}
//                     disabled={isUploading}
//                 >
//                     {isUploading ? "Processando..." : "🚀 Enviar e Processar"}
//                 </button>
//                 </div>
//             )}
            
//             {isUploading && (
//                 <div className="progress-indicator">
//                 <div className="spinner"></div>
//                 <p>Processando arquivos... Isso pode levar alguns momentos</p>
//                 </div>
//             )}
//             </div>
            
//             <div className="info-section">
//             <h3>📌 Como funciona</h3>
//             <ul>
//                 <li>Selecione um ou mais arquivos PDF</li>
//                 <li>O sistema identifica automaticamente o condomínio pelo nome do arquivo</li>
//                 <li>Os PDFs são movidos para a pasta correta (ano/mês do condomínio)</li>
//                 <li>Arquivos existentes são automaticamente movidos para pasta "old" como backup</li>
//             </ul>
//             </div>
//         </div>
//         </PageLayout>
//     );
// };

// export default AutomacaoPage;