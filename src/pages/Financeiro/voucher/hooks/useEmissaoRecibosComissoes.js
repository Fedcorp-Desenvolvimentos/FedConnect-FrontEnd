// // src/pages/Financeiro/voucher/hooks/useEmissaoRecibosComissoes.js

// import { useEffect, useMemo, useState } from "react";
// import { useSnackbar } from "notistack";
// import { useLoading } from "../../../../hooks/useLoading";
// import {
//   buscarComissoesPorDataCorte,
//   buscarPessoas,
//   buscarFaturamento,
//   emitirDocumento as emitirDocumentoApi,
// } from "../../../../services/comissoesService";

// // Opções de retenção
// const retentionOptions = [
//   { id: "iss", label: "ISS", rate: 0.02 },
//   { id: "ir", label: "IR", rate: 0.015 },
//   { id: "cofins", label: "COFINS", rate: 0.03 },
//   { id: "csll", label: "CSLL", rate: 0.01 },
//   { id: "pis", label: "PIS", rate: 0.0065 },
//   { id: "inss", label: "INSS", rate: 0.11 },
// ];

// export const initialRecibosFilters = {
//   favorecido: "",
//   fatura: "",
//   vencimentoInicial: "",
//   vencimentoFinal: "",
//   status: "pendentes",
//   tipo: "",
//   coEstipulante: "",
//   apolice: "",
//   recibo: "",
//   vigenciaInicial: "",
//   vigenciaFinal: "",
//   limit: 100,
//   offset: 0,
// };

// // 🔥 Gera chave única para comissão
// const getComissaoKey = (comissao) => {
//   const fatura = comissao.FATURA || comissao.fatura || comissao.DOCUMENTO || "";
//   const parcela = comissao.PARCELA || comissao.parcela || "1";
//   return `${fatura}|${parcela}`;
// };

// // Data do mês atual
// const getCurrentMonthDate = () => {
//   const now = new Date();
//   return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
// };

// export function useEmissaoRecibosComissoes() {
//   const { enqueueSnackbar } = useSnackbar();
//   const { withLoading, loading } = useLoading();

//   const [filters, setFilters] = useState(initialRecibosFilters);
//   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

//   // 🔥 Dados principais
//   const [faturas, setFaturas] = useState([]);
//   const [comissoes, setComissoes] = useState([]);
//   const [pessoas, setPessoas] = useState([]);
//   const [pessoasLoading, setPessoasLoading] = useState(true);
//   const [totalRegistros, setTotalRegistros] = useState(0);
//   const [hasMore, setHasMore] = useState(false);

//   // 🔥 Seleções
//   const [selectedInvoices, setSelectedInvoices] = useState([]);
//   const [selectedCommissions, setSelectedCommissions] = useState([]);
//   const [selectedRetentions, setSelectedRetentions] = useState([]);

//   // 🔥 Emissão
//   const [documentType, setDocumentType] = useState("recibo");
//   const [printPaidValue, setPrintPaidValue] = useState(false);
//   const [lastEmission, setLastEmission] = useState(null);
//   const [isIssuing, setIsIssuing] = useState(false);
//   const [isSearching, setIsSearching] = useState(false);

//   const dataCorte = useMemo(() => getCurrentMonthDate(), []);

//   // 🔥 Carregar pessoas
//   useEffect(() => {
//     setPessoasLoading(true);
//     buscarPessoas({ status: "A", limit: 7000 })
//       .then((response) => {
//         let lista = [];
//         if (response?.data) {
//           if (Array.isArray(response.data)) {
//             lista = response.data;
//           } else if (response.data.data && Array.isArray(response.data.data)) {
//             lista = response.data.data;
//           }
//         }
//         setPessoas(lista);
//       })
//       .catch(() => setPessoas([]))
//       .finally(() => setPessoasLoading(false));
//   }, []);

//   // 🔥 Buscar faturas e comissões
//   async function searchInvoices() {
//     setIsSearching(true);

//     try {
//       // Prepara filtros
//       const filtrosLimpos = {};
//       Object.keys(filters).forEach((key) => {
//         const val = filters[key];
//         if (val !== "" && val !== null && val !== undefined) {
//           // Mapeia nomes dos campos
//           const mapping = {
//             favorecido: "favorecido",
//             fatura: "fatura",
//             vencimentoInicial: "vencimento_inicial",
//             vencimentoFinal: "vencimento_final",
//             status: "status",
//             tipo: "tipo",
//             coEstipulante: "co_estipulante",
//             apolice: "apolice",
//             recibo: "recibo",
//             vigenciaInicial: "vigencia_inicial",
//             vigenciaFinal: "vigencia_final",
//           };
//           const backKey = mapping[key] || key;
//           if (backKey) {
//             filtrosLimpos[backKey] = val;
//           }
//         }
//       });

//       // Remove status 'todas'
//       if (filtrosLimpos.status === "todas") {
//         delete filtrosLimpos.status;
//       }

//       // 🔥 Busca comissões
//       const result = await withLoading(async () => {
//         const response = await buscarComissoesPorDataCorte(dataCorte, filtrosLimpos);
//         return response;
//       }, "Buscando comissões...");

//       if (result?.sucesso) {
//         const dados = result.dados;
//         const lista = dados?.data || [];
//         const total = dados?.total_registros || lista.length;

//         // 🔥 Processa os dados para exibição
//         const comissoesProcessadas = lista.map((item) => ({
//           id: getComissaoKey(item),
//           fatura: item.FATURA || item.fatura || item.DOCUMENTO || "",
//           parcela: item.PARCELA || item.parcela || "1",
//           favorecido: item.FAVOR || item.favor || "",
//           nomeFavorecido: item.NOME || item.nome || "",
//           documentoFavorecido: item.DOC_FAVORECIDO || item.doc_favorecido || "",
//           valor: Number(item.VALOR || item.valor || item.VALOR_COMISSAO || item.valor_comissao || 0),
//           percentual: Number(item.COMISSAO || item.comissao || 0),
//           imposto: Number(item.IMPOSTO || item.imposto || 0),
//           voucher: item.VOUCHER || item.voucher || null,
//           dataRepasse: item.DT_REPASSE || item.dt_repasse || null,
//           produto: item.PRODUTO || item.produto || "",
//           coEstipulante: item.CO_ESTIP || item.co_estip || "",
//           bancoAgenciaConta: item.BC_AG_CC || item.bc_ag_cc || "",
//           chavePix: item.CHAVE_PIX || item.chave_pix || null,
//           vencimento: item.VENCIMENTO || item.vencimento || null,
//           dataFat: item.DATA_FAT || item.data_fat || null,
//           tipoFatura: item.TIPO_FAT || item.tipo_fat || "",
//           premioBruto: Number(item.PREMIO_BRUTO || item.premio_bruto || 0),
//           premioLiquido: Number(item.PREMIO_LIQ || item.premio_liq || 0),
//           quitado: Number(item.QUITADO || item.quitado || 0),
//           status: item.STATUS || item.status || "",
//           tipo: item.TIPO || item.tipo || "",
//           vigencia: item.DT_INI_VIG || item.dt_ini_vig || null,
//         }));

//         // 🔥 Agrupa por fatura para criar a lista de faturas
//         const faturasMap = new Map();
//         comissoesProcessadas.forEach((comissao) => {
//           const faturaId = comissao.fatura;
//           if (!faturasMap.has(faturaId)) {
//             faturasMap.set(faturaId, {
//               id: faturaId,
//               numero: faturaId,
//               tipo: comissao.tipoFatura,
//               favorecido: comissao.nomeFavorecido,
//               vencimento: comissao.vencimento,
//               vigencia: comissao.vigencia,
//               parcela: comissao.parcela,
//               valorLiquido: comissao.premioLiquido || comissao.valor,
//               status: comissao.voucher ? "baixada" : "pendente",
//               coEstipulante: comissao.coEstipulante,
//               apolice: comissao.apolice || "",
//               recibo: comissao.voucher || "",
//               temComissao: true,
//               comissoes: [],
//             });
//           }
//           faturasMap.get(faturaId).comissoes.push(comissao);
//         });

//         const faturasLista = Array.from(faturasMap.values());

//         setFaturas(faturasLista);
//         setComissoes(comissoesProcessadas);
//         setTotalRegistros(total);
//         setHasMore(lista.length === filters.limit && lista.length < total);

//         // Reset seleções
//         setSelectedInvoices([]);
//         setSelectedCommissions([]);
//         setSelectedRetentions([]);
//         setLastEmission(null);

//         if (faturasLista.length === 0) {
//           enqueueSnackbar("Nenhuma comissão encontrada", { variant: "info" });
//         } else {
//           enqueueSnackbar(
//             `${faturasLista.length} fatura(s) e ${comissoesProcessadas.length} comissão(ões) encontrada(s)`,
//             { variant: "success" }
//           );
//         }
//       }
//     } catch (error) {
//       enqueueSnackbar("Erro ao buscar comissões", { variant: "error" });
//       console.error("Erro na busca:", error);
//     } finally {
//       setIsSearching(false);
//     }
//   }

//   // 🔥 Toggle fatura
//   function toggleInvoice(invoiceId) {
//     setSelectedInvoices((current) => {
//       if (current.includes(invoiceId)) {
//         return current.filter((id) => id !== invoiceId);
//       }
//       return [...current, invoiceId];
//     });
//   }

//   // 🔥 Toggle todas faturas
//   function toggleAllInvoices() {
//     const allInvoicesSelected =
//       faturas.length > 0 && selectedInvoices.length === faturas.length;

//     if (allInvoicesSelected) {
//       setSelectedInvoices([]);
//       // Remove comissões das faturas desmarcadas
//       setSelectedCommissions([]);
//     } else {
//       const allIds = faturas.map((f) => f.id);
//       setSelectedInvoices(allIds);
//       // Seleciona todas as comissões
//       const allCommissionIds = comissoes.map((c) => c.id);
//       setSelectedCommissions(allCommissionIds);
//     }
//   }

//   // 🔥 Toggle comissão
//   function toggleCommission(comissaoId) {
//     setSelectedCommissions((current) => {
//       if (current.includes(comissaoId)) {
//         return current.filter((id) => id !== comissaoId);
//       }
//       return [...current, comissaoId];
//     });
//   }

//   // 🔥 Toggle todas comissões
//   function toggleAllCommissions() {
//     const allCommissionsSelected =
//       comissoes.length > 0 && selectedCommissions.length === comissoes.length;

//     if (allCommissionsSelected) {
//       setSelectedCommissions([]);
//       setSelectedInvoices([]);
//     } else {
//       const allIds = comissoes.map((c) => c.id);
//       setSelectedCommissions(allIds);
//       const allInvoiceIds = faturas.map((f) => f.id);
//       setSelectedInvoices(allInvoiceIds);
//     }
//   }

//   // 🔥 Toggle retenção
//   function toggleRetention(retentionId) {
//     setSelectedRetentions((current) => {
//       if (current.includes(retentionId)) {
//         return current.filter((id) => id !== retentionId);
//       }
//       return [...current, retentionId];
//     });
//   }

//   // 🔥 Atualizar filtro
//   function updateFilter(field, value) {
//     setFilters((current) => ({ ...current, [field]: value }));
//   }

//   // 🔥 Limpar tudo
//   function clearAll() {
//     setFilters(initialRecibosFilters);
//     setFaturas([]);
//     setComissoes([]);
//     setSelectedInvoices([]);
//     setSelectedCommissions([]);
//     setSelectedRetentions([]);
//     setLastEmission(null);
//     setTotalRegistros(0);
//     setHasMore(false);
//     enqueueSnackbar("Filtros limpos", { variant: "info" });
//   }

//   // 🔥 Calcular retenções
//   const retentionSummary = useMemo(() => {
//     const selectedComissoes = comissoes.filter((c) =>
//       selectedCommissions.includes(c.id)
//     );

//     const grossTotal = selectedComissoes.reduce(
//       (sum, c) => sum + Number(c.valor || 0),
//       0
//     );

//     const retentionRows = retentionOptions
//       .filter((option) => selectedRetentions.includes(option.id))
//       .map((option) => ({
//         ...option,
//         value: grossTotal * option.rate,
//       }));

//     const retentionTotal = retentionRows.reduce(
//       (total, item) => total + item.value,
//       0
//     );

//     return {
//       grossTotal,
//       retentionRows,
//       retentionTotal,
//       netTotal: grossTotal - retentionTotal,
//       count: selectedComissoes.length,
//     };
//   }, [comissoes, selectedCommissions, selectedRetentions]);

//   // 🔥 Summary para os cards
//   const summary = useMemo(
//     () => ({
//       invoices: faturas.length,
//       selectedInvoices: selectedInvoices.length,
//       commissions: comissoes.length,
//       selectedCommissions: selectedCommissions.length,
//       selectedTotal: `R$ ${retentionSummary.grossTotal.toFixed(2)}`,
//       netTotal: `R$ ${retentionSummary.netTotal.toFixed(2)}`,
//       status:
//         comissoes.length > 0
//           ? `${comissoes.length} comissões`
//           : "Aguardando consulta",
//     }),
//     [faturas, comissoes, selectedInvoices, selectedCommissions, retentionSummary]
//   );

//   // 🔥 Verificar seleções
//   const allInvoicesSelected =
//     faturas.length > 0 && selectedInvoices.length === faturas.length;

//   const allCommissionsSelected =
//     comissoes.length > 0 && selectedCommissions.length === comissoes.length;

//   // 🔥 Emitir documento
//   async function issueDocument() {
//     if (selectedCommissions.length === 0 && selectedInvoices.length === 0) {
//       enqueueSnackbar("Selecione pelo menos uma comissão ou fatura", {
//         variant: "warning",
//       });
//       return;
//     }

//     setIsIssuing(true);

//     try {
//       const comissoesSelecionadas = comissoes.filter((c) =>
//         selectedCommissions.includes(c.id)
//       );

//       const valorTotal = comissoesSelecionadas.reduce(
//         (sum, c) => sum + Number(c.valor || 0),
//         0
//       );

//       const payload = {
//         tipoDocumento: documentType,
//         dataCorte,
//         dataEmissao: new Date().toISOString(),
//         totalComissoes: comissoesSelecionadas.length,
//         totalFaturas: selectedInvoices.length,
//         valorTotalBruto: valorTotal,
//         valorLiquido: retentionSummary.netTotal,
//         retencoes: retentionSummary.retentionRows,
//         imprimirValorQuitado: printPaidValue,
//         comissoes: comissoesSelecionadas.map((c) => ({
//           fatura: c.fatura || "",
//           parcela: c.parcela || "1",
//           favorecido: c.favorecido || "",
//           favorecidoNome: c.nomeFavorecido || "",
//           favorecidoDocumento: c.documentoFavorecido || "",
//           valorComissao: Number(c.valor || 0),
//           percentual: Number(c.percentual || 0),
//           imposto: Number(c.imposto || 0),
//           voucher: c.voucher || null,
//           dataRepasse: c.dataRepasse || null,
//           produto: c.produto || "",
//           coEstipulante: c.coEstipulante || "",
//           bancoAgenciaConta: c.bancoAgenciaConta || "",
//           chavePix: c.chavePix || null,
//           vencimento: c.vencimento || null,
//           dataFat: c.dataFat || null,
//           tipoFatura: c.tipoFatura || "",
//           premioBruto: Number(c.premioBruto || 0),
//           premioLiquido: Number(c.premioLiquido || 0),
//           quitado: Number(c.quitado || 0),
//           status: c.status || "",
//         })),
//         faturas: faturas
//           .filter((f) => selectedInvoices.includes(f.id))
//           .map((f) => ({
//             fatura: f.numero || "",
//             apolice: f.apolice || "",
//             favorecido: f.favorecido || "",
//             vencimento: f.vencimento || "",
//             valorLiquido: Number(f.valorLiquido || 0),
//             status: f.status || "",
//           })),
//       };

//       const response = await emitirDocumentoApi(payload);

//       if (response.sucesso) {
//         setLastEmission({
//           numero: response.data?.numero || `RC-${String(Date.now()).slice(-6)}`,
//           emitidoEm: response.data?.emitidoEm || new Date().toISOString(),
//           tipo: documentType,
//           total: valorTotal,
//           quantidade: comissoesSelecionadas.length,
//         });

//         enqueueSnackbar(
//           `✅ ${documentType === "voucher" ? "Voucher" : "Recibo"} emitido! ${
//             comissoesSelecionadas.length
//           } comissões, R$ ${valorTotal.toFixed(2)}`,
//           { variant: "success" }
//         );

//         // Limpa seleções após emissão
//         setSelectedCommissions([]);
//         setSelectedInvoices([]);
//         setSelectedRetentions([]);
//       } else {
//         throw new Error(response.erro || "Erro ao emitir documento");
//       }
//     } catch (error) {
//       enqueueSnackbar(error.message || "Erro ao emitir documento", {
//         variant: "error",
//       });
//     } finally {
//       setIsIssuing(false);
//     }
//   }

//   // 🔥 Pré-visualizar
//   function previewDocument() {
//     if (selectedCommissions.length === 0 && selectedInvoices.length === 0) {
//       enqueueSnackbar("Selecione pelo menos uma comissão ou fatura", {
//         variant: "warning",
//       });
//       return;
//     }

//     const comissoesSelecionadas = comissoes.filter((c) =>
//       selectedCommissions.includes(c.id)
//     );

//     const total = comissoesSelecionadas.reduce(
//       (sum, c) => sum + Number(c.valor || 0),
//       0
//     );

//     enqueueSnackbar(
//       `📄 Pré-visualização: ${comissoesSelecionadas.length} comissões, R$ ${total.toFixed(2)}`,
//       { variant: "info" }
//     );
//   }

//   return {
//     // Estados
//     comissoes,
//     documentType,
//     filters,
//     faturas,
//     isIssuing,
//     isSearching,
//     lastEmission,
//     pessoas,
//     pessoasLoading,
//     printPaidValue,
//     retentionSummary,
//     selectedInvoices,
//     selectedCommissions,
//     selectedRetentions,
//     showAdvancedFilters,
//     summary,
//     allInvoicesSelected,
//     allCommissionsSelected,
//     loading,
//     totalRegistros,
//     hasMore,

//     // Ações
//     clearAll,
//     issueDocument,
//     previewDocument,
//     searchInvoices,
//     setDocumentType,
//     setPrintPaidValue,
//     setShowAdvancedFilters,
//     toggleAllInvoices,
//     toggleAllCommissions,
//     toggleInvoice,
//     toggleCommission,
//     toggleRetention,
//     updateFilter,
//   };
// }