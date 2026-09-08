# Painel de status das specs

> **Atualizado:** 2026-09-08

Estado de cada documento. Se esta página divergir do cabeçalho de um documento, **esta página vence**. Significado dos estados em [CONVENCOES.md](./CONVENCOES.md) §4 — só `aprovado` vincula.

| Spec | requirements | design | tasks |
|---|---|---|---|
| `voucher-recebemos-de-empresa` | aprovado (2026-08-18) | aprovado (2026-08-18) | aprovado (2026-08-18) — **todas concluídas**, CT-VOU-001..004 verificados manualmente em 2026-08-21; lado backend em `FedHub-Backend/specs/` |
| `curso-cipa` | **em revisão** (2026-09-04) | **em revisão** (2026-09-04) | **em revisão** (2026-09-04) — Fases 1–3 na branch `feat/curso-cipa` (sem PR), build OK; Fases 4 (ADR-0005, vínculo no inscrito), 5 (ADR-0006, exclusão) 6 (ADR-0007, planilha) 7 (ADR-0008, capacidade sinaliza) e 8 (PA-027, CNPJ e instrutor para o certificado) implementadas; CT-CIP-001..012 pendentes de verificação manual |
| `curso-cipa-historico` | aprovado (2026-09-04) | aprovado (2026-09-04) | aprovado (2026-09-04) — fases A (histórico, consulta, detalhe) e B (download da lista de presença) implementadas; CT-HIS-001..005 pendentes de verificação manual; RF-HIS-005 (fase C) em revisão; **RF-HIS-006 (fase D, aba Certificados) em rascunho (2026-09-08)**, aguarda C, PA-030 e `curso-cipa-cadastros` |
| `curso-cipa-cadastros` | **rascunho** (2026-09-08) — página `/condomed/cadastros` (palestrantes e locais); PA-029; lado backend em `FedConnect-Back-End/specs/curso-cipa-cadastros/` | — | — |
