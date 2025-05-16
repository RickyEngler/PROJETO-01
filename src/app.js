import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fetch from 'node-fetch'; // necessário para chamadas à API do Confluence

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

// Rota para páginas HTML
app.get('/*.html', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'views', req.path);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('Página não encontrada');
        }
    });
});

// ✅ NOVA ROTA: IA com LLaMA + busca no Confluence
app.post('/api/perguntar', async (req, res) => {
    const { pergunta } = req.body;

    if (!pergunta) {
        return res.status(400).json({ error: 'Pergunta não fornecida.' });
    }

    // 🔎 Verificar se é uma busca no Confluence
    if (/confluence|procure|buscar/i.test(pergunta)) {
        try {
            const results = await buscarNoConfluence(pergunta);
            return res.json({ resposta: results });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ resposta: 'Erro ao buscar no Confluence.' });
        }
    }

    // 🤖 Caso comum: conversa com o modelo LLaMA
    const processo = spawn('ollama', ['run', 'llama3']);
    let resposta = '';

    processo.stdout.on('data', data => {
        resposta += data.toString();
        if (resposta.includes('\n')) {
            processo.kill();
            res.json({ resposta: resposta.trim() });
        }
    });

    processo.stdin.write(pergunta + '\n');
    processo.stdin.end();
});

// Função de busca na API do Confluence
async function buscarNoConfluence(termo) {
    const CONFLUENCE_URL = 'https://seu-domínio.atlassian.net/wiki/rest/api/content/search';
    const USER = 'seu-email@empresa.com'; // e-mail da sua conta Atlassian
    const TOKEN = 'SEU_TOKEN'; // token gerado em https://id.atlassian.com/manage/api-tokens

    const headers = {
        'Authorization': 'Basic ' + Buffer.from(`${USER}:${TOKEN}`).toString('base64'),
        'Accept': 'application/json'
    };

    const query = encodeURIComponent(termo);
    const url = `${CONFLUENCE_URL}?cql=text~"${query}"&limit=3`;

    const response = await fetch(url, { headers });
    const json = await response.json();

    if (!json.results || json.results.length === 0) return 'Nada encontrado no Confluence.';

    let resposta = '🔍 Resultados encontrados no Confluence:\n\n';
    for (const item of json.results) {
        resposta += `- ${item.title} → https://seu-domínio.atlassian.net/wiki${item._links.webui}\n`;
    }

    return resposta;
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
