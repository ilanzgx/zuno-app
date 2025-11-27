# ♊ API - Consolidador de Investimentos

## 📖 Visão Geral

A API é responsável por toda a lógica de negócio, gerenciamento de dados e autenticação da aplicação. Construída com Java e Spring Boot, ela segue uma arquitetura modular para separar as responsabilidades e facilitar a manutenção.

## ✨ Tecnologias Utilizadas

- **Framework:** Spring Boot 3
- **Linguagem:** Java 21
- **Banco de Dados:** PostgreSQL (via Spring Data JPA)
- **Cache:** Redis (para cache de dados de posições de ativos)
- **Segurança:** Spring Security com autenticação baseada em JWT
- **Build:** Maven

## 🏗️ Estrutura de Módulos

O código-fonte está organizado em módulos, cada um com sua própria responsabilidade:

- **`auth`**: Gerencia a autenticação de usuários, incluindo registro (`/register`) e login (`/login`), utilizando JWT para controle de sessão.

  - `AuthController.java`: Endpoints de autenticação.
  - `JwtServiceImpl.java`: Geração e validação de tokens JWT.

- **`user`**: Responsável pelo CRUD de usuários.

  - `UserController.java`: Endpoints para gerenciar usuários.
  - `UserServiceImpl.java`: Lógica de negócio para as operações de usuário.

- **`position`**: Gerencia as posições de ativos dos usuários e consome dados externos.

  - `PositionController.java`: Endpoints para consulta de posições e dados de mercado.
  - `PositionServiceImpl.java`: Lógica para calcular o preço médio e a quantidade de ativos com base nas transações.
  - `PositionDataServiceImpl.java`: Serviço que busca dados dos ativos da API externa (Brapi) e os armazena em cache com Redis para otimizar a performance.

- **`transaction`**: Gerencia as transações de compra e venda de ativos.

  - `TransactionController.java`: Endpoint para registrar novas transações.
  - `TransactionServiceImpl.java`: Lógica de negócio que, após criar uma transação, invoca o `PositionService` para atualizar a posição consolidada do usuário.

- **`shared`**: Contém componentes reutilizáveis, como o cliente HTTP (`HttpFetchImpl.java`) para comunicação com APIs externas.

## ⚙️ Configuração e Execução

1. **Variáveis de Ambiente:**

   - Copie o arquivo `.env.example` para `.env`.
   - Preencha as variáveis com as credenciais do banco de dados PostgreSQL, Redis e o token da Brapi.

2. **Instalar Dependências:**

   ```bash
   ./mvnw dependency:resolve
   ```

3. **Rodar a API:**
   Use o script na raiz do monorepo para iniciar a API:

   ```bash
   npm run start:api
   ```

   A API estará disponível em `http://localhost:8080`.

## 🔌 Endpoints Principais

- `POST /v1/auth/register`: Registra um novo usuário.
- `POST /v1/auth/login`: Autentica um usuário e retorna um token JWT.
- `GET /v1/users`: Lista todos os usuários.
- `GET /v1/positions/user/{userId}`: Retorna todas as posições de um usuário específico, enriquecidas com dados de mercado.
- `POST /v1/transactions`: Adiciona uma nova transação (compra ou venda) para um usuário, atualizando sua posição.
- `GET /v1/transactions/user/{userId}`: Retorna o histórico de transações de um usuário.
