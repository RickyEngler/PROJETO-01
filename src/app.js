import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: 'src/.env' });

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

// Função para buscar no Confluence
async function buscarNoConfluence(query) {
    const CONFLUENCE_URL = process.env.CONFLUENCE_URL;
    const USERNAME = process.env.CONFLUENCE_EMAIL;
    const API_TOKEN = process.env.CONFLUENCE_TOKEN;

    const headers = {
        "Accept": "application/json",
        "Authorization": `Basic ${Buffer.from(`${USERNAME}:${API_TOKEN}`).toString('base64')}`
    };

    const url = `${CONFLUENCE_URL}/rest/api/content/search?cql=${encodeURIComponent(`title ~ "${query}" OR text ~ "${query}"`)}&expand=body.storage`;

    try {
        const response = await fetch(url, { method: "GET", headers });
        if (!response.ok) throw new Error("Erro ao buscar no Confluence");
        
        const data = await response.json();
        const results = data.results;

        if (results.length > 0) {
            const title = results[0].title;
            const link = `${CONFLUENCE_URL}${results[0]._links.webui}`;
            return `🔍 Encontrei um documento: **${title}**\n[Acesse aqui](${link})`;
        } else {
            return "Não encontrei nada relacionado no Confluence.";
        }
    } catch (error) {
        console.error("Erro de requisição para Confluence:", error);
        return "Desculpe, não consegui conectar ao Confluence.";
    }
}

async function criarEpopularTabelaDeUsuarios(nome, email, cpf, cargo, senha) {
    const db = await open({ filename: 'src/public/database/banco.db', driver: sqlite3.Database });
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(senha, saltRounds);
    await db.run('CREATE TABLE IF NOT EXISTS usuarios (nome TEXT, email TEXT UNIQUE, cpf TEXT PRIMARY KEY, cargo TEXT, senha TEXT)');
    await db.run('INSERT INTO usuarios (nome, email, cpf, cargo, senha) VALUES (?,?,?,?,?)', [nome, email, cpf, cargo, hashedPassword]);
    console.log('Usuário inserido com sucesso!');
}

app.post('/cadastrar', async (req, res) => {
    const { nome, email, cpf, cargo, senha } = req.body;
    if (!nome || !email || !cpf || !cargo || !senha) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }
    try {
        await criarEpopularTabelaDeUsuarios(nome, email, cpf, cargo, senha);
        return res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
    }
});

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }
    const db = await open({ filename: path.join(__dirname, 'public', 'database', 'banco.db'), driver: sqlite3.Database });
    const usuario = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (usuario && await bcrypt.compare(senha, usuario.senha)) {
        return res.json({ success: true, message: 'Login bem-sucedido!' });
    }
    return res.json({ success: false, message: 'Usuário e/ou senha incorretos' });
});

app.post('/buscar-confluence', async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ success: false, message: 'A consulta não pode estar vazia.' });
    }
    try {
        const result = await buscarNoConfluence(query);
        return res.json({ success: true, message: result });
    } catch (error) {
        console.error('Erro ao buscar no Confluence:', error);
        return res.json({ success: false, message: 'Erro ao realizar a busca no Confluence.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
