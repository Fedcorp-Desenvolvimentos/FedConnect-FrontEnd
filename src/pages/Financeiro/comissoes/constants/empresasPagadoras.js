// Empresas do grupo que geram comissão, discriminadas por COMISSAO.TIPO.
// Alimenta o seletor "Empresa pagadora (Recebemos de)" da emissão de voucher.
// FONTE ÚNICA — o backend tem o mesmo mapa em voucher_controller.py
// (EMPRESAS_COMISSAO); mudou lá, muda aqui. Spec: specs/voucher-recebemos-de-empresa/

export const EMPRESAS_PAGADORAS = [
  {
    tipo: 'BENEFICIO',
    nome: 'FEDCORP ADMINISTRADORA DE BENEFICIOS LTDA',
    cnpj: '35.315.360/0001-67',
    label: 'Fedcorp Adm. de Benefícios',
  },
  {
    tipo: 'CONDOCORP',
    nome: 'CONDOCORP SERVICOS DE INTERMEDIACAO',
    cnpj: '22.708.714/0001-91',
    label: 'Condocorp',
  },
  {
    tipo: 'PEAGA',
    nome: 'PEAGA ADMINISTRACAO E CORRETAGEM DE SEGUROS LTDA',
    cnpj: '04.574.097/0001-05',
    label: 'Peaga',
  },
];

export const getEmpresaPorTipo = (tipo) =>
  EMPRESAS_PAGADORAS.find((e) => e.tipo === String(tipo ?? '').trim().toUpperCase()) || null;

// Infere a empresa pagadora a partir das comissões selecionadas:
// todas do mesmo TIPO → empresa correspondente; TIPOs mistos ou vazio → null
// (o usuário precisa escolher no seletor).
export const inferirEmpresaPorTipos = (comissoes) => {
  if (!comissoes || comissoes.length === 0) return null;
  const tipos = new Set(
    comissoes.map((c) => String(c.TIPO ?? c.tipo ?? 'BENEFICIO').trim().toUpperCase())
  );
  if (tipos.size !== 1) return null;
  return getEmpresaPorTipo([...tipos][0]);
};
