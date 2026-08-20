# Specs — Spec-Driven Design do FedConnect-FrontEnd-Prod

Cada feature ou mudança relevante ganha uma pasta aqui com três documentos, produzidos e aprovados **nesta ordem**:

```
specs/
├── _templates/            # templates dos 3 documentos
└── nome-da-feature/
    ├── requirements.md    # 1º — o quê e por quê (user stories + critérios EARS)
    ├── design.md          # 2º — o como (telas, estado, contratos de API, decisões)
    └── tasks.md           # 3º — o plano (checklist de implementação rastreável)
```

## Fluxo

1. **Requirements** → escrever, revisar, marcar `Status: Aprovado`. Só então:
2. **Design** → escrever com base nos requisitos aprovados, revisar, aprovar. Só então:
3. **Tasks** → quebrar o design em tarefas pequenas e implementar uma a uma, marcando `[x]` com a verificação feita.

Mudou o entendimento no meio do caminho? **Atualize a spec primeiro**, depois o código. A spec é a fonte de verdade — código e spec divergentes é bug de processo.

## Quando exige spec

- Tela ou fluxo novo (página + serviço + rotas)
- Mudança de contrato com o backend (payload enviado, campos consumidos da resposta)
- Fluxo financeiro (comissões, vouchers, boletos, faturamento) — a spec deve referenciar a spec correspondente do backend quando o contrato mudar
- Autenticação, rotas privadas, níveis de acesso na interface
- Mudança em estado global / hooks compartilhados entre páginas

## Quando NÃO exige spec

- Fix de bug pontual sem mudança de comportamento contratual
- Ajuste visual/CSS, texto, logging, typo

Nomes de pasta: `kebab-case`, ex.: `selecao-comissoes-emissao`, `contrato-cancelamento-voucher`.
