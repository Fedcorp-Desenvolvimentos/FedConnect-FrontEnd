📊 Fed Connect — Front-End | Grupo FedCorp

**Fed Connect** é a plataforma interna do Grupo FedCorp que reúne, em uma única interface, a consulta de dados cadastrais (pessoas físicas, jurídicas e endereços) e as ferramentas operacionais da companhia — comissões, vistorias, faturamento, cotações, agenda e métricas. O sistema é voltado para uso corporativo, com foco em seguradoras, empresas de serviços e instituições que precisam validar e analisar dados cadastrais com segurança e agilidade.

Este repositório contém o **front-end** da plataforma. A API que o alimenta está em [FedConnect-Back-End](https://github.com/Fedcorp-Desenvolvimentos/FedConnect-Back-End).

## 🧩 Visão Geral

O Fed Connect foi pensado para agilizar o acesso às informações de clientes, empresas e endereços, integrando em um só lugar os dados das APIs públicas de consulta, a base da própria organização e os sistemas legados da companhia.

Capacita consultores, administradores e as áreas comercial, financeira e de RH a buscar dados específicos ou em massa (por importação de planilhas), emitir documentos e acompanhar métricas — com segurança, performance e usabilidade.

## 🎯 Funcionalidades Principais

### 🔎 Consultas

📄 **Consulta de dados pessoais (CPF)**
- Retorna dados básicos como nome completo, data de nascimento, situação do CPF, entre outros.

📊 **Consulta de Pessoa Jurídica (CNPJ)**
- Permite verificar informações cadastrais da empresa, como razão social, nome fantasia, situação, CNAE, natureza jurídica e endereço oficial.

📍 **Consulta de Endereço (CEP)**
- Busca de endereços a partir de CEPs com retorno de logradouro, bairro, cidade e estado.

📚 **Consulta em Massa**
- Upload de planilha (XLS/CSV) com CPFs, CNPJs ou CEPs e devolução do arquivo já preenchido com os dados encontrados.
- Modelos de planilha disponíveis para download direto na interface.

👥 **Consulta de Beneficiários / Segurados**
- Busca de beneficiários na base da organização, trazendo o histórico dos serviços feitos com a companhia.

🧾 **Consulta de Faturas**
- Busca de faturamento na base da organização para controle financeiro, com exportação em Excel e PDF.

🗺️ **Consulta por Região e Mapa de Redes**
- Localização de prestadores e cobertura por região, com visualização em mapa.

📜 **Histórico de Consultas**
- Registro de todas as consultas realizadas, por usuário e por período.

### 💼 Operação e Financeiro

💰 **Comissões**
- Consulta de comissões por fatura e por data de corte.
- Emissão de **recibo do corretor** e **voucher de comissão** em PDF.
- Cancelamento de comissões em lote e consulta do histórico de vouchers emitidos.

🔧 **Vistorias**
- Consulta de vistorias com filtros por período, estado, administradora, vistoriador e fatura.
- Exportação de relatórios em Excel e PDF.
- Filtro por vistoriador restrito a perfis administrador/moderador.

🧾 **Faturamento**
- Segunda via de boleto, tratamento de erros, conversão de formatos de arquivo e integrações de pagamento (FedBnk / FedCorp Pay).

📤 **Envio Porto**
- Geração e envio dos arquivos de assistência, vida e dental, com acompanhamento de jobs e download dos resultados.

📊 **Cotação de Produtos**
- Permite cotar um seguro em tempo real (ex.: incêndio conteúdo).

🤖 **Automação**
- Separação e processamento de PDFs em lote e rotinas de envio automatizado.

### 📈 Gestão e Acesso

📊 **Métricas e Analytics**
- Dashboards com faturamento, inadimplência, ranking de administradoras e status de faturas em tempo real.

📅 **Agenda**
- Agenda comercial e reserva de salas.

🧰 **Ferramentas da Companhia**
- Centralização dos acessos de todas as ferramentas em um único lugar.

📝 **Questionários e Workflow**
- Questionários de processos e acompanhamento de fluxos internos.

🧑‍💻 **Gerenciamento de Usuários**
- Cadastro de novos usuários com função/nível de acesso (ex.: administrador, moderador, consultor).
- Edição e exclusão de contas existentes com modal de confirmação.
- Página "Minha Conta" para dados e troca de senha.

🔐 **Autenticação**
- Login com e-mail e senha (JWT) e login com Google (OAuth).
- Fluxo completo de recuperação e redefinição de senha.
- Rotas privadas com controle por nível de acesso.

## 📁 Interface e Experiência

- Navegação por **sidebar** fixa com dropdown, breadcrumb e layout responsivo (desktop e mobile).
- Modais de ação (exclusão, confirmação) e feedbacks visuais de sucesso/erro via Notistack.
- Estados de carregamento centralizados e tratamento de erros padronizado.
- Ajuda contextual por tela (Help / HelpModal).
- Ícones e componentes acessíveis, sem dependência de frameworks de UI pesados.

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
|-----------|------------|
| Framework | React 18 |
| Build/Dev server | Vite 6 |
| Linguagem | JavaScript (ES6+) |
| Roteamento | React Router DOM v6 |
| HTTP | Axios |
| Gráficos | Recharts |
| Mapas | React Leaflet + Leaflet |
| UI / Ícones | Radix UI, Lucide React, React Icons, Bootstrap Icons |
| Planilhas | xlsx + file-saver |
| Datas | date-fns + react-datepicker |
| Notificações | Notistack |
| Estilização | CSS modularizado + Styled Components |
| Autenticação | JWT + `@react-oauth/google` |
| Deploy | Docker · DigitalOcean App Platform · Vercel (homologação) |

## 🔧 Estrutura de Pastas

```
├── public/                # Imagens e assets estáticos
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── Adm/ Agenda/ Automacao/ Comercial/ Consultas/ Cotação/
│   │   ├── Faturamento/ Mapa/ Produtos/ Views/
│   │   └── Breadcrumb/ Dropdown/ Help/ Loading/ Modal/ NotFound/
│   │       PageLayout/ Sidebar/ TratamentoErros/
│   ├── pages/             # Páginas da aplicação
│   │   ├── Consultas/ Comercial/ Financeiro/ Faturamento/ Vistorias/
│   │   ├── Analytics/ Metricas/ Agenda/ Automacao/ Questionarios/
│   │   ├── Workflow/ Ferramentas/ MapaRedes/ SegundaVia/ RH/
│   │   ├── Home/ Historico/ Cadastro/ CadastroPessoas/
│   │   ├── GerenciarUsuarios/ MinhaConta/
│   │   └── Login/ RecuperarSenha/ ResetarSenha/
│   ├── Layouts/           # Layouts de página
│   ├── routes/            # AppRouter.jsx e PrivateRouter.jsx
│   ├── services/          # Camada de API (Axios) — um serviço por domínio
│   ├── context/           # AuthContext e GlobalContext
│   ├── hooks/             # Custom hooks (useLoading, useIsMobile, etc.)
│   ├── config/            # Configuração da aplicação
│   ├── styles/            # Arquivos CSS
│   ├── utils/             # Utilitários
│   ├── data/              # Dados estáticos
│   ├── App.jsx            # Composição e providers
│   └── main.jsx           # Entry point
├── specs/                 # Especificações por feature (spec-driven)
├── Dockerfile
├── docker-compose.yml
├── vite.config.js
└── index.html
```

## 🚀 Como Rodar

### Pré-requisitos
- Node.js >= 18.x
- npm (ou yarn)
- Back-end do FedConnect acessível (local ou ambiente remoto)

### Instalação

```bash
# 1 - Clone o repositório
git clone git@github.com:Fedcorp-Desenvolvimentos/FedConnect-FrontEnd.git
cd FedConnect-FrontEnd

# 2 - Instale as dependências
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz com a URL da API e as credenciais públicas necessárias:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_GOOGLE_CLIENT_ID=seu_client_id_do_google
```

> ⚠️ O `.env` não é versionado. Solicite os valores de cada ambiente ao time de desenvolvimento.

### Ambiente de desenvolvimento

```bash
npm run dev
```

Em seguida, abra `http://localhost:3000` no navegador.

### Build de produção

```bash
npm run build     # gera a pasta dist/
npm run preview   # serve o build localmente para conferência
```

### Docker

```bash
docker compose up --build
```

## 🌐 Ambientes

| Ambiente | Endereço |
|----------|----------|
| Produção | https://fedconnect.com.br |
| Homologação | https://fedconnect-hml.vercel.app |
| Local | http://localhost:3000 |

## 🧭 Processo de Desenvolvimento

O projeto segue um fluxo **spec-driven**: toda feature relevante nasce em `specs/<nome-da-feature>/` com três documentos aprovados em sequência antes da implementação:

1. `requirements.md` — o que precisa existir e por quê
2. `design.md` — como será construído
3. `tasks.md` — as tarefas executáveis

Consulte `specs/README.md` para as convenções e o template.

## 📂 Funcionalidades Futuras

- **Consulta de Leads**
  - Consulta de leads para o comercial buscar informações.
  - Geração de relatório consolidado com os dados retornados.

- **Envio de E-mails em Massa**
  - Upload de planilha com as informações do dia a dia para envio em formato de e-mail.
  - Histórico de envio e manutenção da rede de contatos.

- **Evolução contínua**
  - Filtros e paginação avançada nas tabelas de dados.
  - Documentação de componentes (Storybook / Design System).

## 🧑‍💻 Desenvolvido por

**Ingrid Aylana** — Desenvolvedora Front-End
[LinkedIn](https://www.linkedin.com/in/ingryd-aylana-silva-dos-santos-4a2701158)

**Michel Policeno** — Desenvolvedor Back-End
[LinkedIn](https://www.linkedin.com/in/michel-policeno-85a866212) · [GitHub](https://github.com/Michel-Policeno)

**Daniel Mello** — Desenvolvedor Back-End
[LinkedIn](https://www.linkedin.com/in/danielmellocf/) · [GitHub](https://github.com/DMCFaria)

---

<sub>Projeto interno do Grupo FedCorp. Uso restrito.</sub>
