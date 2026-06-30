// // src/pages/Financeiro/voucher/utils/recibosComissoesUtils.js

// import { formatCurrencyBR, formatDateBR } from "../../../../utils/formatters";

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
// };

// export function formatMoney(value, fallback = "R$ 0,00") {
//   return formatCurrencyBR(value, fallback);
// }

// export function formatDate(value) {
//   if (!value) return "-";
//   try {
//     return formatDateBR(value, "-");
//   } catch {
//     return "-";
//   }
// }

// export function getInvoiceStatusView(status) {
//   if (status === "baixada" || status === "B" || status === "baixado") {
//     return { label: "Baixada", className: "paid" };
//   }
//   if (status === "A" || status === "Ativa") {
//     return { label: "Ativa", className: "pending" };
//   }
//   if (status === "C" || status === "Cancelada") {
//     return { label: "Cancelada", className: "overdue" };
//   }
//   return { label: status || "Pendente", className: "pending" };
// }

// export function getSelectedCommissions(comissoes, selectedIds) {
//   return comissoes.filter((comissao) => selectedIds.includes(comissao.id));
// }

// export function sumCommissions(comissoes) {
//   return comissoes.reduce(
//     (total, comissao) => total + Number(comissao.valor || 0),
//     0
//   );
// }

// export function calculateRetentionSummary(
//   comissoes,
//   selectedIds,
//   selectedRetentions
// ) {
//   const retentionOptions = [
//     { id: "iss", label: "ISS", rate: 0.02 },
//     { id: "ir", label: "IR", rate: 0.015 },
//     { id: "cofins", label: "COFINS", rate: 0.03 },
//     { id: "csll", label: "CSLL", rate: 0.01 },
//     { id: "pis", label: "PIS", rate: 0.0065 },
//     { id: "inss", label: "INSS", rate: 0.11 },
//   ];

//   const selectedComissoes = getSelectedCommissions(comissoes, selectedIds);
//   const grossTotal = sumCommissions(selectedComissoes);
//   const retentionRows = retentionOptions
//     .filter((option) => selectedRetentions.includes(option.id))
//     .map((option) => ({
//       ...option,
//       value: grossTotal * option.rate,
//     }));
//   const retentionTotal = retentionRows.reduce(
//     (total, item) => total + item.value,
//     0
//   );

//   return {
//     grossTotal,
//     retentionRows,
//     retentionTotal,
//     netTotal: grossTotal - retentionTotal,
//     count: selectedComissoes.length,
//   };
// }