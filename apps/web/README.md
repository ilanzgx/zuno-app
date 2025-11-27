# ♊ Web - Consolidador de Investimentos

## 📖 Visão Geral

O frontend é uma Single-Page Application (SPA) moderna e responsiva, construída com Next.js e React. Ele fornece a interface com o usuário para visualização e gerenciamento de investimentos, consumindo a API backend para todas as operações de dados.

## ✨ Tecnologias Utilizadas

- **Framework:** Next.js 15 (com App Router e Turbopack)
- **Linguagem:** TypeScript
- **UI:** React 19
- **Estilização:** Tailwind CSS
- **Componentes:** Shadcn UI (componentes reutilizáveis e acessíveis)
- **Formulários:** React Hook Form com Zod para validação
- **Gerenciamento de Estado:** Zustand (para estado global do usuário)

## 🏗️ Estrutura do Projeto

O código-fonte está localizado em `src/` e segue as convenções do App Router do Next.js:

- **`app/`**: Contém todas as rotas e páginas da aplicação.

  - **`(public)/`**: Agrupa as rotas públicas, como:
    - `/`: A landing page da aplicação.
    - `/entrar`: Página de login.
    - `/registrar`: Página de registro de novos usuários.
  - **`(protected)/`**: Agrupa as rotas que exigem autenticação.
    - `/dashboard`: A página principal do usuário após o login, exibindo um resumo da carteira e movimentações.
  - `layout.tsx`: O layout raiz que envolve todas as páginas.
  - `globals.css`: Estilos globais e configuração do Tailwind CSS.

- **`components/ui/`**: Componentes de UI da biblioteca Shadcn, como `Button`, `Card`, `Input`, e `Form`. Eles são a base do sistema de design.

- **`lib/`**: Utilitários, como a função `cn` para mesclar classes do Tailwind CSS.

- **`resources/`**: Contém a lógica de domínio do frontend, incluindo entidades, schemas e serviços para interação com a API.

  - **`position`**: Define entidades (`position.entity.ts`) e serviços (`position.service.ts`) para gerenciar as posições de investimento dos usuários.
  - **`transaction`**: Define entidades (`transaction.entity.ts`) para representar as transações financeiras.
  - **`user`**: Contém entidades (`user.entity.ts`), schemas de validação (`user.schemas.ts`) e serviços (`user.service.ts`) relacionados à autenticação e gerenciamento de usuários.

- **`stores/`**: Contém stores (lojas) de estado global, como `user.store.ts` para dados do usuário, gerenciadas com Zustand.

## 🚀 Como Começar

1. **Instalar Dependências:**
   Navegue até a pasta `apps/web` e execute:

   ```bash
   npm install
   ```

2. **Rodar a Aplicação:**
   Use o script na raiz do monorepo para iniciar o servidor de desenvolvimento:

   ```bash
   npm run start:web
   ```

   A aplicação estará disponível em `http://localhost:3000`.

## 🎨 Componentes e Estilo

A interface é construída com **Shadcn UI**, que fornece um conjunto de componentes de alta qualidade, acessíveis e customizáveis. A estilização é feita primariamente com **Tailwind CSS**, permitindo a criação de interfaces consistentes e modernas de forma utilitária.

As páginas de autenticação (`/entrar` e `/registrar`) demonstram o uso de formulários controlados com **React Hook Form** e validação de schema com **Zod**, garantindo uma experiência de usuário robusta e segura. O gerenciamento de estado global é feito com **Zustand**.
