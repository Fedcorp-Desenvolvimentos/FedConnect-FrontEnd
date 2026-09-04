import * as XLSX from "xlsx";
import {
  apenasDigitos,
  formatCNPJ,
  formatCPF,
  validarCNPJ,
  validarCPF,
} from "../../../utils/formatters";
import { semAcento } from "./hooks/useCursoCipa";

/**
 * Leitura e validação da planilha de inscritos, no navegador.
 *
 * A validação acontece antes de enviar para o servidor porque a decisão é do
 * operador: ele vê linha por linha o que entra e o que não entra, corrige a
 * planilha e reenvia — em vez de descobrir o problema depois de gravar. As
 * mesmas regras valem no backend, que é a garantia; esta camada é a conversa.
 *
 * Os cabeçalhos são o contrato com `COLUNAS_MODELO` em `condomed/views.py`.
 */

export const COLUNAS = [
  "administradora",
  "condominio",
  "cnpj_condominio",
  "nome",
  "cpf",
  "funcao",
  "email",
  "telefone",
];

const OBRIGATORIAS = ["administradora", "condominio", "nome", "cpf", "funcao"];

/**
 * Cabeçalho e nome de administradora casam sem acento, sem caixa e sem
 * espaços. `semAcento` vem do hook — é a mesma regra que a busca da tela usa,
 * e cópia local dessincroniza (regra do CLAUDE.md).
 */
const normalizarChave = (valor) => semAcento(valor).trim().replace(/\s+/g, "");

const APELIDOS = {
  administradora: ["administradora", "adm", "administradoranome"],
  condominio: ["condominio", "condominionome", "cliente"],
  cnpj_condominio: ["cnpjcondominio", "cnpj", "cnpjdocondominio", "condominiocnpj"],
  nome: ["nome", "nomecompleto", "participante", "funcionario"],
  cpf: ["cpf", "documento"],
  funcao: ["funcao", "cargo"],
  email: ["email", "e-mail"],
  telefone: ["telefone", "celular", "fone"],
};

const texto = (valor) => String(valor ?? "").trim();

/** Mapa cabeçalho-da-planilha → campo, aceitando variações comuns. */
function mapearColunas(cabecalhos) {
  const mapa = {};
  cabecalhos.forEach((cabecalho, indice) => {
    const chave = normalizarChave(cabecalho);
    const campo = COLUNAS.find((nome) => APELIDOS[nome].includes(chave));
    if (campo && mapa[campo] === undefined) mapa[campo] = indice;
  });
  return mapa;
}

/**
 * Lê o arquivo e devolve o diagnóstico completo.
 *
 * @returns {Promise<{
 *   colunasFaltando: string[],
 *   linhas: Array<{ numero, dados, erros, valida }>,
 *   validas: object[],
 *   totalLinhas: number
 * }>}
 */
export async function lerPlanilhaInscritos(arquivo, { administradoras = [] } = {}) {
  const buffer = await arquivo.arrayBuffer();
  const planilha = XLSX.read(buffer, { type: "array" });
  const aba = planilha.Sheets[planilha.SheetNames[0]];

  // `header: 1` devolve matriz de linhas: precisamos do número da linha do
  // Excel para apontar o erro onde o operador vai corrigir.
  const matriz = XLSX.utils.sheet_to_json(aba, {
    header: 1,
    raw: false,
    defval: "",
    blankrows: false,
  });

  if (matriz.length === 0) {
    return { colunasFaltando: OBRIGATORIAS, linhas: [], validas: [], totalLinhas: 0 };
  }

  const mapa = mapearColunas(matriz[0]);
  const colunasFaltando = OBRIGATORIAS.filter((campo) => mapa[campo] === undefined);
  if (colunasFaltando.length) {
    return { colunasFaltando, linhas: [], validas: [], totalLinhas: 0 };
  }

  const porNome = new Map(
    administradoras.map((adm) => [normalizarChave(adm.nome), adm])
  );
  const cpfsVistos = new Map();
  const linhas = [];

  matriz.slice(1).forEach((celulas, indice) => {
    const numero = indice + 2; // +1 do cabeçalho, +1 porque o Excel conta de 1
    const bruto = {};
    COLUNAS.forEach((campo) => {
      bruto[campo] = mapa[campo] === undefined ? "" : texto(celulas[mapa[campo]]);
    });

    // Linha inteiramente vazia no meio da planilha é descarte, não erro.
    if (COLUNAS.every((campo) => !bruto[campo])) return;

    const erros = [];
    OBRIGATORIAS.forEach((campo) => {
      if (!bruto[campo]) erros.push(`${campo} em branco`);
    });

    const cpf = apenasDigitos(bruto.cpf);
    if (bruto.cpf && !validarCPF(cpf)) erros.push("CPF inválido");

    // CNPJ é opcional (o extra de última hora entra sem ele); quando vem, tem
    // de ser válido — o certificado vai imprimi-lo.
    const cnpj = apenasDigitos(bruto.cnpj_condominio);
    if (bruto.cnpj_condominio && !validarCNPJ(cnpj)) erros.push("CNPJ inválido");

    const jaVisto = cpf && cpfsVistos.get(cpf);
    if (jaVisto) erros.push(`CPF repetido (linha ${jaVisto})`);
    else if (cpf) cpfsVistos.set(cpf, numero);

    // A administradora precisa existir na base: o backend grava o código, e
    // nome livre viraria lixo impossível de agrupar depois.
    const administradora = bruto.administradora
      ? porNome.get(normalizarChave(bruto.administradora))
      : null;
    if (bruto.administradora && !administradora) {
      erros.push("administradora não encontrada na base");
    }

    linhas.push({
      numero,
      valida: erros.length === 0,
      erros,
      exibicao: {
        ...bruto,
        cpf: cpf ? formatCPF(cpf) : bruto.cpf,
        cnpj_condominio: cnpj ? formatCNPJ(cnpj) : bruto.cnpj_condominio,
      },
      dados:
        erros.length === 0
          ? {
              nome: bruto.nome,
              cpf,
              funcao: bruto.funcao,
              email: bruto.email,
              telefone: bruto.telefone,
              administradora_codigo: administradora.codigo,
              administradora_nome: administradora.nome,
              condominio_nome: bruto.condominio,
              condominio_cnpj: cnpj,
            }
          : null,
    });
  });

  return {
    colunasFaltando: [],
    linhas,
    validas: linhas.filter((linha) => linha.valida).map((linha) => linha.dados),
    totalLinhas: linhas.length,
  };
}

export default lerPlanilhaInscritos;
