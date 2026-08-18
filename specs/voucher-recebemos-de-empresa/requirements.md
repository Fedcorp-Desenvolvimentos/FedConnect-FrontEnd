# Requisitos — Seletor "Empresa pagadora (Recebemos de)" na emissão de voucher

> **Status:** Aprovado
> **Autor:** Ingrid Aylana + Claude | **Data:** 2026-08-18 | **Área(s):** `src/pages/Financeiro/comissoes/`

## Contexto e Problema

Lado frontend da spec `FedHub-Backend/specs/voucher-recebemos-de-empresa/` (ler primeiro — contexto e mapa TIPO→empresa estão lá). O usuário precisa ver e poder escolher a empresa do grupo que pagará a comissão antes de emitir o voucher.

## Escopo

**Dentro:** seletor na sidebar de Emissão; inferência automática pelo TIPO; bloqueio de emissão mista sem escolha; empresa no preview; campos no payload.
**Fora:** recibo (sem "Recebemos de"); tela de consulta de vouchers.

## User Stories e Critérios de Aceitação

### RF-1: Seletor sempre visível, pré-preenchido

**Como** operador, **quero** ver a empresa pagadora antes de emitir, **para** conferir contra a nota fiscal do favorecido.

- **QUANDO** o tipo de documento é Voucher, **ENTÃO** a interface **DEVE** exibir o seletor "Empresa pagadora (Recebemos de)" com as 3 empresas (nome + CNPJ).
- **QUANDO** as comissões selecionadas têm um único TIPO, **ENTÃO** o seletor **DEVE** indicar a empresa inferida no modo "Automático".
- **QUANDO** o usuário escolhe manualmente, **ENTÃO** a escolha **DEVE** prevalecer sobre a inferência.

### RF-2: Misto exige escolha

- **SE** as comissões selecionadas têm TIPOs diferentes **E** nenhuma empresa foi escolhida, **ENTÃO** a interface **DEVE** destacar o seletor, exibir aviso e **bloquear** a emissão do voucher com mensagem clara.
- **QUANDO** a emissão prossegue, **ENTÃO** o payload **DEVE** conter `empresa_pagadora_nome` e `empresa_pagadora_cnpj` da empresa efetiva.

### RF-3: Conferência no preview

- **QUANDO** o preview de um voucher abre, **ENTÃO** os metadados **DEVEM** exibir a empresa pagadora (nome + CNPJ).

## Requisitos Não Funcionais

- **Contrato:** campos e mapa idênticos ao backend (`EMPRESAS_COMISSAO` em voucher_controller.py) — mudou lá, muda aqui.
- **Consistência:** a lista de empresas vive em UMA constante (`constants/empresasPagadoras.js`) importada por todos — sem cópias locais.
