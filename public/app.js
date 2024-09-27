import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function criarEpopularTabelaDeUsuarios(nome, email, cpf, cargo, senha) {
    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

    await db.run('CREATE TABLE IF NOT EXISTS usuarios (nome varchar(30) NOT NULL, email varchar(100) NOT NULL UNIQUE, cpf varchar(14) NOT NULL PRIMARY KEY UNIQUE, cargo varchar(40) NOT NULL, senha varchar(30) NOT NULL)');
    await db.run('INSERT INTO usuarios (nome, email, cpf, cargo, senha) VALUES (?,?,?,?,?)', [nome, email, cpf, cargo, senha]);

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

    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

    const usuario = await db.get('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);

    if (usuario) {
        return res.json({ success: true, message: 'Login bem-sucedido!' });
    } else {
        return res.json({ success: false, message: 'Usuário e/ou senha incorretos' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
