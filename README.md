# Como Testar

Npm install - Para instalar as dependências

Npm run dev - Para inicializar o projeto

# Tecnologias Utilizadas

- NodeJs v18.16.0
- TypeScript
- KnexJs Sqlite3
- Fastify
- Zod

# Objetivo do Projeto

- API para controle de dieta diária.

# Rotas

## Criar Usuários

- POST http://localhost:3333/user
- GET http://localhost:3333/user

## Rotas Autenticadas

Criar Refeição
- POST http://localhost:3333/diet/lunchs/:userId

Listar Refeição
- GET http://localhost:3333/diet/lunchs/:userId

Editar Refeição
- PUT http://localhost:3333/diet/lunchs/:userId/:id

Deletar Refeição
- DELETE http://localhost:3333/diet/lunchs/:id

Resgatar Métricas de Usuário
- GET http://localhost:3333/diet/lunchs/:userId/metrics

## Rotas Não Autenticadas

Criar Refeição
- POST http://localhost:3333/diet/lunchs

Listar Refeições
- GET http://localhost:3333/diet/lunchs

Listar Refeição Especifica
- GET http://localhost:3333/diet/lunchs/list/:id

Editar Refeição
- PUT http://localhost:3333/diet/lunchs/:id

Deletar Refeição
- DELETE http://localhost:3333/diet/lunchs/:userId/:id