import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Obtenha o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para interpretar JSON no corpo da requisição
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o caminho raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve o arquivo index.html
});

// Função para criar e popular a tabela de usuários
async function criarEpopularTabelaDeUsuarios(nome, email, cpf, cargo, senha) {
    const db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

    await db.run('CREATE TABLE IF NOT EXISTS usuarios (nome varchar(30) NOT NULL, email varchar(100) NOT NULL, cpf varchar(14) NOT NULL, cargo varchar(40) NOT NULL, senha varchar(30) NOT NULL)');
    await db.run('INSERT INTO usuarios (nome, email, cpf, cargo, senha) VALUES (?,?,?,?,?)', [nome, email, cpf, cargo, senha]);

    console.log('Usuário inserido com sucesso!');
}

// Rota para cadastro de usuário
app.post('/cadastrar', async (req, res) => {
    const { nome, email, cpf, cargo, senha } = req.body;

    // Verifique se todos os campos foram recebidos
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

// Rota para login
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

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
