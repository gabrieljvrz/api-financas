# 💰 API de Finanças Pessoais

> API RESTful para controle financeiro pessoal, desenvolvida como desafio técnico para vaga de estágio Back-end. Permite que usuários registrem, categorizem e acompanhem suas receitas e despesas com segurança e organização.

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura e Organização](#arquitetura-e-organização)
- [Requisitos do Desafio](#requisitos-do-desafio)
- [Como Executar](#como-executar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Testes](#testes)
- [Segurança](#segurança)
- [Docker](#docker)
- [Melhorias Futuras](#melhorias-futuras)

---

## Sobre o Projeto

Este projeto é uma **API RESTful de controle financeiro pessoal**, construída com **TypeScript** e **Node.js (Express)**. O objetivo é fornecer uma plataforma segura e bem estruturada onde cada usuário pode gerenciar suas próprias transações financeiras — entradas e saídas — com categorização, paginação e um dashboard de resumo consolidado.

O projeto foi desenvolvido seguindo boas práticas de engenharia de software: separação clara de responsabilidades, injeção de dependências, validação rigorosa de dados e cobertura de testes unitários nas camadas de serviço e middleware.

---

## Funcionalidades

**Autenticação de Usuários**
- Cadastro de novos usuários com nome, e-mail e senha
- Login com geração de token JWT (validade de 24 horas)
- Proteção de todas as rotas de transações via JWT Bearer Token

**Gerenciamento de Transações**
- Criação de transações do tipo `ENTRADA` ou `SAIDA`
- Listagem paginada das transações do usuário autenticado
- Busca de transação específica por ID (com validação de propriedade)
- Atualização completa de uma transação existente
- Remoção de transações

**Filtros e Paginação**
- Filtro por mês e ano nas listagens
- Paginação configurável via query params (`page`, `limit`)
- Metadados de paginação na resposta (`total`, `paginaAtual`, `totalPaginas`, `limite`)

**Resumo Financeiro**
- Endpoint dedicado que retorna, via agregação no banco, o total de entradas, total de saídas e saldo atual

**Categorização de Transações**
- Categorias disponíveis: `MORADIA`, `ALIMENTACAO`, `TRANSPORTE`, `LAZER`, `ESPORTES`, `SAUDE`, `EDUCACAO`, `ASSINATURAS`, `OUTROS`
- Status da transação: `PAGO` ou `PENDENTE`

**Documentação Swagger**
- Interface Swagger UI disponível em `/api-docs`
- Todos os endpoints documentados com exemplos de request/response

**Seed de Dados**
- Script de seed que popula o banco com um usuário de teste e transações de exemplo, facilitando a avaliação

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **Node.js** | 20 (LTS) | Runtime JavaScript no servidor |
| **TypeScript** | ^6.0 | Tipagem estática e segurança em tempo de desenvolvimento |
| **Express** | ^5.2 | Framework HTTP para construção da API |
| **Prisma ORM** | ^7.8 | Mapeamento objeto-relacional e gerenciamento de migrations |
| **MySQL / MariaDB** | 8.0 / 3.x | Banco de dados relacional principal |
| **JWT (jsonwebtoken)** | ^9.0 | Autenticação stateless via tokens |
| **Bcrypt** | ^6.0 | Hash seguro de senhas |
| **Zod** | ^4.4 | Validação de schema dos dados de entrada |
| **Jest + ts-jest** | ^30 / ^29 | Framework de testes unitários |
| **Swagger UI Express** | ^5.0 | Documentação interativa da API |
| **Docker + Docker Compose** | — | Containerização e orquestração do ambiente |
| **tsx** | ^4.22 | Execução de TypeScript em desenvolvimento |
| **dotenv** | ^17.4 | Gerenciamento de variáveis de ambiente |
| **cors** | ^2.8 | Habilitação de Cross-Origin Resource Sharing |

---

## Arquitetura e Organização

O projeto segue uma **arquitetura em camadas**, inspirada nos princípios de Clean Architecture, garantindo separação clara de responsabilidades e alta testabilidade.

```
api-financas/
├── prisma/
│   ├── migrations/          # Histórico de migrations do banco
│   ├── schema.prisma        # Definição dos modelos de dados
│   └── seed.ts              # Script para popular o banco com dados de teste
├── src/
│   ├── config/
│   │   ├── database.ts      # Configuração e instância do Prisma Client
│   │   └── env.ts           # Validação das variáveis de ambiente via Zod
│   ├── controllers/         # Camada de entrada: recebe requests e retorna responses
│   │   ├── TransacaoController.ts
│   │   └── UsuarioController.ts
│   ├── middlewares/         # Interceptadores de requisição
│   │   ├── auth.middleware.ts     # Verificação e decodificação do JWT
│   │   ├── validate.middleware.ts # Validação do corpo da requisição via Zod
│   │   └── __tests__/       # Testes unitários dos middlewares
│   ├── repositories/        # Camada de acesso a dados (abstração do Prisma)
│   │   ├── TransacaoRepository.ts
│   │   └── UsuarioRepository.ts
│   ├── routes/              # Definição e agrupamento das rotas
│   │   ├── transacao.routes.ts
│   │   └── usuario.routes.ts
│   ├── schemas/             # Schemas de validação Zod
│   │   └── transacao.schema.ts
│   ├── services/            # Camada de regras de negócio
│   │   ├── TransacaoService.ts
│   │   ├── UsuarioService.ts
│   │   └── __tests__/       # Testes unitários dos services
│   └── server.ts            # Ponto de entrada da aplicação
├── swagger.json             # Especificação OpenAPI 3.0
├── Dockerfile
├── docker-compose.yml
├── jest.config.cjs
├── tsconfig.json
└── .env.example
```

**Fluxo de uma requisição:**

```
Request HTTP → Router → Middleware (auth/validate) → Controller → Service → Repository → Banco de Dados
```

**Responsabilidades de cada camada:**

- **Routes**: Define os verbos HTTP, paths e encadeia middlewares e controllers
- **Controllers**: Extrai dados da requisição, chama o service e formata a resposta
- **Services**: Contém a lógica de negócio, validações de domínio e orquestra repositórios
- **Repositories**: Única camada que se comunica com o banco via Prisma, isolando queries
- **Middlewares**: Lógica transversal (autenticação JWT, validação de schema, etc.)
- **Schemas**: Contratos de validação dos dados de entrada, reutilizáveis por qualquer rota

**Padrão de injeção de dependências:** cada camada recebe suas dependências via construtor, o que facilita a substituição por mocks nos testes unitários e evita acoplamento direto.

---

## Requisitos do Desafio

### ✅ Requisitos Funcionais

| Requisito | Status | Detalhe |
|---|---|---|
| Cadastro de usuário (nome, e-mail, senha) | ✅ Implementado | `POST /usuarios` |
| Autenticação de usuário | ✅ Implementado | `POST /usuarios/login` — retorna JWT |
| Rotas protegidas por autenticação | ✅ Implementado | Middleware `authMiddleware` em todas as rotas de transação |
| Criar transação (entrada/saída) | ✅ Implementado | `POST /transacoes` |
| Listar transações do usuário | ✅ Implementado | `GET /transacoes` |
| Atualizar transação | ✅ Implementado | `PUT /transacoes/:id` |
| Remover transação | ✅ Implementado | `DELETE /transacoes/:id` |
| Resumo financeiro (entradas, saídas, saldo) | ✅ Implementado | `GET /transacoes/resumo` |

### ✅ Requisitos Técnicos

| Requisito | Status |
|---|---|
| TypeScript | ✅ |
| Express (Node.js) | ✅ |
| Banco de dados relacional (MySQL/MariaDB) | ✅ |
| Rotas privadas (autenticação/autorização) | ✅ |
| Docker | ✅ |
| Testes unitários | ✅ |

### ⭐ Diferenciais Implementados

| Diferencial | Detalhe |
|---|---|
| **Paginação e filtros** | Query params `page`, `limit`, `mes`, `ano` |
| **Boas práticas de segurança** | Hash de senha com bcrypt (salt rounds: 10), JWT, validação com Zod |
| **Separação de camadas** | Controller → Service → Repository |
| **Organização de módulos** | Cada domínio com sua rota, controller, service e repository |
| **Seeds** | `npx prisma db seed` popula usuário e transações de exemplo |
| **Documentação Swagger** | Interface interativa em `/api-docs` (OpenAPI 3.0) |
| **Validação de variáveis de ambiente** | Schema Zod em `src/config/env.ts` — aplicação não inicia com env inválido |
| **Categorização de transações** | Enum `Categoria` com 9 opções |
| **Status de pagamento** | Enum `StatusTransacao` (`PAGO` / `PENDENTE`) |
| **Cobertura de testes** | 100% de statements e funções nos services e middlewares |

---

## Como Executar

### Pré-requisitos

- Node.js >= 20
- npm >= 9
- Docker e Docker Compose (para execução via container)

### Clonando o repositório

```bash
git clone https://github.com/gabrieljvrz/api-financas
cd api-financas
```

### Configurando variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais. Veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente) para detalhes.

---

### 🐳 Executando com Docker (recomendado)

Sobe a API e o banco MySQL em containers isolados:

```bash
docker compose up --build
```

O Docker Compose irá:
1. Subir o container do **MySQL 8.0**
2. Aguardar o banco estar saudável (healthcheck)
3. Subir o container da **API**, executar as migrations e iniciar o servidor

A API estará disponível em `http://localhost:3000`.

Para encerrar:

```bash
docker compose down
```

---

### 💻 Executando sem Docker

**1. Instale as dependências:**

```bash
npm install
```

**2. Configure o banco de dados:**

Certifique-se de ter um servidor MySQL ou MariaDB rodando e preencha o `.env` corretamente.

**3. Execute as migrations:**

```bash
npx prisma migrate deploy
```

**4. (Opcional) Gere o Prisma Client:**

```bash
npx prisma generate
```

**5. (Opcional) Popule o banco com dados de teste:**

```bash
npx prisma db seed
```

Isso cria o usuário `admin@teste.com` com senha `123456` e 4 transações de exemplo.

**6. Inicie o servidor em desenvolvimento:**

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

---

### 📚 Acessando o Swagger

Com o servidor rodando, acesse:

```
http://localhost:3000/api-docs
```

---

### 🧪 Executando os Testes

```bash
# Rodar todos os testes
npm test

# Rodar em modo watch (re-executa ao salvar)
npm run test:watch

# Rodar com relatório de cobertura
npm run test:cov
```

---

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `DATABASE_URL` | URL completa de conexão com o banco (usada pelo Prisma migrations) | `mysql://usuario:senha@localhost:3306/financas` |
| `DATABASE_HOST` | Host do banco de dados | `localhost` |
| `DATABASE_USER` | Usuário do banco de dados | `root` |
| `DATABASE_PASSWORD` | Senha do banco de dados | `root` |
| `DATABASE_NAME` | Nome do banco de dados | `financas` |
| `DATABASE_PORT` | Porta do banco de dados | `3306` |
| `JWT_SECRET` | Chave secreta para assinar e verificar tokens JWT | `sua_chave_secreta_aqui` |
| `PORT` | Porta em que a API irá escutar | `3000` |

> **Atenção:** O arquivo `src/config/env.ts` valida as variáveis obrigatórias na inicialização via Zod. Se alguma estiver ausente ou inválida, a aplicação não sobe e exibe o erro detalhado no console.

---

## Endpoints da API

### Autenticação & Usuários

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/usuarios` | Cadastrar novo usuário | ❌ Pública |
| `POST` | `/usuarios/login` | Autenticar e obter token JWT | ❌ Pública |

**Exemplo: Cadastro de usuário**

```json
// POST /usuarios
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "minhasenha123"
}

// Response 201
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "criadoEm": "2026-05-22T10:00:00.000Z",
  "atualizadoEm": "2026-05-22T10:00:00.000Z"
}
```

**Exemplo: Login**

```json
// POST /usuarios/login
{
  "email": "joao@exemplo.com",
  "senha": "minhasenha123"
}

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Transações (todas requerem `Authorization: Bearer <token>`)

| Método | Rota | Descrição | Query Params |
|---|---|---|---|
| `POST` | `/transacoes` | Criar nova transação | — |
| `GET` | `/transacoes` | Listar transações (paginado) | `page`, `limit`, `mes`, `ano` |
| `GET` | `/transacoes/resumo` | Resumo financeiro | — |
| `GET` | `/transacoes/:id` | Buscar transação por ID | — |
| `PUT` | `/transacoes/:id` | Atualizar transação | — |
| `DELETE` | `/transacoes/:id` | Remover transação | — |

**Exemplo: Criar transação**

```json
// POST /transacoes
// Header: Authorization: Bearer <token>
{
  "descricao": "Salário mensal",
  "valor": 5000,
  "tipo": "ENTRADA",
  "data": "2026-05-01T10:00:00.000Z",
  "categoria": "OUTROS"
}

// Response 201
{
  "id": 1,
  "descricao": "Salário mensal",
  "valor": "5000",
  "tipo": "ENTRADA",
  "categoria": "OUTROS",
  "status": "PENDENTE",
  "usuarioId": 1,
  "data": "2026-05-01T10:00:00.000Z"
}
```

**Exemplo: Listar com filtros**

```
GET /transacoes?page=1&limit=5&mes=5&ano=2026
```

```json
// Response 200
{
  "dados": [ ... ],
  "meta": {
    "total": 4,
    "paginaAtual": 1,
    "totalPaginas": 1,
    "limite": 5
  }
}
```

**Exemplo: Resumo financeiro**

```json
// GET /transacoes/resumo
// Response 200
{
  "totalEntradas": 11500.00,
  "totalSaidas": 3700.00,
  "saldoAtual": 7800.00
}
```

---

## Testes

### Estratégia

Os testes são **unitários**, isolando cada camada via mocks. O objetivo é validar a lógica de negócio (services) e o comportamento dos middlewares sem dependência de banco de dados ou rede.

A configuração (`jest.config.cjs`) exclui intencionalmente controllers, repositories e arquivos de configuração da cobertura, pois estas camadas são fine dependentes de infraestrutura (banco de dados, Express request/response) e seriam mais adequadas para testes de integração/e2e.

### Cobertura (foco das suites testadas)

| Arquivo | Statements | Branches | Functions | Lines |
|---|---|---|---|---|
| `services/UsuarioService.ts` | 100% | 100% | 100% | 100% |
| `services/TransacaoService.ts` | 100% | 93.75% | 100% | 100% |
| `middlewares/auth.middleware.ts` | 100% | 100% | 100% | 100% |
| `middlewares/validate.middleware.ts` | 100% | 100% | 100% | 100% |
| **Total (camadas testadas)** | **100%** | **96.4%** | **100%** | **100%** |

### Casos testados

**UsuarioService:** criação com sucesso, e-mail duplicado, login com credenciais válidas, e-mail inexistente, senha incorreta.

**TransacaoService:** criação com valor inválido, criação com sucesso, cálculo de resumo com entradas e saídas, resumo com dados vazios, resumo com valores nulos do banco, listagem com paginação padrão, listagem com filtro de mês/ano, busca por ID encontrada, busca por ID não encontrada, atualização com sucesso, deleção com sucesso.

**authMiddleware:** token ausente, token mal formatado, token inválido/expirado, token válido com injeção do `usuarioId`.

**validateMiddleware:** dados válidos passam, dados inválidos bloqueiam com 400, erro inesperado retorna 500.

### Executando os testes

```bash
npm test                 # Execução única
npm run test:watch       # Modo watch
npm run test:cov         # Com relatório de cobertura (HTML em /coverage)
```

---

## Segurança

**Hash de senhas com Bcrypt**
As senhas nunca são armazenadas em texto plano. São processadas com `bcrypt.hash()` usando 10 salt rounds antes de serem salvas no banco. Na autenticação, `bcrypt.compare()` verifica a correspondência sem expor a senha original.

**Autenticação JWT**
Tokens são gerados com `jsonwebtoken`, assinados com a chave `JWT_SECRET` e expiram em 24 horas. O middleware `authMiddleware` intercepta todas as rotas protegidas, verifica a assinatura, valida a expiração e injeta o `usuarioId` no objeto de requisição.

**Validação de dados de entrada**
Todos os endpoints que recebem body passam pelo middleware `validate()`, que usa schemas Zod para garantir tipos corretos, valores mínimos e formatos esperados (ex: data em ISO 8601). Dados inválidos são rejeitados antes de chegarem ao controller, retornando erros formatados por campo.

**Isolamento por usuário**
Todas as operações de transação usam o `usuarioId` extraído do token JWT, nunca do body da requisição. A busca por ID sempre filtra `{ id, usuarioId }`, garantindo que um usuário jamais acesse dados de outro.

**Remoção da senha nas respostas**
Ao criar um usuário, a senha (mesmo hasheada) é excluída do objeto de retorno via destructuring antes de enviar a resposta ao cliente.

**Validação de variáveis de ambiente**
O arquivo `src/config/env.ts` usa Zod para validar todas as variáveis obrigatórias na inicialização. A aplicação não sobe com configuração incompleta, evitando comportamentos indefinidos em produção.

**Exclusão em cascata**
O schema do Prisma define `onDelete: Cascade` na relação `Transacao → Usuario`. Ao remover um usuário, todas as suas transações são automaticamente excluídas, evitando registros órfãos.

---

## Docker

### Estrutura

O ambiente dockerizado é composto por dois serviços definidos no `docker-compose.yml`:

**mysql:** Imagem oficial `mysql:8.0` com healthcheck via `mysqladmin ping`. O dado é persistido em um volume nomeado `mysql_data`, sobrevivendo a reinicializações do container.

**api:** Construída a partir do `Dockerfile` local (Node.js 20 Alpine). A inicialização é condicionada à saúde do serviço `mysql` via `depends_on: condition: service_healthy`.

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
COPY . .
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/server.ts"]
```

O `CMD` executa as migrations automaticamente antes de iniciar o servidor, garantindo que o banco esteja sempre atualizado ao subir o container.

### Comandos úteis

```bash
# Subir todo o ambiente
docker compose up --build

# Subir em background
docker compose up -d --build

# Ver logs da API
docker compose logs -f api

# Executar seed dentro do container
docker compose exec api npx prisma db seed

# Parar e remover containers
docker compose down

# Parar e remover containers + volumes (apaga dados do banco)
docker compose down -v
```

### Variáveis de ambiente no Docker

O `docker-compose.yml` já injeta as variáveis de ambiente necessárias para o container da API se conectar ao MySQL interno. Para uso em produção, substitua os valores padrão por variáveis de ambiente reais ou use um arquivo `.env` com o Docker Compose.

---

## Melhorias Futuras

Com mais tempo de desenvolvimento, os seguintes pontos poderiam ser evoluídos:

**Refresh Token:** Implementar um mecanismo de renovação de token sem necessidade de novo login, melhorando a experiência do usuário.

**Rate Limiting:** Adicionar limitação de requisições por IP (ex: com `express-rate-limit`) para proteção contra ataques de força bruta e abuso da API.

**Logs estruturados:** Integrar uma biblioteca de logs como `pino` ou `winston` para registro estruturado de eventos, facilitando observabilidade e depuração em produção.

**Testes de integração e E2E:** Complementar os testes unitários com testes de integração usando banco em memória (ex: PGlite ou SQLite) e testes E2E com `supertest` cobrindo os controllers.

**Cache com Redis:** Adicionar cache para o endpoint de resumo financeiro, que agrega dados potencialmente pesados, reduzindo latência e carga no banco.

**CI/CD Pipeline:** Configurar pipeline com GitHub Actions para rodar testes, lint e build automaticamente em cada pull request.

**Soft Delete:** Implementar deleção lógica nas transações (campo `deletedAt`) para manter histórico e possibilitar recuperação.

**Upload de comprovantes:** Permitir anexar imagens de comprovantes às transações via upload para serviço de armazenamento (ex: S3).

**Relatórios e exportação:** Endpoint para exportação de extratos em PDF ou CSV com filtros por período.

**Notificações:** Sistema de alertas por e-mail para vencimento de transações pendentes ou metas de gastos atingidas.
