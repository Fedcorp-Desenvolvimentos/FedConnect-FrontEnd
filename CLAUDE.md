# FedConnect-FrontEnd-Prod

Frontend React 18 + Vite (JavaScript puro, sem TypeScript), em produção. Fala com o FedConnect-Back-End (Django) via axios. Rodar local: `npm run dev` (porta 3000). Sem runner de testes; ESLint configurado mas com dependências não instaladas (não conta como verificação).

## Spec-Driven Design (obrigatório)

Este projeto segue spec-driven design. Regras completas em [specs/README.md](specs/README.md); templates em `specs/_templates/`.

**Antes de implementar qualquer mudança, classifique-a:**

- **Exige spec** — tela/fluxo novo, mudança de contrato com o backend, fluxo financeiro (comissões/vouchers/boletos), autenticação/rotas privadas, estado compartilhado entre páginas. Fluxo: `requirements.md` → aprovação do usuário → `design.md` → aprovação → `tasks.md` → implementar tarefa a tarefa.
- **Não exige spec** — fix pontual, ajuste visual/CSS, texto, typo. Implemente direto.

Regras: nunca avançar de fase sem `Status: Aprovado` explícito; critérios EARS verificáveis na tela/payload; entendimento mudou → atualiza a spec antes do código. Contrato com o backend mudando → spec também em `FedConnect-Back-End/specs/`.

## Contexto crítico

- **Funções compartilhadas têm fonte única**: `getComissaoKey` é exportada dos hooks (`useComissoes.js`, `useConsultaComissao.js`) e importada pelos componentes. **Nunca criar cópia local** — cópias dessincronizadas já quebraram seleção e somatório (WORK_LOG 1.31).
- **Campos de API são case-sensitive** e os nomes mentem: nos dados enriquecidos, `CEDENTE_NOME`/`CEDENTE_CNPJ` carregam a **ADMINISTRADORA (cliente)**, não o cedente. `parcela` (exibição, PAR.parcela) ≠ `parcela_comissao` (chave de gravação, COM.parcela).
- **Sem fallback silencioso em dado de negócio**: nada de `|| '1'`/`|| 0` mascarando campo ausente — ausência aparece como vazio/`-` e vira bug visível (lição do WORK_LOG 1.33).
- `src/services/api.js` é a instância axios central (interceptors de auth) — todo service novo importa dela; nunca usar `axios` global nem URL absoluta hardcoded. URLs de ambiente são um problema conhecido (sem `import.meta.env` ainda — não piorar).
- Números exibidos ao usuário (totais, contagens) devem vir da **resposta do backend**, não da seleção local (`registros_atualizados`, `total_canceladas`).
- Histórico de decisões e correções: `../WORK_LOG.md` e `../PROJECT_CONTEXT.md` (raiz do workspace).
