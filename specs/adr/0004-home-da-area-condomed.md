# ADR-0004 — Home da área Condomed, e não a tela do CIPA direto no menu

> **Status:** decidido · **Dono:** Ingrid Aylana · **Data:** 2026-09-04
> **Pode ser adiada:** sim (o menu já abria a tela do CIPA; a troca é de navegação, não de contrato)
> **Contexto(s):** `FCF` · **Specs:** `specs/curso-cipa/`

## Contexto

O item de menu criado junto com a tela se chamava "Cursos CIPA" e ia direto para `/condomed/cursos-cipa`. Isso nomeia no menu uma **tela**, não a área: a Condomed é o setor de medicina e segurança do trabalho, e o curso CIPA é a primeira rotina dele a entrar no FedConnect — não a única prevista. Quando a segunda chegar, ou o menu ganha um segundo item solto, ou a primeira tela vira, sem querer, a casa de todas as outras.

O restante do sistema já resolveu isso: Financeiro, Faturamento, Consultas, Métricas e Ferramentas têm uma home de cartões sobre `CardGridLayout`, cada cartão declarando os níveis que o veem.

Havia também um problema de acesso: o nível `condomed` existe no backend (`users.Usuario.NIVEL_ACESSO_CHOICES`) e no `accessLevels.js`, mas nenhum formulário de usuário o oferecia — conceder o acesso exigia Django admin ou banco. As listas de nível estavam duplicadas em quatro arquivos do front, com conteúdos diferentes entre si.

## Decisão

O item de menu passa a ser **"Condomed"**, apontando para `/condomed`: uma home de área no mesmo padrão das outras, hoje com um cartão (Cursos CIPA), filtrada pelo nível de quem está logado. A tela do CIPA continua em `/condomed/cursos-cipa`, agora alcançada pelo cartão, e as duas rotas ficam sob a mesma guarda `allowed={['admin','condomed']}`.

Os níveis de acesso passam a ter **uma** fonte no front: `src/utils/accessLevels.js`, na mesma ordem dos choices do backend, exportando `ACCESS_LEVEL_OPTIONS` para os seletores. Os formulários de Cadastro e de Gerenciar Usuários consomem essa lista em vez de manterem as suas.

## Opções consideradas

| Opção | Custo de reverter | Observações |
|---|---|---|
| Manter "Cursos CIPA" no menu | baixo | Sem custo hoje, mas empurra o problema para a segunda rotina do setor |
| Submenu expansível na sidebar | médio | A sidebar não tem esse padrão; seria o primeiro caso, e o resto do sistema já usa home de cartões |
| Home de área com cartões (escolhida) | baixo | Igual a Financeiro e Faturamento; a segunda ferramenta é mais um objeto no array |
| Só acrescentar `condomed` nas listas de nível, sem unificar | baixo | Resolve o acesso e mantém quatro listas divergentes — a próxima adição erra de novo |

## Consequências

A home não faz requisição: é uma lista declarada em `opcoesCondomed`, com `niveis` por cartão, e `CardGridLayout` já trata o caso de nenhuma opção permitida. Uma ferramenta nova da Condomed é um objeto no array mais uma rota irmã sob a mesma guarda.

O item do menu fica destacado também nas rotas filhas (mesma regra que `/financeiro` e `/faturamento` já usavam), e o breadcrumb ganhou os rótulos de `/condomed` e `/condomed/cursos-cipa` para não exibir o slug cru.

Com `accessLevels.js` como fonte única, os dois formulários passaram a oferecer os dez níveis que o backend aceita — antes um tinha seis e o outro sete, e nenhum dos dois tinha `condomed`, `recepcionista` ou `vistoria`. `financeiro`, que faltava no `accessLevels.js`, foi acrescentado. Quem adicionar um nível no Django agora mexe em um lugar no front.

As duas listas duplicadas em `src/components/Dropdown/dropItens/` ficaram como estão: a pasta é código morto (nada fora dela a importa) e apagá-la é outra conversa.
