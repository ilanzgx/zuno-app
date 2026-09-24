# Desenvolvimento Local

Rodar o Zuno localmente é simples. Este guia cobre o passo a passo para configurar o ambiente, executar os serviços juntos ou de forma isolada, rodar testes e solucionar problemas comuns.

---

## Pré-requisitos

Para rodar o Zuno na sua máquina, você precisa ter instalado:

- **Docker e Docker Compose** — orquestração de PostgreSQL, Redis e pgAdmin
- **Node.js (20+)** — runtime do frontend
- **pnpm (10+)** — gerenciador de pacotes do frontend e workspace monorepo
- **Java JDK (21+)** — runtime da API principal (Spring Boot)
- **Python (3.13+)** com **[uv](https://docs.astral.sh/uv/)** — microserviço de dados de mercado (FastAPI)
- **[Task](https://taskfile.dev)** *(recomendado)* — executor de comandos para o monorepo

---

## Instruções de Setup

### 1. Clonar o Repositório

```bash
git clone https://github.com/ilanzgx/consolidador-investimentos.git
cd consolidador-investimentos
```

### 2. Instalar as Dependências

Na raiz do projeto, instale as dependências gerenciadas pelo pnpm:

```bash
pnpm install
```

### 3. Subir a Infraestrutura (Banco e Cache)

Inicie os containers do PostgreSQL, Redis e pgAdmin:

```bash
task infra:up

# Ou diretamente via Docker:
docker compose up -d database redis pgadmin
```

Para checar se os serviços subiram corretamente:

```bash
docker compose ps
```

### 4. Configurar as Variáveis de Ambiente

Copie o arquivo de exemplo para o backend da API:

```bash
cp apps/api/.env.example apps/api/.env
```

O arquivo `apps/api/.env` vem pré-configurado para o ambiente local:

```env
DB_URL=localhost
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=postgres

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=sua_chave_jwt_secreta_com_pelo_menos_256_bits
BRAPI_TOKEN=seu_token_aqui
MARKET_SERVICE_URL=http://localhost:8000
```

> As configurações do frontend já vêm apontadas para o backend local em `apps/web/.env.development`.

### 5. Iniciar as Aplicações

Para rodar todos os serviços simultaneamente:

```bash
task dev

# Ou via pnpm:
pnpm dev
```

Com os serviços rodando, você terá:

- **Frontend (Next.js 16):** [`http://localhost:3000`](http://localhost:3000)
- **Backend API (Spring Boot 3):** [`http://localhost:8080`](http://localhost:8080)
- **Microserviço de Mercado (FastAPI):** [`http://localhost:8000`](http://localhost:8000)
- **Swagger / OpenAPI do Mercado:** [`http://localhost:8000/docs`](http://localhost:8000/docs)
- **pgAdmin (Painel do Postgres):** [`http://localhost:15432`](http://localhost:15432) (`admin@admin.com` / `admin`)
- **PostgreSQL:** `localhost:5432`
- **Redis:** `localhost:6379`

---

## Executando Serviços de Forma Isolada

Se você estiver trabalhando em apenas uma camada do sistema, pode rodar os serviços individualmente:

### Backend API (Java 21 / Spring Boot)

```bash
task dev:api

# Ou diretamente pelo Maven Wrapper:
# Windows:
.\apps\api\mvnw.cmd -f apps/api/pom.xml spring-boot:run
# Linux/macOS:
./apps/api/mvnw -f apps/api/pom.xml spring-boot:run
```

Disponível em: `http://localhost:8080`

### Frontend (Next.js 16 / React 19)

```bash
task dev:web

# Ou via pnpm:
pnpm --filter @consolidador-investimentos/web dev
```

Disponível em: `http://localhost:3000`

### Microserviço de Mercado (Python 3.13 / FastAPI)

```bash
task dev:market

# Ou via uv diretamente da raiz:
uv run --directory apps/market uvicorn src.main:app --reload --port 8000
```

Disponível em: `http://localhost:8000`

---

## Fluxo de Desenvolvimento

### Executando Testes

```bash
# Executar todos os testes do monorepo
task test
# ou: task test:all / pnpm test

# Testes da API Java (Spring Boot)
task test:api
# Para filtrar uma classe de teste específica:
task test:api -- -Dtest=MarketServiceImplTest

# Testes do microserviço Python (pytest)
task test:market
# Para filtrar testes específicos no pytest:
task test:market -- -k test_b3_quote
```

### Compilação e Build de Produção

```bash
# Build de todo o projeto
task build:all

# Build do frontend Next.js
task build:web

# Empacotar o JAR da API Spring Boot
task build:api
```

### Gerenciando a Infraestrutura

```bash
# Ver logs dos containers em tempo real
task infra:logs

# Parar todos os containers
task infra:down
```

---

## Resolução de Problemas

- **Portas `5432` ou `6379` já em uso:**  
  Caso já tenha instâncias de PostgreSQL ou Redis rodando nativamente fora do Docker, encerre o processo local ou ajuste a porta exposta no `docker-compose.yml`.

- **Permissão no Maven Wrapper (Linux / macOS):**  
  Se o executável do Maven falhar por falta de permissão de execução:
  ```bash
  chmod +x apps/api/mvnw
  ```

- **Dependências desatualizadas no Python:**  
  Caso o serviço de mercado acuse falta de pacotes após puxar código novo:
  ```bash
  cd apps/market && uv sync
  ```

- **Limpar cache do Redis:**  
  Para forçar a invalidação de cotações em cache:
  ```bash
  docker compose exec redis redis-cli FLUSHALL
  ```
