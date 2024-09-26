import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { MongoClient } from 'mongodb';  // Adicionando o import correto de MongoClient
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Conexão com o MongoDB Atlas
const uri = 'mongodb+srv://irickyengler:portalliberty@libertyportal.bn8xq.mongodb.net/LibertyPortal?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
    ssl: true,
});
            
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

// Função para inserir um novo usuário no MongoDB
async function criarEpopularTabelaDeUsuarios(nome, email, cpf, cargo, senha) {
    try {
        await client.connect();
        const db = client.db('LibertyPortal');
        const usuarios = db.collection('usuarios');

        const novoUsuario = { nome, email, cpf, cargo, senha };
        await usuarios.insertOne(novoUsuario);

        console.log('Usuário inserido com sucesso!');
    } catch (error) {
        console.error('Erro ao cadastrar usuário no MongoDB:', error);
    } finally {
        await client.close();
    }
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

async function logar() {
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-senha').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (data.success) {
            // Redirecionar para a página home após login bem-sucedido
            window.location.href = '/home.html';
        } else {
            alert('Erro no login: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao logar:', error);
        alert('Ocorreu um erro ao tentar logar.');
    }
}




app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    try {
        await client.connect();
        const db = client.db('LibertyPortal');
        const usuarios = db.collection('usuarios');

        const usuario = await usuarios.findOne({ email, senha });

        if (usuario) {
            return res.json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            return res.json({ success: false, message: 'Usuário e/ou senha incorretos' });
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return res.status(500).json({ success: false, message: 'Erro ao fazer login' });
    } finally {
        await client.close();
    }
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
