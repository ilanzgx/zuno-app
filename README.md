# Consolidador de Investimentos

## 📖 Visão Geral

O Consolidador de Investimentos é uma aplicação full-stack projetada para centralizar a vida financeira de um investidor em uma única plataforma. O objetivo principal é agregar dados de diversas fontes, como corretoras e outras instituições financeiras, para fornecer uma visão holística e unificada do patrimônio.

Com essa consolidação, os usuários podem acompanhar em tempo real a performance de suas carteiras, analisar a alocação de ativos, monitorar o recebimento de dividendos e obter insights valiosos para otimizar suas estratégias de investimento. A plataforma visa simplificar a gestão de portfólios complexos, eliminando a necessidade de consultar múltiplas plataformas e planilhas.

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

## 🚀 Início Rápido

### Pré-requisitos

- **Java 21+**
- **Node.js 20+**
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

### Configuração

1. **Suba os containers do banco de dados e Redis:**

   ```bash
   docker-compose up -d
   ```

2. **Configure as variáveis de ambiente da API:**
   - Navegue até `apps/api` e copie `.env.example` para `.env`.
   - Preencha as variáveis de ambiente necessárias no arquivo `.env`.

### Rodando a Aplicação

Para rodar a API e o frontend simultaneamente, utilize o seguinte comando na raiz do projeto:

```bash
npm run dev
```

Comandos alternativos:

- **Rodar apenas a API:** `npm run start:api`
- **Rodar apenas o frontend:** `npm run start:web`

## 🏗️ Estrutura do Projeto

O projeto é um monorepo com a seguinte estrutura:

```text
/
├── apps/
│   ├── api/      # Backend Spring Boot
│   └── web/      # Frontend Next.js
├── docker-compose.yml
├── package.json
└── README.md
```

## 🔌 API Endpoints

A API fornece os seguintes endpoints:

- **Autenticação:** `/v1/auth`
- **Usuários:** `/v1/users`
- **Posições:** `/v1/positions`
- **Transações:** `/v1/transactions`

Para mais detalhes sobre cada endpoint, consulte o código-fonte nos respectivos controllers: -`apps/api/src/main/java/com/ilanzgx/demo/modules/auth/infrastructure/AuthController.java` -`apps/api/src/main/java/com/ilanzgx/demo/modules/user/infrastructure/UserController.java` -`apps/api/src/main/java/com/ilanzgx/demo/modules/position/infrastructure/PositionController.java` -`apps/api/src/main/java/com/ilanzgx/demo/modules/transaction/infrastructure/TransactionController.java`

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## 📜 Licença

Este projeto está licenciado sob a licença ISC.
