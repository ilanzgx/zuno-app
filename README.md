# Consolidador de Investimentos

## 📖 Visão Geral

O Consolidador de Investimentos é uma aplicação full-stack projetada para centralizar a vida financeira de um investidor em uma única plataforma. O objetivo principal é agregar dados de diversas fontes, como corretoras e outras instituições financeiras, para fornecer uma visão holística e unificada do patrimônio.

Com essa consolidação, os usuários podem acompanhar em tempo real a performance de suas carteiras, analisar a alocação de ativos, monitorar o recebimento de dividendos e obter insights valiosos para otimizar suas estratégias de investimento. A plataforma visa simplificar a gestão de portfólios complexos, eliminando a necessidade de consultar múltiplas plataformas e planilhas.

## 🏛️ Arquitetura

O projeto é composto por três aplicações principais:

1. **API (Spring Boot)** - Backend principal responsável por:

   - Autenticação e autorização de usuários (JWT)
   - Gerenciamento de transações e posições
   - Persistência de dados (PostgreSQL)
   - Cache de dados (Redis)

2. **Market API (FastAPI)** - Microserviço especializado em dados de mercado:

   - Cotações em tempo real de ações da B3
   - Histórico de dividendos
   - Cotações de criptomoedas
   - Integração com Yahoo Finance via yfinance

3. **Web (Next.js)** - Interface do usuário:
   - Dashboard interativo
   - Visualização de posições e patrimônio
   - Gerenciamento de transações
   - Análise de eventos (dividendos)

## ✨ Tecnologias Utilizadas

### Backend (API)

- **Java 21**
- **Spring Boot 3.5.5**
- **Spring Data JPA**
- **Spring Security (com JWT)**
- **PostgreSQL**
- **Redis**
- **Maven**

### Frontend (Web)

- **Next.js 15**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI**
- **Zustand**

### Market API

- **Python 3.13**
- **FastAPI** - Framework web moderno e de alta performance
- **Uvicorn** - Servidor ASGI
- **yfinance** - Biblioteca para obter dados do Yahoo Finance
- **pandas** - Manipulação e análise de dados
- **uv** - Gerenciador de pacotes Python ultrarrápido

## 🚀 Início Rápido

### Pré-requisitos

- **Java 21+**
- **Node.js 20+**
- **Python 3.13+**
- **Maven**
- **Docker** (para o banco de dados PostgreSQL e Redis)

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/ilanzgx/consolidador-investimentos.git
   cd consolidador-investimentos
   ```

2. **Instale as dependências do frontend:**

   ```bash
   cd apps/web
   npm install
   cd ../..
   ```

3. **Instale as dependências do backend:**

   ```bash
   cd apps/api
   mvnw dependency:resolve
   cd ../..
   ```

4. **Instale as dependências da Market API:**

   ```bash
   cd apps/market
   pip install uv
   uv sync
   cd ../..
   ```

### Configuração

1. **Suba os containers do banco de dados e Redis:**

   ```bash
   docker-compose up -d
   ```

2. **Configure as variáveis de ambiente da API:**
   - Navegue até `apps/api` e copie `.env.example` para `.env`.
   - Preencha as variáveis de ambiente necessárias no arquivo `.env`.

### Rodando a Aplicação

Para rodar todas as aplicações simultaneamente, utilize o seguinte comando na raiz do projeto:

```bash
npm run dev
```

Comandos alternativos:

- **Rodar apenas o backend:** `npm run start:api`
- **Rodar apenas o frontend:** `npm run start:web`
- **Rodar apenas a api de dados financeiros:** `npm run start:market`

## 🏗️ Estrutura do Projeto

O projeto é um monorepo com a seguinte estrutura:

```text
/
├── apps/
│   ├── api/      # Backend Spring Boot
│   ├── market/   # Market API (FastAPI)
│   └── web/      # Frontend Next.js
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔌 API Endpoints

### API Principal (Spring Boot)

A API fornece os seguintes endpoints:

- **Autenticação:** `/v1/auth`
- **Usuários:** `/v1/users`
- **Posições:** `/v1/positions`
- **Transações:** `/v1/transactions`
- **Portfólio:** `/v1/portfolio`
- **Dividendos:** `/v1/dividends`

### Market API (FastAPI)

A Market API fornece dados em tempo real do mercado financeiro:

- **Cotações B3:** `GET /b3/quote/{ticker}` - Obtém cotação de ações da B3
- **Dividendos B3:** `GET /b3/dividends/{ticker}` - Obtém histórico de dividendos
- **Cotações Crypto:** `GET /crypto/quote/{ticker}` - Obtém cotação de criptomoedas

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## 📜 Licença

Este projeto está licenciado sob a licença ISC.
