# 🧮 Calculadora Tributária 2026

Aplicação web full-stack para cálculo e comparação de regimes tributários (Pessoa Física vs. Pessoa Jurídica), com autenticação de usuários via JWT e persistência de dados no PostgreSQL.

## 📋 Relatório Técnico - NP2 e NP3

**Disciplina:** Desenvolvimento de Aplicações com Frameworks Web

---

## 1. Contextualização

O projeto consiste no desenvolvimento de uma aplicação web denominada **Calculadora Tributária 2026**. O sistema tem como objetivo auxiliar usuários no cálculo de tributos de forma automatizada, reduzindo erros manuais e aumentando a eficiência na obtenção de resultados fiscais.

O projeto foi desenvolvido em **duas fases**:

- **NP2:** Desenvolvimento do frontend com React, incluindo as telas de login, home e calculadora comparativa.
- **NP3:** Implementação completa do backend com Node.js, autenticação JWT, persistência de dados em PostgreSQL via Prisma ORM e integração entre frontend e backend.

---

## 2. Descrição do Problema

O sistema deve atender às seguintes funcionalidades:

- Inserção de valores base para cálculo (renda mensal, custos e profissão)
- Cálculo automático do Imposto de Renda como Pessoa Física (IRPF) com as regras de 2026
- Cálculo automático dos encargos como Pessoa Jurídica (Simples Nacional + INSS)
- Exibição comparativa clara dos resultados, indicando a opção mais vantajosa
- Interface amigável para o usuário com animações e feedback visual
- **[NP3]** Cadastro e autenticação segura de usuários
- **[NP3]** Armazenamento das comparações realizadas por usuários autenticados no banco de dados

---

## 3. Lista de Atividades

| **Atividade** | **Responsável** | **Fase** | **Status** |
|---|---|---|---|
| Levantamento de requisitos | Equipe | NP2 | ✅ Concluído |
| Desenvolvimento Frontend | Ariel Bezerra Pedrosa | NP2 | ✅ Concluído |
| Configuração do projeto (VS Code + Vite) | Ariel Bezerra Pedrosa | NP2 | ✅ Concluído |
| Fase de Testes - Frontend | Davi Bezerra e Adriel Cantareli | NP2 | ✅ Concluído |
| Documentação - NP2 | João Victor de Paula Gomes | NP2 | ✅ Concluído |
| Desenvolvimento Backend (API REST) | Ariel Bezerra Pedrosa | NP3 | ✅ Concluído |
| Autenticação JWT | Ariel Bezerra Pedrosa | NP3 | ✅ Concluído |
| Modelagem e criação do banco de dados | Ariel Bezerra Pedrosa | NP3 | ✅ Concluído |
| Integração Frontend ↔ Backend | Ariel Bezerra Pedrosa | NP3 | ✅ Concluído |
| Fase de Testes - Backend | Davi Bezerra e Adriel Cantareli | NP3 | ✅ Concluído |
| Documentação - NP3 | João Victor de Paula Gomes | NP3 | ✅ Concluído |

---

## 4. Proposta de Solução / Implementação

### NP2 - Frontend

A solução foi desenvolvida com React e Vite, focada em modularização e desempenho. A lógica de cálculo tributário foi implementada diretamente no componente `Comparativo.jsx`, permitindo respostas instantâneas às interações do usuário. A interface conta com animações de entrada suaves e validação de formulários em tempo real.

### NP3 - Backend

O backend foi desenvolvido com **Node.js e Express**, expondo uma API RESTful. A autenticação é realizada com **JSON Web Token (JWT)** e as senhas dos usuários são protegidas com criptografia **bcrypt**. Os dados são persistidos em um banco de dados **PostgreSQL** gerenciado pelo **Prisma ORM**, que oferece tipagem segura e migrations automáticas. A integração entre frontend e backend foi realizada por meio de chamadas `fetch` autenticadas com o token JWT armazenado no `localStorage`.

---

## 5. Estrutura do Sistema

O sistema segue uma arquitetura **cliente-servidor (MVC simplificado)**:

```
Calculadora-Tributaria-main/
│
├── 📁 src/                          # Frontend (React + Vite)
│   ├── 📁 Pages/
│   │   ├── Login.jsx                # Tela de login com validação e integração ao backend
│   │   ├── Home.jsx                 # Página inicial (protegida por autenticação)
│   │   └── Comparativo.jsx          # Calculadora PF vs PJ com persistência dos resultados
│   ├── 📁 components/
│   │   └── Navbar.jsx               # Barra de navegação com botão de logout
│   └── main.jsx                     # Ponto de entrada do React com configuração de rotas
│
├── 📁 prisma/
│   └── schema.prisma                # Modelos de dados (Usuario e Comparacao)
│
├── server.js                        # API Backend completa (Node.js + Express)
├── prisma.config.ts                 # Configuração do Prisma ORM
├── .env                             # Variáveis de ambiente (não versionado)
├── package.json                     # Dependências do projeto
└── vite.config.js                   # Configuração do Vite
```

**Fluxo completo de uso:**

1. O usuário acessa a tela de Login (`/`)
2. Faz cadastro ou login — o backend valida e retorna um **token JWT**
3. O token é salvo no `localStorage` do navegador
4. A Home (`/Home`) só é acessível se o token existir (guarda de rota)
5. O usuário seleciona a profissão, insere a renda e os custos
6. Clica em **Calcular** — o frontend exibe o resultado e envia os dados para o backend via `POST /comparacoes` com o token no cabeçalho
7. Os dados ficam persistidos no PostgreSQL, vinculados ao ID do usuário logado

---

## 6. Tecnologias Utilizadas

### Frontend (NP2)

| **Tecnologia** | **Versão** | **Finalidade** |
|---|---|---|
| React | 18+ | Framework de UI baseado em componentes |
| Vite | 5+ | Bundler e servidor de desenvolvimento rápido |
| React Router DOM | 6+ | Gerenciamento de rotas SPA |
| HTML5 e CSS3 / TailwindCSS | - | Estrutura e estilização responsiva |
| JavaScript (ES6+) | - | Lógica da aplicação |

### Backend (NP3)

| **Tecnologia** | **Versão** | **Finalidade** |
|---|---|---|
| Node.js + Express | 20+ / 4+ | Servidor HTTP e definição de rotas da API |
| JSON Web Token (JWT) | - | Autenticação stateless segura |
| bcryptjs | - | Criptografia de senhas com salt |
| Prisma ORM | 6+ | Mapeamento objeto-relacional e migrations |
| PostgreSQL | 15+ | Banco de dados relacional |
| @prisma/adapter-pg | - | Adaptador de conexão Prisma ↔ PostgreSQL |
| Nodemailer | - | Envio de e-mails de suporte (NAF) |
| dotenv | - | Gerenciamento de variáveis de ambiente |
| cors | - | Habilitação de requisições cross-origin |

### Ferramentas de Desenvolvimento

| **Ferramenta** | **Finalidade** |
|---|---|
| Git / GitHub | Controle de versão e repositório remoto |
| VS Code | Ambiente de desenvolvimento integrado (IDE) |
| Prisma Studio | Interface visual para inspecionar o banco de dados |
| Nodemon | Reinício automático do servidor em desenvolvimento |

---

## 7. Requisitos de Backend Implementados (NP3)

### 7.1 Cadastro e Login de Usuário

O sistema permite que novos usuários se cadastrem informando **nome, e-mail e senha**. A senha é criptografada com `bcrypt` (salt de 10 rounds) antes de ser armazenada no banco. No login, a senha informada é comparada com o hash salvo usando `bcrypt.compare()`.

### 7.2 Autenticação por JWT

Após um login bem-sucedido, o servidor gera um **token JWT** assinado com uma chave secreta (`SECRET_KEY`), com validade de **1 hora**. O payload do token contém o `id`, `nome` e `email` do usuário.

O middleware `authenticateToken` é aplicado nas rotas protegidas: ele extrai o token do cabeçalho `Authorization: Bearer <token>`, verifica sua validade e injeta os dados do usuário em `req.user` para uso nas rotas seguintes.

### 7.3 Persistência de Dados Comparativos

Ao clicar em **Calcular** na tela de comparativo, o frontend — se o usuário estiver logado — realiza uma requisição `POST /comparacoes` com o token JWT no cabeçalho. O backend verifica o token, extrai o ID do usuário e salva a comparação no banco de dados, vinculada àquele usuário.

### 7.4 Endpoints da API

| **Método** | **Rota** | **Descrição** | **Autenticação** |
|---|---|---|---|
| POST | /register | Cria um novo usuário com senha criptografada | ❌ Pública |
| POST | /login | Autentica o usuário e retorna o token JWT | ❌ Pública |
| POST | /comparacoes | Salva uma comparação tributária do usuário logado | ✅ JWT |
| GET | /comparacoes | Lista todas as comparações do usuário logado | ✅ JWT |
| POST | /send-email | Envia e-mail de dúvida para o NAF/Unichristus | ❌ Pública |
| GET | /protegido | Rota de teste para verificar autenticação JWT | ✅ JWT |
| GET | /debug/usuarios | Lista usuários cadastrados (uso em testes) | ✅ JWT |

---

## 8. Modelagem do Banco de Dados

O banco de dados PostgreSQL contém duas tabelas, definidas no `schema.prisma`:

### Tabela `usuarios`

| **Coluna** | **Tipo** | **Descrição** |
|---|---|---|
| id | INT (PK, autoincrement) | Identificador único |
| nome | VARCHAR(100) | Nome do usuário |
| email | VARCHAR(100) UNIQUE | E-mail (usado no login) |
| senha | VARCHAR(255) | Senha criptografada com bcrypt |
| created_at | DATETIME | Data de cadastro |

### Tabela `comparacoes`

| **Coluna** | **Tipo** | **Descrição** |
|---|---|---|
| id | INT (PK, autoincrement) | Identificador único |
| usuario_id | INT (FK → usuarios.id) | Usuário que realizou o cálculo |
| dados_entrada | JSON | Renda, custos e profissão informados |
| resultados | JSON | Resultado completo do cálculo (PF e PJ) |
| created_at | DATETIME | Data e hora do cálculo |

> **Relacionamento:** Um usuário pode ter muitas comparações (1:N). Se um usuário for deletado, suas comparações são removidas em cascata (`onDelete: Cascade`).

---

## 9. Lógica de Cálculo Tributário

### Pessoa Física (IRPF 2026)

1. Aplica a **dedução simplificada** de R$ 607,20 sobre a renda bruta
2. Enquadra o resultado na tabela progressiva do IRRF:
   - Até R$ 2.428,80 → **Isento**
   - R$ 2.428,81 a R$ 2.826,65 → **7,5%** (parcela dedutível: R$ 182,16)
   - R$ 2.826,66 a R$ 3.751,05 → **15%** (parcela dedutível: R$ 394,16)
   - R$ 3.751,06 a R$ 4.664,68 → **22,5%** (parcela dedutível: R$ 675,49)
   - Acima de R$ 4.664,68 → **27,5%** (parcela dedutível: R$ 908,73)
3. Aplica o **redutor 2026**: rendas até R$ 5.000 têm desconto de até R$ 312,89

### Pessoa Jurídica (Simples Nacional)

- **Psicólogo / Arquiteto (Anexo III - 6%):** DAS de 6% + INSS sobre pró-labore (mínimo 28% da renda, com alíquota de 11%)
- **Advogado (Anexo IV - 4,5%):** DAS de 4,5% + INSS do empregado (11% sobre salário mínimo) + INSS patronal (20% sobre salário mínimo)

---

## 10. Dificuldades e Limitações

| **Dificuldade** | **Como foi superada** |
|---|---|
| Lógica de cálculo PF com o redutor 2026 | Pesquisa nas tabelas oficiais da Receita Federal e testes com valores reais |
| Integração do Prisma ORM com PostgreSQL | Uso do adaptador @prisma/adapter-pg e ajuste nas configurações de conexão |
| Implementação do fluxo de autenticação JWT | Pesquisa técnica e separação clara entre middleware e rotas da API |
| Configuração inicial do ambiente (Vite + Node.js + PostgreSQL) | Ajustes incrementais e uso do nodemon para facilitar o desenvolvimento |
| Frontend não salvava dados no banco após o cálculo | Adição da chamada fetch ao endpoint POST /comparacoes no Comparativo.jsx |

---

## 11. Como Executar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [PostgreSQL](https://www.postgresql.org/) instalado e em execução
- Arquivo `.env` configurado na raiz do projeto

### Variáveis de Ambiente (`.env`)

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/calculadora_db"
SECRET_KEY="sua_chave_secreta_jwt_aqui"
email="seu_email_gmail@gmail.com"
senha="sua_senha_de_app_gmail"
```

### Passo a Passo

```bash
# 1. Instalar todas as dependências
npm install

# 2. Criar as tabelas no banco de dados via Prisma
npx prisma migrate dev --name init

# 3. (Terminal 1) Iniciar o Backend na porta 3000
npm run start

# 4. (Terminal 2) Iniciar o Frontend na porta 5173
npm run dev

# 5. (Opcional) Abrir a interface visual do banco de dados
npx prisma studio
```
---

## 13. Conclusão

O projeto atingiu todos os seus objetivos ao longo das duas fases de desenvolvimento. Na **NP2**, foi entregue uma aplicação frontend funcional e bem estruturada em React, com interface responsiva e lógica de cálculo tributário precisa. Na **NP3**, a aplicação evoluiu para um sistema **full-stack** completo, incorporando um backend robusto com autenticação segura por JWT, criptografia de senhas com bcrypt e persistência de dados em banco relacional PostgreSQL via Prisma ORM. A integração entre as camadas frontend e backend demonstra na prática os conceitos fundamentais de desenvolvimento web moderno.

---

## 👥 Equipe - Garotos de Programa

| **Nome** | **Função** |
|---|---|
| Ariel Bezerra Pedrosa | Desenvolvedor Frontend e Backend |
| Davi Bezerra | Testes |
| Adriel Cantareli | Testes |
| João Victor de Paula Gomes | Documentação |
