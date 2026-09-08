// Matriz única de autorização do frontend: quem pode ENTRAR em cada área.
//
// Usada pelo Sidebar (o que aparece no menu) e pelo AppRouter (guarda real via
// <PrivateRouter allowed={...}>). Antes a lista vivia só no menu, então qualquer
// nível autenticado abria qualquer tela digitando a URL.
//
// Atenção: isto é UX/defesa em profundidade. A autorização que vale é a do
// backend — hoje a maioria dos endpoints exige apenas autenticação.

export const NIVEIS_COMUNS = [
  "admin",
  "usuario",
  "comercial",
  "faturamento",
  "ti",
  "financeiro",
  "vistoria",
  "condomed"
];

export const ROUTE_ACCESS = {
  home: NIVEIS_COMUNS,
  consultas: NIVEIS_COMUNS,
  ferramentas: NIVEIS_COMUNS,
  agenda: NIVEIS_COMUNS,
  questionarios: NIVEIS_COMUNS,

  comercial: ["admin", "comercial", "financeiro"],
  faturamento: ["admin", "faturamento", "ti"],
  financeiro: ["admin", "ti", "financeiro"],
  analytics: ["admin", "ti"],
  cadastroPessoas: ["admin", "ti"],
  metricas: ["admin"],
  condomed: ["admin", "condomed"],

  // Níveis que PODEM ver Automação; o Sidebar ainda restringe por e-mail.
  automacao: ["admin", "faturamento", "ti", "usuario", "comercial", "financeiro"],

  // Telas administrativas e de teste sem entrada no menu.
  admin: ["admin"]
};
