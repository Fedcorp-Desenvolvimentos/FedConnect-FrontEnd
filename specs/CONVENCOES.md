# Convenções de escrita das specs

Regras obrigatórias para qualquer pessoa (ou agente) que escreva ou altere um documento em `specs/`. Este repositório segue o padrão SDD do Grupo FedCorp (nota técnica "SDD e DDD — Novo padrão"); o texto canônico vive em `FedHub-Backend/specs/CONVENCOES.md` — este arquivo replica as regras com as particularidades deste frontend React. Divergência de REGRA entre os dois é bug de processo: alinhe com o canônico.

---

## 1. Legenda de origem — `[E]` `[D]` `[P]`

| Marca | Significado | Exige |
|---|---|---|
| `[E]` | **Evidência.** Está implementado e verificado no código, ou verificado na tela/Network contra o backend. | `arquivo:linha`, ou nota de verificação com data |
| `[D]` | **Decisão.** Alguém decidiu, e a decisão está registrada. | Referência a um `ADR-####` deste repositório |
| `[P]` | **Pendente.** Hipótese de trabalho. | Referência a uma `PA-###` |

**Regra dura:** enunciado sem marca é tratado como `[P]` na revisão. Regra `[P]` é hipótese, não acordo.

## 2. Esquema de identificadores

Mesmos formatos do canônico: `RF-<CTX>-###`, `RNF-<CTX>-###`, `INV-<CTX>-###`, `CT-<CTX>-###`, `T-<CTX>-#.#`, `ADR-####` (numeração global **deste repositório**), `PA-###` (registro global **deste repositório**).

**Namespaces são por repositório.** Para citar artefato de outro repo, use o caminho: `FedHub-Backend/specs/voucher-recebemos-de-empresa/`.

### 2.1 Contextos (`<CTX>`)

Fixos. Não crie novos sem alterar esta tabela.

| Sigla | Contexto |
|---|---|
| `VOU` | vouchers/recibos de comissão — `src/pages/Financeiro/comissoes` e `consulta` |
| `FIN` | demais telas do Financeiro (faturamento, boletos, segunda via) |
| `CST` | telas de consulta PF/PJ/CEP |
| `AUT` | autenticação, rotas privadas, níveis de acesso na interface |
| `CIP` | cursos CIPA da Condomed — `src/pages/Condomed/CursoCipa` |

### 2.2 Regras de identificador

1. IDs nunca são reciclados. 2. IDs nunca mudam de contexto. 3. Sequenciais dentro do contexto. 4. **Cada fato mora em um lugar só** — cite o ID; no código, funções compartilhadas têm fonte única exportada (nunca cópia local — lição do WORK_LOG 1.31).

## 3. Cabeçalho de rastreabilidade

```markdown
> **Rastreabilidade** — RF: RF-VOU-001..003 · ADR: ADR-#### · Questões: PA-###
> **Status:** rascunho · **Dono:** · **Atualizado:** AAAA-MM-DD
```

## 4. Status de documento

`esboço` → `rascunho` → `em revisão` → `aprovado` (único que vincula) → `descartado`. Vive no cabeçalho **e** em [STATUS.md](./STATUS.md) — divergindo, STATUS.md vence. Só se avança de fase com `aprovado` explícito do dono.

## 5. Matriz de rastreabilidade

Cada feature tem `matriz.csv`: **requisito fora da matriz não existe**. Separador `;`, multivalor `|`, sem escape (não use `;` dentro de campo). Colunas:

```
requisito;origem;design;invariantes;tarefas;testes;questoes
```

## 6. Invariantes

Afirmação sempre verdadeira, um por ID, com onde é garantido: **aplicação** (validação no hook/componente), **backend** (o frontend confia na defesa do servidor) ou **processo**. Critérios de aceitação em EARS dentro dos RF, verificáveis na tela ou no payload.

## 7. Seção de divergência

Todo `design.md` tem **"Divergência vs. produção"**, obrigatória mesmo vazia. Particularidades deste repo a declarar quando tocadas: campos de API **case-sensitive** com nomes enganosos (`CEDENTE_*` carrega a administradora); números exibidos devem vir da resposta do backend, não da seleção local.

## 8. Dados pessoais e segredos

Proibido em `specs/`: CPF/CNPJ/nome/contato de pessoa real; credencial, token ou chave (inclusive tokens de embed). Exemplos com dados fictícios evidentes.

## 9. Diagramas e formato

Mermaid em bloco de código, nunca imagem. Markdown UTF-8 sem BOM, LF, um `#` por arquivo, links relativos, pastas `kebab-case`. CSV: `;` e `|`.

## 10. Contrato de dois lados

Mudança no contrato com o backend (payload enviado, campos consumidos) exige spec também em `FedConnect-Back-End/specs/` ou `FedHub-Backend/specs/`, uma citando a outra pelo caminho.

## 11. A verificação roda a cada gravação

```
bash specs/verificar.sh
```

Sai com código 1 se houver violação. Gravou em `specs/`, rodou.
