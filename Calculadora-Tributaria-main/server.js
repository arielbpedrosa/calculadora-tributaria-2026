import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'edead35592554922e00a96a11d756b962ea69d4c053ca12a26994ab5372781cf';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:5173', 
        credentials: true
    })
);

// Inicia o servidor e verifica a conexão com o banco
async function inicializarServidor() {
    try {
        await prisma.$connect();
        console.log("Conectado ao PostgreSQL com sucesso via Prisma!");

        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error("ERRO ao conectar ao banco de dados:");
        console.error("Mensagem:", error.message);
        process.exit(1);
    }
}

inicializarServidor();

// Configuração do email com .env 
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.senha
    }
});

// Envio de email
app.post('/send-email', async (req, res) => {
    const { nome, email, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const mailOptions = {
        from: process.env.email, 
        to: "mauricio.moreira@unichristus.edu.br", 
        subject: `[AJUDA NAF] Dúvida de: ${nome}`,
        text: `
            Nome do Usuário: ${nome}
            Email de Contato: ${email}
            -------------------------------------
            Mensagem:
            ${mensagem}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email enviado para ${mailOptions.to}`);
        return res.status(200).json({ message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('ERRO AO ENVIAR EMAIL:', error);
        return res.status(500).json({ message: 'Erro interno ao tentar enviar o email.' });
    }
});

app.post('/register', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        console.log("Tentando registrar usuário:", { nome, email });

        // Validação básica
        if (!nome || !email || !senha) {
            return res.status(400).json({ message: "Todos os campos são obrigatórios." });
        }

        // Verifica se o email já existe
        const existingUser = await prisma.usuario.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: "Email já registrado." });
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const newUser = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedPassword
            }
        });

        console.log(`Usuário inserido com ID: ${newUser.id}`);

        // Retornar sucesso
        return res.status(201).json({ 
            message: "Usuário registrado com sucesso!", 
            userId: newUser.id 
        });

    } catch (error) {
        console.error("ERRO no registro:", error.message);
        
        return res.status(500).json({ 
            message: "Erro interno no servidor",
            error: error.message 
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        console.log("Tentando login para:", email);

        // Validação
        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios." });
        }

        // Busca usuário pelo email
        const usuario = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!usuario) {
            console.log("Usuário não encontrado:", email);
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        console.log(`Usuário encontrado: ${usuario.nome} (ID: ${usuario.id})`);
        
        // Verificar a senha
        const isMatch = await bcrypt.compare(senha, usuario.senha);

        if (!isMatch) {
            console.log("Senha incorreta para:", email);
            return res.status(401).json({ message: "Credenciais inválidas." });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { 
                id: usuario.id, 
                nome: usuario.nome, 
                email: usuario.email 
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        console.log("Login bem-sucedido para:", usuario.email);

        return res.status(200).json({ 
            message: "Login bem-sucedido.",
            token: token,
            user: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('ERRO no login:', error.message);
        
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido.' });
        }
        req.user = user; // O req.user contém as informações descritas no jwt.sign ({id, nome, email})
        next();
    });
};

// ==========================================
// Novas Rotas para "Dados Comparativos"
// ==========================================

// Salvar um novo resultado de comparação
app.post('/comparacoes', authenticateToken, async (req, res) => {
    try {
        const { dadosEntrada, resultados } = req.body;
        
        if (!dadosEntrada || !resultados) {
            return res.status(400).json({ message: "dadosEntrada e resultados são obrigatórios." });
        }

        const novaComparacao = await prisma.comparacao.create({
            data: {
                usuarioId: req.user.id,
                dadosEntrada,
                resultados
            }
        });

        return res.status(201).json({
            message: "Comparação salva com sucesso!",
            comparacao: novaComparacao
        });

    } catch (error) {
        console.error("ERRO ao salvar comparação:", error.message);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// Listar todas as comparações do usuário logado
app.get('/comparacoes', authenticateToken, async (req, res) => {
    try {
        const comparacoes = await prisma.comparacao.findMany({
            where: {
                usuarioId: req.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({ comparacoes });
        
    } catch (error) {
        console.error("ERRO ao listar comparações:", error.message);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});

// ==========================================
// Rotas de Debug
// ==========================================

app.get('/debug/usuarios', authenticateToken, async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                createdAt: true
            }
        });
        
        return res.status(200).json({
            total: usuarios.length,
            usuarios: usuarios
        });
    } catch (error) {
        console.error("Erro no debug:", error);
        return res.status(500).json({ error: error.message });
    }
});

app.get('/debug/todos-usuarios', async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        
        console.log("Usuários no banco:", usuarios);
        
        return res.status(200).json({
            total: usuarios.length,
            usuarios: usuarios
        });
    } catch (error) {
        console.error("Erro no debug:", error);
        return res.status(500).json({ error: error.message });
    }
});

app.get("/protegido", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Acesso concedido à rota protegida.", user: req.user });
});

// Process event handlers for cleanup
process.on('SIGINT', async () => {
    console.log('Fechando conexão com o banco de dados...');
    await prisma.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('Fechando conexão com o banco de dados...');
    await prisma.$disconnect();
    process.exit(0);
});