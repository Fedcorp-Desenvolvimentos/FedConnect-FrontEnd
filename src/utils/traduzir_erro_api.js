

export const traduzirErroApi = (mensagem) => {
    if (!mensagem) return "Erro inesperado. Por favor, tente novamente.";
    if (typeof mensagem === "string" && mensagem.startsWith("<!DOCTYPE")) {
        return "Erro temporário de conexão com o servidor. Tente novamente em instantes.";
    }
    const msg = (mensagem || "").toString().toLowerCase();
    if (msg.includes("proxy error")) return "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
    if (msg.includes("502") || msg.includes("bad gateway")) return "Não foi possível se conectar ao servidor. Tente novamente mais tarde.";
    if (msg.includes("timeout")) return "A requisição demorou muito. Verifique sua conexão e tente novamente.";
    if (msg.includes("network error")) return "Falha de comunicação com a API. Verifique sua conexão de internet.";
    return "Erro ao consultar faturas. Por favor, tente novamente.";
}