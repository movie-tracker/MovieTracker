# MovieTracker

MovieTracker é uma plataforma web para organizar, acompanhar e avaliar filmes, com autenticação de usuários, dashboard intuitivo e integração completa entre frontend e backend.

## Tecnologias Utilizadas

### Frontend
- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS 4**
- **Radix UI**
- **React Query**
- **React Router DOM**
- **React Hook Form + Zod**
- **i18next** (internacionalização)
- **Axios**

### Backend (repositório /backend)
- **Go 1.24.1**
- **Gin** (framework web)
- **go-jet** (ORM type-safe)
- **JWT** (autenticação)
- **PostgreSQL**
- **Swagger** (documentação)

---

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+
- Yarn ou npm
- Backend rodando (veja instruções no README do backend)

### Instalação

```bash
# Instale as dependências
npm install
# ou
yarn install
```

### Rodando em modo desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

### Build para produção

```bash
npm run build
# ou
yarn build
```

---

## Estrutura de Pastas

```
frontend/
├── public/           # Arquivos estáticos
├── src/
│   ├── components/   # Componentes reutilizáveis
│   ├── context/      # Contextos globais (ex: autenticação)
│   ├── hooks/        # Custom hooks
│   ├── pages/        # Páginas principais (Home, Login, Register, etc)
│   ├── services/     # Comunicação com API
│   ├── types/        # Tipos TypeScript
│   ├── utils/        # Funções utilitárias
│   └── App.tsx       # Configuração de rotas
└── ...
```

---

## Principais Rotas do Frontend
- `/intro` — Página de introdução
- `/login` — Login de usuário
- `/register` — Cadastro de usuário
- `/home` — Dashboard principal
- `/my-movies` — Lista pessoal de filmes
- `/movie/:id` — Detalhes do filme

---

## Integração com o Backend
O frontend se comunica com a API REST do backend (Go + Gin). Certifique-se de que o backend está rodando em `http://localhost:8888` (ou ajuste a URL nos serviços do frontend).

### Endpoints principais do backend
- `POST /api/auth/login` — Login de usuário
- `POST /api/auth/register` — Cadastro de usuário
- `GET /api/users/profile` — Perfil do usuário autenticado
- `GET /api/movies` — Listar filmes
- `GET /api/movies/search?query=...` — Buscar filmes
- `GET /api/movies/:id` — Detalhes de um filme
- `GET /api/watchlist` — Listar watchlist do usuário
- `POST /api/watchlist` — Adicionar filme à watchlist
- `PUT /api/watchlist/:id` — Atualizar item da watchlist
- `DELETE /api/watchlist/:id` — Remover da watchlist
- `PATCH /api/watchlist/:id/status` — Atualizar status (assistido, etc)
- `PATCH /api/watchlist/:id/favorite` — Marcar/desmarcar favorito
- `PATCH /api/watchlist/:id/rating` — Avaliar filme

A documentação completa da API está disponível via Swagger em `/swagger/index.html` no backend.

---

## Contribuição
Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

---

## Licença
MIT
