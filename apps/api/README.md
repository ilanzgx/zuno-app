# ♊ API - Consolidador de Investimentos

## 📖 Visão Geral

A API é responsável por toda a lógica de negócio, gerenciamento de dados e autenticação da aplicação. Construída com Java e Spring Boot, ela segue uma arquitetura modular para separar as responsabilidades e facilitar a manutenção.

## ✨ Tecnologias Utilizadas

- **Framework:** Spring Boot 3
- **Linguagem:** Java 21
- **Banco de Dados:** PostgreSQL (via Spring Data JPA)
- **Cache:** Redis (para cache de dados de ações)
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

- **`stock`**: Gerencia as ações (stocks) dos usuários e consome dados externos.

  - `StockController.java`: Endpoints para CRUD de ações e consulta de dados de mercado.
  - `StockServiceImpl.java`: Lógica para associar ações a usuários.
  - `StockDataServiceImpl.java`: Serviço que busca dados de ações da API externa (Brapi) e os armazena em cache com Redis para otimizar a performance.

- **`shared`**: Contém componentes reutilizáveis, como o cliente HTTP (`HttpFetchImpl.java`) para comunicação com APIs externas.

## ⚙️ Configuração e Execução

1.  **Variáveis de Ambiente:**

    - Copie o arquivo `.env.example` para `.env`.
    - Preencha as variáveis com as credenciais do banco de dados PostgreSQL, Redis e o token da Brapi.

2.  **Instalar Dependências:**

    ```bash
    ./mvnw dependency:resolve
    ```

3.  **Rodar a API:**
    Use o script na raiz do monorepo para iniciar a API:
    ```bash
    npm run start:api
    ```
    A API estará disponível em `http://localhost:8080`.

## 🔌 Endpoints Principais

- `POST /v1/auth/register`: Registra um novo usuário.
- `POST /v1/auth/login`: Autentica um usuário e retorna um token JWT.
- `GET /v1/users`: Lista todos os usuários.
- `GET /v1/stocks/user/{userId}`: Retorna todas as ações de um usuário específico, enriquecidas com dados de mercado.
- `POST /v1/stocks`: Adiciona uma nova ação para um usuário.
