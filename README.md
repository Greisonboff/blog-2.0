# 📝 Blog 2.0

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Uma plataforma de blog moderna e robusta, desenvolvida com foco em performance e experiência do usuário (UX). O Blog 2.0 permite que usuários criem contas, gerenciem seus perfis e publiquem conteúdos de forma dinâmica, oferecendo uma interface limpa e intuitiva para leitura e interação.

---

## 💡 Funcionalidades Principais

- 🔐 **Autenticação Completa:** Sistema de login e cadastro seguro, com suporte a persistência de sessão ("Lembrar de mim").
- ✍️ **Gestão de Conteúdo (CRUD):** Criação, edição e exclusão de publicações com suporte a upload de imagens.
- 👤 **Perfil Customizável:** Edição de dados do usuário e alteração dinâmica de avatar.
- 💬 **Interatividade:** Sistema integrado de comentários e curtidas para engajamento da comunidade.
- 📑 **Navegação Otimizada:** Paginação inteligente no servidor para carregamento rápido de grandes volumes de posts.
- 🚀 **Feedback Visual:** Estados de carregamento (Skeleton/Loaders) e notificações em tempo real via Toasts.
- 📱 **Design Responsivo:** Interface adaptável construída com Tailwind CSS para uma experiência perfeita em mobile, tablet e desktop.

---

## 🛠️ Tecnologias e Ferramentas

| Categoria            | Tecnologia                                          | Descrição                                               |
| :------------------- | :-------------------------------------------------- | :------------------------------------------------------ |
| **Frontend**         | [React](https://reactjs.org/)                       | Biblioteca principal para interface.                    |
| **Linguagem**        | [TypeScript](https://www.typescriptlang.org/)       | Tipagem estática para maior segurança e escalabilidade. |
| **Build Tool**       | [Vite](https://vitejs.dev/)                         | Bundler ultrarrápido para desenvolvimento moderno.      |
| **Estilização**      | [Tailwind CSS](https://tailwindcss.com/)            | Framework utilitário para design responsivo.            |
| **Componentes**      | [shadcn/ui](https://ui.shadcn.com/)                 | Componentes de interface acessíveis e reutilizáveis.    |
| **State Management** | [TanStack Query](https://tanstack.com/query/latest) | Gerenciamento de estado assíncrono e cache de dados.    |
| **Roteamento**       | [React Router](https://reactrouter.com/)            | Navegação dinâmica entre páginas.                       |
| **Ícones**           | [Lucide React](https://lucide.dev/)                 | Biblioteca de ícones vetoriais leves.                   |

---

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (Versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 🔧 Instalação

1.  **Clone o repositório:**

    ```bash
    git clone <https://github.com/seu-usuario/blog-2.0.git>
    cd blog-2.0
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configuração de Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto com base no exemplo abaixo:
    ```env
    # URL base da API do backend
    VITE_API_URL=<https://sua-api-blog.com/api>
    ```

### 🏃 Iniciando a Aplicação

Para rodar o projeto em ambiente de desenvolvimento:

```bash
npm run dev
```
