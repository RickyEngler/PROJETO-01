const express = require('express');
const mysql = require('mysql');
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
    console.log('Conectado ao banco de dados MySQL!');
});

// Rota para buscar dados do banco
app.get('/dados', (req, res) => {
    let sql = 'SELECT * FROM pessoas'; // Substitua pelo nome da sua tabela
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static('public'));

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});