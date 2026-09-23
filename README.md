<div align="center">
  <a id="readme-top"></a>
  <h1>Zuno - Consolidador de Investimentos</h1>
  <p>Plataforma em monorepo para centralizar carteiras de investimentos, calcular preço médio e custódias de renda variável e cripto, acompanhar proventos e emitir relatórios em PDF.</p>

  <p>
    <a href="https://github.com/ilanzgx/zuno-app/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/ilanzgx/zuno-app/ci.yml?branch=main&label=CI&style=flat&color=3b82f6" alt="CI Status" /></a>
    <a href="https://github.com/ilanzgx/zuno-app/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-AGPL--3.0-3b82f6" alt="License: AGPL-3.0" /></a>
    <a href="https://www.oracle.com/java/"><img src="https://img.shields.io/badge/java-21-3b82f6?logo=openjdk&logoColor=white" alt="Java 21" /></a>
    <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/spring_boot-3.5-3b82f6?logo=spring&logoColor=white" alt="Spring Boot 3" /></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/next.js-16-3b82f6?logo=nextdotjs&logoColor=white" alt="Next.js 16" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/react-19-3b82f6?logo=react&logoColor=white" alt="React 19" /></a>
    <a href="https://www.python.org/"><img src="https://img.shields.io/badge/python-3.13-3b82f6?logo=python&logoColor=white" alt="Python 3.13" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/postgresql-17-3b82f6?logo=postgresql&logoColor=white" alt="PostgreSQL 17" /></a>
  </p>
</div>

## Visao geral

O Zuno reune ativos da B3 (acoes, FIIs, BDRs, ETFs) e criptomoedas em um unico painel. O sistema registra transacoes de compra e venda, calcula a posicao consolidada com base no custo medio ponderado, busca cotacoes e dividendos de mercado e gera relatorios operacionais.

### O que o sistema faz

- **Consolidacao de carteira**: recalcula quantidade e preco medio a cada operacao registrada.
- **Historico patrimonial**: gera graficos mensais de evolucao de patrimonio cruzando a quantidade em custodia com o historico de precos.
- **Controle de dividendos**: mapeia eventos de proventos da B3 e calcula os valores recebidos a partir da data da primeira compra.
- **Alocacao de ativos**: exibe a distribuicao percentual do portfolio por classe de ativo.
- **Relatorios em PDF**: exporta o extrato consolidado da carteira via JasperReports.
- **Market data isolado**: microservico dedicado em Python que consulta cotacoes, historico e proventos via yfinance.

---

## Arquitetura do sistema

O projeto é estruturado como monorepo dividindo núcleo transacional, microserviço de mercado e cliente web:

```
+-----------------------------------------------------------------------------+
|                          apps/web (Next.js 16)                              |
|             React 19, TypeScript, Tailwind CSS, Recharts                    |
+-----------------------------------------------------------------------------+
                                       |
                                       | HTTP REST / JSON
                                       | Bearer JWT (HttpOnly Cookie via Server Actions)
                                       v
+-----------------------------------------------------------------------------+
|                          apps/api (Spring Boot 3)                           |
|           Java 21, Spring Security, JPA/Hibernate, Flyway, JasperReports    |
+-----------------------------------------------------------------------------+
           |                                                |
           | HTTP interno                                   | HTTP externo
           v                                                v
+------------------------------------+    +-----------------------------------+
|    apps/market (FastAPI / Python)  |    |         Brapi External API        |
|      yfinance, Pandas, uv          |    |     Cotações em tempo real        |
+------------------------------------+    +-----------------------------------+
           |                                                |
           +-----------------------+------------------------+
                                   v
                   +-------------------------------+
                   |       Redis 7 (Cache L2)      |
                   | TTL: 600s, Ticker/Quote keys  |
                   +-------------------------------+
                                   ^
                                   | SQL (JDBC)
                   +-------------------------------+
                   |       PostgreSQL 17 DB        |
                   |  Users, Positions, Transacts  |
                   +-------------------------------+
```

### Divisão de responsabilidades

- **`apps/web` (Next.js 16, React 19, TypeScript)**: Interface do usuário construída com App Router, Tailwind CSS, Radix UI, Zustand para estado de sessão e Recharts para visualização gráfica.
- **`apps/api` (Java 21, Spring Boot 3)**: Núcleo transacional e regras contábeis, persistência com Spring Data JPA, autenticação JWT e geração de PDFs com JasperReports.
- **`apps/market` (Python 3.13, FastAPI)**: Microserviço responsável por consultar cotações e proventos da B3 e cripto via `yfinance`, servindo de proxy rápido para o backend Java.
- **Infraestrutura**: PostgreSQL 17 para persistência relacional, Redis 7 para cache L2 de cotações e séries temporais, e pgAdmin 4 para gestão visual do banco.

---

## Estrutura do repositorio

```
consolidador-investimentos/
├── apps/
│   ├── api/                  # Backend principal (Spring Boot 3 / Java 21)
│   │   ├── src/main/java/com/ilanzgx/demo/
│   │   │   ├── config/       # Filtros de seguranca e configuracao JWT
│   │   │   └── modules/      # Modulos isolados por dominio
│   │   │       ├── auth/         # Login e registro de usuarios
│   │   │       ├── dividend/     # Consulta e projecao de proventos
│   │   │       ├── market/       # Integracao com microservico e cache Redis
│   │   │       ├── portfolio/    # Resumo, alocacao e historico consolidado
│   │   │       ├── position/     # Custodia e calculo de preco medio
│   │   │       ├── report/       # Exportacao de relatorio em PDF
│   │   │       ├── transaction/  # Registro de compras e vendas
│   │   │       └── user/         # Perfil e dados de usuario
│   │   └── src/main/resources/
│   │       ├── application.yml
│   │       └── reports/          # Template portfolio.jrxml
│   │
│   ├── market/               # Microservico de cotacoes (Python / FastAPI)
│   │   ├── src/api/v1/       # Endpoints de cotacao, historico e noticias
│   │   └── pyproject.toml
│   │
│   └── web/                  # Frontend (Next.js 16 / React 19)
│       ├── src/app/          # Rotas publicas (/entrar, /registrar) e privadas
│       ├── src/resources/    # Services e integracao com a API
│       └── package.json
│
├── .docker/                  # Volumes persistentes de PostgreSQL e Redis
├── docker-compose.yml        # PostgreSQL, Redis e pgAdmin
├── pnpm-workspace.yaml       # Definicao do workspace monorepo
├── Taskfile.yml              # Task runner para automacao local
├── package.json              # Scripts e orquestracao do monorepo
├── LOCAL_DEVELOPMENT.md      # Guia completo de setup e desenvolvimento local
├── AGENTS.md                 # Contexto de arquitetura para agentes IA
└── README.md
```

---

## Stack tecnologica

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS, Radix UI, Zustand, Recharts |
| **Backend API** | Java 21, Spring Boot 3, Spring Data JPA, Spring Security, JWT, JasperReports |
| **Market Data** | Python 3.13, FastAPI, Uvicorn, yfinance, Pandas, uv |
| **Gerenciamento** | pnpm workspaces, Taskfile (go-task) |
| **Banco e Cache** | PostgreSQL 17, Redis 7 |
| **Infraestrutura** | Docker, Docker Compose, pgAdmin 4 |

---

## Desenvolvimento local

Instruções completas de configuração do ambiente, variáveis, execução de serviços (em conjunto ou isolados), testes e solução de problemas estão documentadas no:

👉 [**Guia de Desenvolvimento Local (LOCAL_DEVELOPMENT.md)**](./LOCAL_DEVELOPMENT.md)

---

## Comandos disponiveis

O monorepo pode ser operado via **Task** (`task`) ou via scripts do **pnpm**:

| Acao | Via Task | Via pnpm |
| :--- | :--- | :--- |
| Iniciar aplicacoes em paralelo | `task dev` | `pnpm dev` |
| Iniciar apenas o Web | `task dev:web` | `pnpm start:web` |
| Iniciar apenas a API Java | `task dev:api` | `pnpm start:api` |
| Iniciar apenas o Market Python | `task dev:market` | `pnpm start:market` |
| Subir infraestrutura (Docker) | `task infra:up` | `docker compose up -d database redis pgadmin` |
| Parar infraestrutura | `task infra:down` | `docker compose down` |
| Executar testes da API Java | `task test:api` | `pnpm test:api` |
| Executar testes do Market | `task test:market` | `pnpm test:market` |
| Build do pacote da API | `task build:api` | `pnpm build:api` |
| Build de producao do Web | `task build:web` | `pnpm build:web` |

---

## Licenca

Projeto distribuido sob licenca AGPLv3. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
