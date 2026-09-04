export function parseNumberBR(value) {
  if (typeof value === "number") return value;
  if (value === null || value === undefined || value === "") return Number.NaN;

  const cleaned = String(value).trim().replace(/[^\d,.-]/g, "");
  if (!cleaned) return Number.NaN;

  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  let normalized = cleaned;

  if (hasComma && hasDot) {
    normalized =
      cleaned.lastIndexOf(",") > cleaned.lastIndexOf(".")
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
  } else if (hasComma) {
    normalized = cleaned.replace(",", ".");
  } else if (hasDot) {
    const parts = cleaned.split(".");
    const lastPart = parts[parts.length - 1];
    if (parts.length > 2 || lastPart.length === 3) {
      normalized = cleaned.replace(/\./g, "");
    }
  }

  return Number(normalized);
}

export function formatCurrencyBR(value, fallback = "R$ 0,00") {
  if (value === null || value === undefined || value === "") return fallback;

  const numberValue = parseNumberBR(value);
  if (Number.isNaN(numberValue)) return fallback;

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatPercentBR(value, fallback = "0%") {
  if (value === null || value === undefined || value === "") return fallback;

  const numberValue = parseNumberBR(value);
  if (Number.isNaN(numberValue)) return fallback;

  return `${numberValue.toFixed(2).replace(".", ",")}%`;
}

export function formatNumberBR(value, fallback = "0", options = {}) {
  if (value === null || value === undefined || value === "") return fallback;

  const numberValue = parseNumberBR(value);
  if (Number.isNaN(numberValue)) return fallback;

  return numberValue.toLocaleString("pt-BR", options);
}

export function formatDateBR(value, fallback = "", options = {}) {
  const { invalidFallback = fallback, timeZone } = options;
  if (!value) return fallback;

  if (typeof value === "string") {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return value;

    const dateMatch = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);

    if (dateMatch) {
      const [, year, month, day] = dateMatch;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return typeof invalidFallback === "function"
      ? invalidFallback(value)
      : invalidFallback;
  }

  return date.toLocaleDateString(
    "pt-BR",
    timeZone ? { timeZone } : undefined
  );
}

export function formatTimeHHMM(value, fallback = "--:--") {
  if (!value) return fallback;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return String(value).slice(0, 5) || fallback;
}

/**
 * Data de hoje em AAAA-MM-DD pelo fuso local.
 *
 * `new Date().toISOString()` devolve a data em UTC: às 21h de 31/08 em Brasília
 * ela já é 01/09, e o documento sairia com o mês errado.
 */
export function dataLocalISO(data = new Date()) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** Aplica a máscara 000.000.000-00 conforme o usuário digita. */
export function formatCPF(value) {
  const digitos = String(value ?? "").replace(/\D/g, "").slice(0, 11);
  return digitos
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

/** Valida os dígitos verificadores do CPF (mesma regra do backend). */
export function validarCPF(value) {
  const cpf = String(value ?? "").replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i += 1) {
      soma += Number(cpf[i]) * (tamanho + 1 - i);
    }
    let digito = (soma * 10) % 11;
    if (digito === 10) digito = 0;
    if (digito !== Number(cpf[tamanho])) return false;
  }
  return true;
}

/** Deixa apenas os dígitos (o backend grava CPF sem máscara). */
export function apenasDigitos(value) {
  return String(value ?? "").replace(/\D/g, "");
}

/** Aplica a máscara 00.000.000/0000-00 conforme o usuário digita. */
export function formatCNPJ(value) {
  const digitos = String(value ?? "").replace(/\D/g, "").slice(0, 14);
  return digitos
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4")
    .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5");
}

/** Valida os dígitos verificadores do CNPJ (mesma regra do backend). */
export function validarCNPJ(value) {
  const cnpj = String(value ?? "").replace(/\D/g, "");
  if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, ...pesos1];
  for (const [tamanho, pesos] of [[12, pesos1], [13, pesos2]]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i += 1) soma += Number(cnpj[i]) * pesos[i];
    let digito = 11 - (soma % 11);
    if (digito >= 10) digito = 0;
    if (digito !== Number(cnpj[tamanho])) return false;
  }
  return true;
}
