import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'home.html'));
});

// Rota para arquivos HTML com .html no link
app.get('/*.html', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'views', req.path);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Página não encontrada');
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
