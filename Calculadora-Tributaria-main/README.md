# 🧮 Calculadora Tributária 2026 — NP2 (Frontend)

> Esta branch contém **exclusivamente o frontend** da aplicação, desenvolvido como entrega da **NP2**.
> Para ver o projeto completo com backend (NP3), acesse a branch [`main`](../../tree/main).

---

## 📋 Sobre esta entrega

**Fase:** NP2 — Desenvolvimento de Aplicações com Frameworks Web  
**Escopo:** Somente o frontend (React + Vite)

---

## 1. Contextualização

O projeto consiste no desenvolvimento de uma aplicação web denominada **Calculadora Tributária 2026**. O sistema tem como objetivo auxiliar usuários no cálculo de tributos de forma automatizada, reduzindo erros manuais e aumentando a eficiência na obtenção de resultados fiscais.

---

## 2. Funcionalidades da NP2

- ✅ Tela de Login com validação de formulário em tempo real
- ✅ Tela de Cadastro de usuário
- ✅ Página inicial (Home) com navegação entre módulos
- ✅ Calculadora comparativa PF vs PJ com as regras tributárias de 2026
- ✅ Seleção de profissão (Psicólogo, Arquiteto ou Advogado)
- ✅ Exibição dos resultados com destaque para a opção mais vantajosa
- ✅ Geração de relatório em PDF (impressão)
- ✅ Envio de dúvidas por e-mail ao NAF/Unichristus
- ✅ Navbar com navegação e botão de logout
- ✅ Animações de entrada em todos os componentes

---

## 3. Estrutura do Frontend

```
src/
├── Pages/
│   ├── Login.jsx          # Tela de login com validação
│   ├── Home.jsx           # Página inicial com botões de navegação
│   └── Comparativo.jsx    # Calculadora PF vs PJ
├── components/
│   └── Navbar.jsx         # Barra de navegação com logout
└── main.jsx               # Configuração de rotas (React Router)
```

---

## 4. Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| React 19 | Framework de UI baseado em componentes |
| Vite 7 | Servidor de desenvolvimento e bundler |
| React Router DOM | Gerenciamento de rotas SPA |
| TailwindCSS | Estilização responsiva |
| JavaScript (ES6+) | Lógica da aplicação |

---

## 5. Lógica de Cálculo (Pessoa Física — IRPF 2026)

1. Aplica dedução simplificada de **R$ 607,20**
2. Enquadra na tabela progressiva:
   - Até R$ 2.428,80 → **Isento**
   - R$ 2.428,81 a R$ 2.826,65 → **7,5%**
   - R$ 2.826,66 a R$ 3.751,05 → **15%**
   - R$ 3.751,06 a R$ 4.664,68 → **22,5%**
   - Acima de R$ 4.664,68 → **27,5%**
3. Aplica o **redutor 2026**: rendas até R$ 5.000 têm desconto de até R$ 312,89

### Pessoa Jurídica (Simples Nacional)
- **Psicólogo / Arquiteto (Anexo III):** DAS 6% + INSS 11% sobre pró-labore
- **Advogado (Anexo IV):** DAS 4,5% + INSS empregado 11% + INSS patronal 20%

---

## 6. Como Executar

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

> ⚠️ Nesta branch (NP2), **não há backend**. O login e o cadastro são apenas visuais. Para a versão completa com autenticação real e banco de dados, veja a branch [`main`](../../tree/main).

---

## 👥 Equipe — Garotos de Programa

| Nome | Função |
|---|---|
| Ariel Bezerra Pedrosa | Desenvolvedor Frontend |
| Davi Bezerra | Testes |
| Adriel Cantareli | Testes |
| João Victor de Paula Gomes | Documentação |
