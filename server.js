const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',     // Endereço do banco de dados
    user: 'root',   // Substitua pelo usuário do seu banco de dados
    password: '', // Substitua pela senha do seu banco de dados
    database: 'cadastro' // Substitua pelo nome do seu banco de dados
});

// Conectar ao banco de dados
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados!');
});

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Rota de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Consulta ao banco de dados para verificar se o usuário e a senha são válidos
    const sql = 'SELECT * FROM pessoas WHERE email = ? AND senha = ?'; // Substitua 'usuarios' pelo nome da sua tabela
    db.query(sql, [email, senha], (err, result) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            res.status(500).json({ success: false, message: 'Erro no servidor' });
            return;
        }

        if (result.length > 0) {
            // Se o usuário foi encontrado, sucesso no login
            res.json({ success: true });
        } else {
            // Se o usuário não foi encontrado, falha no login
            res.json({ success: false, message: 'Usuário ou senha incorretos' });
        }
    });
});

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});