# AGENTS.md

## 1. Project Overview & Core Purpose

**Zuno** is an investment portfolio consolidator tailored for Brazilian financial market instruments (B3 Equities, Real Estate Funds / FIIs, BDRs) and cryptocurrencies.

The platform solves the fragmentation of managing investments across multiple brokers and accounts:
- **Trade Ledger & Custody:** Records BUY and SELL transactions, continuously recalculating custody positions and weighted average acquisition prices (Preço Médio) according to Brazilian fiscal rules.
- **Portfolio Consolidation & Performance:** Aggregates current equity value, realized/unrealized profit & loss, percentage returns, and asset allocation breakdown across classes.
- **Historical Equity Evolution:** Reconstructs the investor's monthly consolidated net worth across the last 12 months by intersecting historical holdings with monthly asset closing prices.
- **Dividend & Yield Tracking:** Maps B3 corporate dividend announcements and calculates actual cash payouts received since each asset's acquisition date.
- **Executive Reporting:** Generates downloadable consolidated portfolio PDF statements via JasperReports.
- **Isolated Market Data:** Offloads third-party scraping, historical series parsing, and Yahoo Finance proxying to a dedicated Python microservice with Redis caching.

---

## 2. Hard Rules

- **ALMOST NEVER write comments.** We're senior engineers here, not learners.
- **NEVER run the backend or frontend manually.** The human is already running dev servers.
- **ALWAYS test backend changes** by writing unit or end-to-end tests.
- **ALWAYS test frontend changes** by running Playwright MCP.
- **ALWAYS keep [`docs/architecture.md`](docs/architecture.md) updated** whenever adding or changing endpoints, database schemas, cache keys, external integrations, or deployment configs.

---

## 3. Architecture Quick Reference

Detailed diagrams, schemas, and sequence flows are documented in [`docs/architecture.md`](docs/architecture.md).

- **`apps/api` (Spring Boot 3.5.5 / Java 21):** Transactional core, DDD modules (`auth`, `user`, `transaction`, `position`, `portfolio`, `dividend`, `market`, `report`, `shared`), Flyway, JasperReports PDF. Stateless JWT auth.
- **`apps/market` (FastAPI 0.122 / Python 3.13):** Market scraper/proxy using `yfinance` and Pandas. Managed via `uv`.
- **`apps/web` (Next.js 16.3.6 / React 19.1):** App Router with Server Actions (BFF), edge middleware session check, Zustand store, Tailwind CSS 4, Radix UI, Recharts.
- **`database` (PostgreSQL 17):** Core tables `users`, `positions`, `transactions`.
- **`cache` (Redis 7):** L2 cache for market quotes and dividends (TTL: 600s).

---

## 4. Financial Computation Rules

1. **BUY (Purchase):** Recalculate weighted average price:
   $$\text{PM}_{\text{new}} = \frac{(\text{Qty}_{\text{current}} \times \text{PM}_{\text{current}}) + (\text{Qty}_{\text{tx}} \times \text{Price}_{\text{tx}})}{\text{Qty}_{\text{current}} + \text{Qty}_{\text{tx}}}$$
2. **SELL (Sale):**
   - Does **not** change average price (Brazilian tax rules).
   - Decrements quantity only: $\text{Qty}_{\text{new}} = \text{Qty}_{\text{current}} - \text{Qty}_{\text{tx}}$.
   - Rejects operation if $\text{Qty}_{\text{tx}} > \text{Qty}_{\text{current}}$ (no short selling allowed).
   - Resets average price to `0.00` if $\text{Qty}_{\text{new}} == 0$.
3. **Asset Types:** `STOCK`, `FII`, `BDR`.

---

## 5. CLI Reference & Task Commands

The project uses Taskfile with pnpm script fallbacks:

| Command | Action |
| :--- | :--- |
| `task dev` | Runs all 3 apps concurrently (`pnpm run dev`) |
| `task dev:api` | Runs Spring Boot API (`apps/api/mvnw.cmd spring-boot:run` or `./mvnw`) |
| `task dev:market` | Runs FastAPI microservice (`uv run --directory apps/market uvicorn src.main:app --reload`) |
| `task dev:web` | Runs Next.js frontend (`pnpm --filter @consolidador-investimentos/web dev`) |
| `task infra:up` | Boots Postgres, Redis, and pgAdmin (`docker compose up -d database redis pgadmin`) |
| `task infra:down` | Stops backing containers (`docker compose down`) |
| `task infra:logs` | Streams container logs (`docker compose logs -f`) |
| `task test:api` | Runs Java unit tests (`apps/api/mvnw.cmd test`) |
| `task test:market` | Runs Python pytest suite (`cd apps/market && uv run pytest`) |
| `task test:all` | Runs all test suites |
| `task build:api` | Packages backend JAR (`apps/api/mvnw.cmd clean package -DskipTests`) |
| `task build:web` | Builds Next.js production bundle |

### Adding Dependencies
- **Next.js:** `pnpm --filter @consolidador-investimentos/web add <pkg>`
- **Python:** `cd apps/market && uv add <pkg>`
- **Java:** Add `<dependency>` block to `apps/api/pom.xml`.
