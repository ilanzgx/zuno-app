<div align="center">
   <a id="readme-top"></a>
   <h3>Zuno - Consolidador de Investimentos</h3>
   <p>Centralize sua vida financeira em uma única plataforma!</p>

   <p>
      <a href="https://github.com/ilanzgx/zuno-app"><strong>Explore a documentação »</strong></a>
      <br />
      <br />
      <a href="https://github.com/ilanzgx/zuno-app/issues/new?labels=bug">Reportar Bug</a>
      ·
      <a href="https://github.com/ilanzgx/zuno-app/issues/new?labels=enhancement">Solicitar Feature</a>
   </p>
</div>

---

## 📌 Sobre o Projeto

O **Zuno** é uma aplicação completa (monorepo) projetada para centralizar a vida financeira de um investidor. O objetivo é agregar dados de corretoras e bourses para fornecer uma visão holística e unificada do seu patrimônio.

### ✨ O que oferecemos?

- **Visão em Tempo Real**: Desempenho do portfólio, análise de alocação de ativos e histórico de pagamentos de dividendos.
- **Gestão Simplificada**: Interface limpa e minimalista com painéis e gráficos interativos.
- **Market Data Isolado**: Microserviço dedicado (FastAPI) extraindo dados da B3 (Ações, FIIs) e Criptomoedas sob demanda.

---

## 🛠️ Tecnologias

### Web (Frontend)

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)

### API (Backend Core)

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

### Market API (Data Microservice)

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)

---

## 🏗️ Estrutura do Projeto

| Aplicação  | Escopo                                                                                        | Diretório      |
| ---------- | --------------------------------------------------------------------------------------------- | -------------- |
| **API**    | Backend transacional. Trata os usuários, carteiras, ativos (CRUD) e transações (Spring Boot). | `apps/api/`    |
| **Market** | Microserviço proxy de dados em Python. Busca informações em tempo real via yfinance.          | `apps/market/` |
| **Web**    | UI focada no usuário final e projeção de dados através de Server Components.                  | `apps/web/`    |

---

## 🚀 Como Executar

O projeto já contém os scripts necessários no diretório raiz para orquestrar todas as camadas do sistema de uma vez apenas.

### Passo 1: Pré-requisitos

- **Java 21+**, **Node.js 22+**, **Python 3.13+**
- **Docker** para lidar com os serviços acessórios
- **uv** instalado globalmente (`pip install uv`)

### Passo 2: Clonando e configurando

```bash
git clone https://github.com/ilanzgx/zuno-app.git
cd zuno-app

# Instale as dependências unificadas de script (npm)
npm install

# Suba os containers locais
docker-compose -d up

# Crie as variáveis de ambiente em apps/api/.env e apps/web/.env.development
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.development
```

### Passo 3: Inicialização Concorrente

Basta rodar o comando abaixo na raiz do repositório para inicializar o Next.js, o servidor Spring Boot e o Uvicorn do FastAPI:

```bash
npm run dev
```

---

## 🤝 Contribuindo

Se você tiver uma sugestão para melhorar o projeto, por favor faça um `fork` do repositório e crie um `pull request`. Você também pode simplesmente abrir uma `issue`!

## 📝 Licença

Lançado sob a **GNU Affero General Public License v3.0 (AGPLv3)** — [Ver detalhes](./LICENSE).

---

<p align="center">Construído com ❤️ por <a href="https://github.com/ilanzgx">Ilan Fonseca</a></p>
