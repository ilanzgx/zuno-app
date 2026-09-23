# AGENTS.md — Technical Architecture & Codebase Guidelines

Repository: `consolidador-investimentos` (Zuno App)  
Type: Polyglot Monorepo (Java, TypeScript, Python)  
Target Domain: Financial portfolio aggregation for Brazilian market instruments (B3 Equities, FIIs, BDRs, Cryptocurrencies).

---

## 1. System Architecture & Component Interaction

The platform follows a distributed service architecture separating transactional core logic, market data scraping/proxying, and client rendering:

```
+-----------------------------------------------------------------------------+
|                          apps/web (Next.js 16.3.6)                          |
|             React 19.1, TypeScript 5, Tailwind CSS 4, Recharts              |
+-----------------------------------------------------------------------------+
                                       |
                                       | HTTP REST / JSON
                                       | Bearer JWT (HttpOnly Cookie via Server Actions)
                                       v
+-----------------------------------------------------------------------------+
|                          apps/api (Spring Boot 3.5.5)                       |
|           Java 21, Spring Security, JPA/Hibernate, Flyway, JasperReports    |
+-----------------------------------------------------------------------------+
           |                                                |
           | Internal HTTP                                  | External HTTP
           v                                                v
+------------------------------------+    +-----------------------------------+
|      apps/market (FastAPI 0.122)   |    |         Brapi External API        |
|  Python 3.13, uv, yfinance, Pandas |    |     Real-time quotes & metadata   |
+------------------------------------+    +-----------------------------------+
           |                                                |
           +-----------------------+------------------------+
                                   v
                   +-------------------------------+
                   |     Redis 7 (Cache L2)        |
                   | TTL: 600s, Ticker/Quote keys  |
                   +-------------------------------+
                                   ^
                                   | SQL (JDBC)
                   +-------------------------------+
                   |       PostgreSQL 17 DB        |
                   |  Users, Positions, Transacts  |
                   +-------------------------------+
```

---

## 2. Directory Layout & Module Structure

```
├── apps/
│   ├── api/                                  # Transactional backend (Spring Boot 3 / Java 21)
│   │   ├── src/main/java/com/ilanzgx/demo/
│   │   │   ├── config/                       # SecurityConfig, JwtAuthFilter, PasswordConfig
│   │   │   └── modules/                      # Domain-Driven Design (DDD) module packages:
│   │   │       ├── auth/                     # AuthController, JwtServiceImpl, login/register DTOs
│   │   │       ├── dividend/                 # DividendController, DividendServiceImpl (B3 cross-ref)
│   │   │       ├── market/                   # MarketController, MarketServiceImpl (Brapi/Market proxy)
│   │   │       ├── portfolio/                # PortfolioController, PortfolioServiceImpl (equity, history)
│   │   │       ├── position/                 # PositionController, PositionServiceImpl (average price engine)
│   │   │       ├── report/                   # ReportController, ReportServiceImpl (JasperReports PDF)
│   │   │       ├── shared/                   # AssetType enum, HttpFetch interface & RestTemplate impl
│   │   │       ├── transaction/              # TransactionController, TransactionServiceImpl (ledger)
│   │   │       └── user/                     # UserController, UserServiceImpl, User JPA entity
│   │   └── src/main/resources/
│   │       ├── application.yml               # Hierarchical runtime config with variable fallbacks
│   │       ├── db/migration/                 # Flyway versioned DDL scripts (V1__...)
│   │       └── reports/                      # JasperReports XML template (portfolio.jrxml)
│   │
│   ├── market/                               # Market scraper microservice (Python 3.13 / FastAPI)
│   │   ├── src/
│   │   │   ├── api/v1/                       # b3_quote, b3_history, b3_dividends, b3_news, crypto_quote
│   │   │   ├── services/                     # market_service.py (yfinance + pandas logic)
│   │   │   └── main.py                       # FastAPI application bootstrap & router registration
│   │   ├── pyproject.toml                    # Managed via uv (fastapi, pandas, uvicorn, yfinance)
│   │   └── uv.lock
│   │
│   └── web/                                  # Web frontend (Next.js 16 App Router / React 19)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (public)/                 # /entrar, /registrar (unauthenticated routes)
│       │   │   └── (protected)/              # /dashboard, /posicoes, /transacoes, /patrimonio, /eventos, /noticias, /conta
│       │   ├── components/                   # Shared UI components (Radix primitives, tables, cards, dialogs)
│       │   ├── resources/                    # Server Actions ("use server") and API client abstractions
│       │   ├── stores/                       # Client state management (Zustand: user.store.ts)
│       │   └── middleware.ts                 # Edge request interception and JWT validation
│       └── package.json
│
├── .docker/                                  # Persistent volumes for PostgreSQL and Redis
├── docker-compose.yml                        # Local infrastructure orchestration
├── Taskfile.yml                              # Cross-platform automation task runner
├── pnpm-workspace.yaml                       # Monorepo pnpm workspace definition
└── package.json                              # Root monorepo configuration
```

---

## 3. apps/api — Backend Implementation Details (Java 21 / Spring Boot 3)

### Security and Authentication Pipeline
- Stateless authentication using `JwtAuthFilter` registered before `UsernamePasswordAuthenticationFilter`.
- `SecurityConfig` allows unauthenticated access strictly to `/v1/auth/**` and `/actuator/**`. All other endpoints mandate a valid `Authorization: Bearer <token>` header.
- Password hashing is enforced via `BCryptPasswordEncoder`.
- Tokens are signed with HMAC-SHA256 (`Keys.hmacShaKeyFor`) with a 24-hour expiration (`86,400,000 ms`). The subject payload contains the user email.

### Relational Schema & Entities
- Primary keys are UUID Strings (`GenerationType.UUID`).
- **`users`**: Stores `id`, `name`, `email` (unique), `password`, `created_at`. Implements Spring Security `UserDetails`.
- **`positions`**: Stores `id`, `ticker`, `quantity`, `asset_type` (`STOCK`, `FII`, `BDR`), `average_price` (`NUMERIC(19,2)`), and `user_id` (foreign key to `users`). Enforces composite uniqueness: `UNIQUE(user_id, ticker)`.
- **`transactions`**: Immutable ledger records storing `id`, `ticker`, `type` (`BUY`, `SELL`), `quantity`, `asset_type`, `price` (`NUMERIC(38,2)`), `date` (`LocalDate`), `user_id`, and `created_at` (`LocalDateTime`).

### Module Functionality
- **`transaction`**: `TransactionServiceImpl.createTransaction()` persists a trade order and invokes `PositionService.processTransaction()` to update custody balances within the same execution flow.
- **`position`**: Manages custody state:
  - BUY transactions trigger weighted average price recalculation.
  - SELL transactions decrement quantity without altering average price. Rejects transactions resulting in negative balances (no short selling).
  - Resets average price to `0.00` when quantity reaches zero.
- **`portfolio`**:
  - `getSummary(userId)`: Resolves active positions, fetches bulk quotes through `MarketService.getBulkStockData()`, aggregates `totalApplied` ($\sum \text{Qty} \times \text{AveragePrice}$), `totalGross` ($\sum \text{Qty} \times \text{CurrentPrice}$), absolute profit/loss, percentage return, and allocation breakdown grouped by `assetType`.
  - `getHistory(userId)`: Scans all historical transactions, reconstructs portfolio holdings for each of the last 12 months, indexes monthly historical close prices from `apps/market` (`/b3/history`), and returns monthly consolidated equity values.
- **`dividend`**: Resolves active positions, identifies the initial purchase date (`findFirstByUserIdAndTickerAndTypeOrderByDateAsc`), queries `apps/market` (`/b3/dividends/{ticker}?from_date={date}`), and aggregates accrued cash flows.
- **`report`**: Compiles `portfolio.jrxml` with JasperReports, binds position summary parameters, and streams a binary PDF response (`application/pdf`).
- **`market`**: Central facade routing requests to Brapi (`/api/quote/{ticker}`) or `apps/market`. Redis caching is configured with `@Cacheable`:
  - `simpleStockData` (key: `#ticker`)
  - `bulkStockData` (key: `#tickers.hashCode()`)
  - `stockHistory` / `stockHistoryMultiple`
  - `stockDividendsData` (key: `#ticker + '_' + #fromDate`)
  - `userStockNews` (key: `#userId`)

---

## 4. apps/market — Market Microservice Details (Python 3.13 / FastAPI)

- Package management: `uv`.
- Core engine: `yfinance` fetches data by appending the `.SA` suffix for B3 tickers (e.g., `PETR4.SA`). Data structures are parsed with Pandas.
- Endpoints:
  - `GET /b3/quote/{ticker}`: Returns current execution price or historical close for a specific `date` query parameter.
  - `GET /b3/history`: Accepts comma-separated `tickers`, `period` (default `1y`), and `interval` (default `1mo`), returning chronological monthly close points.
  - `GET /b3/dividends/{ticker}`: Parses `ticker.dividends` series, filters payments on or after `from_date` (`dd/MM/yyyy`), returning individual payment dates and values.
  - `GET /b3/news`: Scrapes news items associated with specified tickers from Yahoo Finance feeds.
  - `GET /crypto/quote/{symbol}`: Returns pricing for cryptocurrency pairs (e.g., `BTC-USD`).

---

## 5. apps/web — Frontend Details (Next.js 16 / React 19)

- App Router structure with route groups:
  - `(public)`: Authentication entry points (`/entrar`, `/registrar`).
  - `(protected)`: Application dashboard and management views (`/dashboard`, `/posicoes`, `/transacoes`, `/patrimonio`, `/eventos`, `/noticias`, `/conta`).
- **Middleware & Session Management:**
  - `src/middleware.ts` reads the `token` cookie on each request.
  - Validates session authenticity against backend `/users/me`.
  - Unauthenticated access to protected routes redirects to `/entrar`. Authenticated users accessing login routes redirect to `/dashboard`.
- **Server Actions Architecture (`src/resources/`):**
  - All services (`user.service.ts`, `transaction.service.ts`, `portfolio.service.ts`, etc.) are declared with `"use server"`.
  - Token cookie is handled via `next/headers` (`httpOnly: true`, `secure: false` in dev, `maxAge: 7 days`).
  - Direct server-to-server HTTP calls to `NEXT_PUBLIC_BASE_URL` avoid exposing internal network topologies to client bundles.
- **Client State & Presentation:**
  - Zustand (`user.store.ts`) holds volatile user metadata in client memory.
  - UI constructed with Radix UI headless components styled through Tailwind CSS v4.
  - Recharts renders asset allocation distributions and historical 12-month equity curves.

---

## 6. Financial Computation Constraints & Accounting Rules

1. **Weighted Average Price (Preço Médio - PM) on Purchase (BUY):**
   $$\text{PM}_{\text{new}} = \frac{(\text{Qty}_{\text{current}} \times \text{PM}_{\text{current}}) + (\text{Qty}_{\text{tx}} \times \text{Price}_{\text{tx}})}{\text{Qty}_{\text{current}} + \text{Qty}_{\text{tx}}}$$
2. **Sales (SELL) Treatment:**
   - Under Brazilian tax authority (Receita Federal) rules, selling an asset **does not alter the average acquisition price**.
   - Selling reduces only the custody quantity: $\text{Qty}_{\text{new}} = \text{Qty}_{\text{current}} - \text{Qty}_{\text{tx}}$.
   - Realized profit/loss is calculated on the transaction event:
     $$\text{PnL} = (\text{Price}_{\text{sell}} - \text{PM}) \times \text{Qty}_{\text{sold}}$$
   - If $\text{Qty}_{\text{new}} = 0$, average price resets to zero.
   - If $\text{Qty}_{\text{tx}} > \text{Qty}_{\text{current}}$, the operation must fail (`RuntimeException: Saldo insuficiente`).
3. **Supported Asset Types:**
   - `STOCK`: Brazilian B3 equities.
   - `FII`: Real Estate Investment Funds (Fundos de Investimento Imobiliário).
   - `BDR`: Brazilian Depositary Receipts.

---

## 7. CLI Reference & Task Commands

The project uses Taskfile (`go-task`) with standard pnpm script fallbacks:

| Command | Action | Implementation Target |
| :--- | :--- | :--- |
| `task dev` | Boots all 3 applications concurrently | `pnpm run dev` |
| `task dev:api` | Boots Spring Boot backend | `apps/api/mvnw.cmd spring-boot:run` (or `./mvnw`) |
| `task dev:market` | Boots FastAPI microservice | `uv run --directory apps/market uvicorn src.main:app --reload` |
| `task dev:web` | Boots Next.js development server | `pnpm --filter @consolidador-investimentos/web dev` |
| `task infra:up` | Starts backing containers in background | `docker compose up -d database redis pgadmin` |
| `task infra:down` | Stops backing containers | `docker compose down` |
| `task infra:logs` | Streams container logs | `docker compose logs -f` |
| `task test:api` | Runs Java unit tests | `apps/api/mvnw.cmd test` |
| `task test:market` | Runs Python pytest suite | `cd apps/market && uv run pytest` |
| `task build:api` | Packages backend JAR | `apps/api/mvnw.cmd clean package -DskipTests` |
| `task build:web` | Compiles Next.js production build | `pnpm --filter @consolidador-investimentos/web build` |

### Adding Dependencies in Monorepo
- To install packages in Next.js from repository root:
  ```bash
  pnpm --filter @consolidador-investimentos/web add <package-name>
  ```
- To add Python dependencies:
  ```bash
  cd apps/market && uv add <package-name>
  ```
- To add Maven dependencies:
  Add `<dependency>` block to `apps/api/pom.xml`.
