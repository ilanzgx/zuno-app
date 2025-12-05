<!-- Improved compatibility of back to top link -->

<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![ISC License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->

<br />
<div align="center">
   <h3 align="center">Zuno - Consolidador de Investimentos</h3>

  <p align="center">
    Centralize sua vida financeira em uma única plataforma!
    <br />
    <a href="https://github.com/ilanzgx/zuno-app"><strong>Explore a documentação »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ilanzgx/zuno-app">Ver Demo</a>
    ·
    <a href="https://github.com/ilanzgx/zuno-app/issues/new?labels=bug">Reportar Bug</a>
    ·
    <a href="https://github.com/ilanzgx/zuno-app/issues/new?labels=enhancement">Solicitar Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Índice</summary>
  <ol>
    <li>
      <a href="#sobre-o-projeto">Sobre o Projeto</a>
      <ul>
        <li><a href="#construído-com">Construído Com</a></li>
        <li><a href="#arquitetura">Arquitetura</a></li>
      </ul>
    </li>
    <li>
      <a href="#começando">Começando</a>
      <ul>
        <li><a href="#pré-requisitos">Pré-requisitos</a></li>
        <li><a href="#instalação">Instalação</a></li>
      </ul>
    </li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#api-endpoints">API Endpoints</a></li>
    <li><a href="#estrutura-do-projeto">Estrutura do Projeto</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contribuindo">Contribuindo</a></li>
    <li><a href="#licença">Licença</a></li>
    <li><a href="#contato">Contato</a></li>
    <li><a href="#agradecimentos">Agradecimentos</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## Sobre o Projeto

[![Product Screenshot][product-screenshot]](https://github.com/ilanzgx/zuno-app)

O **Zuno** é uma aplicação full-stack projetada para centralizar a vida financeira de um investidor em uma única plataforma. O objetivo principal é agregar dados de diversas fontes, como corretoras e outras instituições financeiras, para fornecer uma visão holística e unificada do patrimônio.

**Por que Zuno?**

- **Centralização Total**: Não perca mais tempo alternando entre múltiplas plataformas e planilhas complexas
- **Visão em Tempo Real**: Acompanhe a performance de suas carteiras, análise de alocação de ativos e recebimento de dividendos em tempo real
- **Insights Inteligentes**: Obtenha análises valiosas para otimizar suas estratégias de investimento
- **Gestão Simplificada**: Simplifique a gestão de portfólios complexos com uma interface moderna e intuitiva

A plataforma oferece dashboards interativos, rastreamento completo de transações, monitoramento de eventos (dividendos), e integração com dados de mercado em tempo real da B3 e criptomoedas.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

### Construído Com

O projeto utiliza tecnologias de ponta para garantir performance, escalabilidade e excelente experiência do usuário:

#### Frontend

- [![Next][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![TypeScript][TypeScript]][TypeScript-url]
- [![TailwindCSS][TailwindCSS]][Tailwind-url]

#### Backend

- [![Spring][Spring]][Spring-url]
- [![Java][Java]][Java-url]
- [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
- [![Redis][Redis]][Redis-url]

#### Market API

- [![FastAPI][FastAPI]][FastAPI-url]
- [![Python][Python]][Python-url]

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

### Arquitetura

O projeto é composto por **três aplicações principais** em um monorepo:

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
   - Dashboard interativo com gráficos
   - Visualização de posições e patrimônio
   - Gerenciamento de transações
   - Análise de eventos (dividendos)

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- GETTING STARTED -->

## Começando

Para obter uma cópia local funcionando, siga estes passos simples.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- **Java 21+**
- **Node.js 20+**
- **Python 3.13+**
- **Maven**
- **Docker** (para PostgreSQL e Redis)

Verifique as versões instaladas:

```bash
java --version
node --version
python --version
docker --version
```

### Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/ilanzgx/zuno-app.git
   cd zuno-app
   ```

2. **Instale as dependências do Frontend (Next.js)**

   ```bash
   cd apps/web
   npm install
   cd ../..
   ```

3. **Instale as dependências do Backend (Spring Boot)**

   ```bash
   cd apps/api
   mvnw dependency:resolve
   cd ../..
   ```

4. **Instale as dependências da Market API (FastAPI)**

   ```bash
   cd apps/market
   pip install uv
   uv sync
   cd ../..
   ```

5. **Suba os containers do banco de dados (PostgreSQL e Redis)**

   ```bash
   docker-compose up -d
   ```

6. **Configure as variáveis de ambiente**

   ```bash
   cd apps/api
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

7. **Inicie todas as aplicações**

   ```bash
   npm run dev
   ```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- USAGE EXAMPLES -->

## Uso

### Comandos Disponíveis

- **Rodar todas as aplicações:** `npm run dev`
- **Rodar apenas o backend:** `npm run start:api`
- **Rodar apenas o frontend:** `npm run start:web`
- **Rodar apenas a Market API:** `npm run start:market`

### Funcionalidades Principais

**Dashboard Financeiro**

- Visualize seu patrimônio total e rentabilidade
- Gráficos interativos de evolução patrimonial
- Distribuição de ativos por tipo

**Gestão de Transações**

- Cadastre compras e vendas de ativos
- Preços atualizados automaticamente via integração com Yahoo Finance
- Histórico completo de movimentações

**Monitoramento de Posições**

- Acompanhe suas posições em tempo real
- Visualize ganhos e perdas por ativo
- Análise de rentabilidade individual

**Eventos de Dividendos**

- Rastreie todos os dividendos recebidos
- Histórico completo de proventos
- Análise de rendimento passivo

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- API ENDPOINTS -->

## API Endpoints

### API Principal (Spring Boot)

A API fornece os seguintes endpoints:

- **Autenticação:** `/v1/auth`

  - `POST /v1/auth/register` - Registro de novo usuário
  - `POST /v1/auth/login` - Login de usuário

- **Usuários:** `/v1/users`

  - `GET /v1/users/me` - Informações do usuário autenticado

- **Posições:** `/v1/positions`

  - `GET /v1/positions` - Lista todas as posições do usuário

- **Transações:** `/v1/transactions`

  - `GET /v1/transactions` - Lista todas as transações
  - `POST /v1/transactions` - Cria nova transação

- **Portfólio:** `/v1/portfolio`

  - `GET /v1/portfolio/summary` - Resumo do portfólio
  - `GET /v1/portfolio/history` - Histórico do portfólio

- **Dividendos:** `/v1/dividends`

  - `GET /v1/dividends` - Lista todos os dividendos

- **Mercado:** `/v1/market`

  - `GET /v1/market/{ticker}` - Dados de mercado de um ativo

### Market API (FastAPI)

A Market API fornece dados em tempo real do mercado financeiro:

- **Cotações B3:** `GET /b3/quote/{ticker}` - Obtém cotação de ações da B3
- **Cotações por Data:** `GET /b3/quote/{ticker}/date/{date}` - Cotação histórica
- **Dividendos B3:** `GET /b3/dividends/{ticker}` - Histórico de dividendos
- **Notícias:** `GET /b3/news/{ticker}` - Notícias de um ativo
- **Cotações Crypto:** `GET /crypto/quote/{ticker}` - Cotação de criptomoedas

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- PROJECT STRUCTURE -->

## Estrutura do Projeto

O projeto é um **monorepo** com a seguinte estrutura:

```text
consolidador-investimentos/
├── apps/
│   ├── api/                    # Backend Spring Boot
│   │   ├── src/
│   │   │   └── main/
│   │   │       └── java/
│   │   │           └── com/ilanzgx/demo/
│   │   │               ├── auth/
│   │   │               ├── config/
│   │   │               ├── dividend/
│   │   │               ├── market/
│   │   │               ├── portfolio/
│   │   │               ├── position/
│   │   │               ├── transaction/
│   │   │               └── user/
│   │   └── pom.xml
│   │
│   ├── market/                 # Market API (FastAPI)
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── routes/
│   │   │   ├── core/
│   │   │   └── services/
│   │   ├── pyproject.toml
│   │   └── uv.lock
│   │
│   └── web/                    # Frontend Next.js
│       ├── src/
│       │   ├── app/
│       │   │   ├── (protected)/
│       │   │   └── (public)/
│       │   ├── components/
│       │   ├── lib/
│       │   ├── resources/
│       │   └── stores/
│       └── package.json
│
├── docker-compose.yml
├── package.json
└── README.md
```

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [x] Autenticação e autorização com JWT
- [x] CRUD de transações e posições
- [x] Dashboard com visualização de patrimônio
- [x] Integração com dados de mercado (B3)
- [x] Sistema de dividendos
- [x] Gráficos interativos de evolução patrimonial
- [ ] Importação automática de extratos de corretoras
- [ ] Análise de rentabilidade por setor
- [ ] Alertas de preços e dividendos
- [ ] Aplicativo mobile
- [ ] Aplicativo desktop
- [ ] Integração com mais fontes de dados
- [ ] Recomendações de rebalanceamento de carteira
- [ ] Suporte a criptomoedas

Veja as [issues abertas](https://github.com/ilanzgx/zuno-app/issues) para uma lista completa de features propostas e problemas conhecidos.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- CONTRIBUTING -->

## Contribuindo

Contribuições são o que tornam a comunidade open source um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será **muito apreciada**.

Se você tiver uma sugestão para melhorar o projeto, por favor faça um fork do repositório e crie um pull request. Você também pode simplesmente abrir uma issue com a tag "enhancement".
Não se esqueça de dar uma estrela ao projeto! Obrigado!

1. Fork o Projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas Mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Principais Contribuidores:

<a href="https://github.com/ilanzgx/zuno-app/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ilanzgx/zuno-app" alt="contrib.rocks image" />
</a>

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- LICENSE -->

## Licença

Distribuído sob a Licença ISC. Veja `LICENSE` para mais informações.

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- CONTACT -->

## Contato

Ilan Fonseca - [@ilanzgx](https://github.com/ilanzgx)

Link do Projeto: [https://github.com/ilanzgx/zuno-app](https://github.com/ilanzgx/zuno-app)

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Agradecimentos

Recursos e ferramentas que tornaram este projeto possível:

- [Next.js Documentation](https://nextjs.org/docs)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Yahoo Finance API (yfinance)](https://github.com/ranaroussi/yfinance)
- [Recharts - React Charts Library](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React Icons](https://lucide.dev/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

<p align="right">(<a href="#readme-top">voltar ao topo</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/ilanzgx/zuno-app.svg?style=for-the-badge
[contributors-url]: https://github.com/ilanzgx/zuno-app/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ilanzgx/zuno-app.svg?style=for-the-badge
[forks-url]: https://github.com/ilanzgx/zuno-app/network/members
[stars-shield]: https://img.shields.io/github/stars/ilanzgx/zuno-app.svg?style=for-the-badge
[stars-url]: https://github.com/ilanzgx/zuno-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/ilanzgx/zuno-app.svg?style=for-the-badge
[issues-url]: https://github.com/ilanzgx/zuno-app/issues
[license-shield]: https://img.shields.io/github/license/ilanzgx/zuno-app.svg?style=for-the-badge
[license-url]: https://github.com/ilanzgx/zuno-app/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/ilan-fonseca-665025154
[product-screenshot]: https://i.imgur.com/4eS2AuH.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Spring]: https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white
[Spring-url]: https://spring.io/
[Java]: https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white
[Java-url]: https://www.oracle.com/java/
[PostgreSQL]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Redis]: https://img.shields.io/badge/Redis-CC0000?style=for-the-badge&logo=redis&logoColor=white
[Redis-url]: https://redis.io/
[FastAPI]: https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white
[FastAPI-url]: https://fastapi.tiangolo.com/
[Python]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://www.python.org/
