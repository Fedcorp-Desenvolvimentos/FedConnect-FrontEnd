// Integração com o robô eSocial (RPA SOC), que roda na máquina do operador.
//
// O navegador não executa arquivos locais, então o card faz duas coisas:
// 1. se o painel do robô já está de pé (http://localhost:3000), abre-o;
// 2. se não está, chama o protocolo `fedrobo://esocial`, que o Windows resolve
//    para o `iniciar-robo.bat` (instalado uma vez por PC com
//    `instalar-atalho-fedconnect.bat`, na pasta do robô), e espera o painel subir.

export const URL_PAINEL_ROBO =
  import.meta.env.VITE_ROBO_ESOCIAL_URL || "http://localhost:3000/";

export const PROTOCOLO_ROBO = "fedrobo://esocial";

const ESPERA_ENTRE_TENTATIVAS_MS = 2000;
const TENTATIVAS_APOS_LANCAR = 15; // ~30 s: npm run web + navegador do Playwright

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * O painel responde? `no-cors` porque o painel não manda cabeçalhos CORS: a
 * resposta vem opaca, mas conexão recusada vira rejeição — é só isso que importa.
 * http://localhost é contexto seguro para o navegador, então não há bloqueio de
 * conteúdo misto mesmo com o FedConnect em https.
 */
export async function painelEstaDePe(url = URL_PAINEL_ROBO) {
  try {
    await fetch(url, { mode: "no-cors", cache: "no-store" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Abre o painel se estiver de pé; senão lança o robô pelo protocolo e aguarda.
 * `aoMudar(estado)` recebe: "verificando" | "iniciando" | "pronto" | "falhou".
 * Devolve o estado final. Quem chama decide como abrir o painel quando "pronto"
 * (o navegador pode bloquear window.open fora do clique).
 */
export async function abrirOuIniciarRobo({ aoMudar } = {}) {
  const avisar = (estado) => aoMudar && aoMudar(estado);

  avisar("verificando");
  if (await painelEstaDePe()) {
    avisar("pronto");
    return "pronto";
  }

  // Lança o .bat pelo protocolo registrado no Windows. Se o protocolo não
  // existe no PC, o navegador ignora em silêncio — a espera abaixo expira.
  window.location.assign(PROTOCOLO_ROBO);
  avisar("iniciando");

  for (let i = 0; i < TENTATIVAS_APOS_LANCAR; i += 1) {
    await dormir(ESPERA_ENTRE_TENTATIVAS_MS);
    if (await painelEstaDePe()) {
      avisar("pronto");
      return "pronto";
    }
  }

  avisar("falhou");
  return "falhou";
}
