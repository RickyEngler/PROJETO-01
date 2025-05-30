import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

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

// Rota para outros arquivos HTML
app.get('/*.html', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'views', req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('Página não encontrada');
    }
  });
});

// Função para buscar no Confluence
async function buscarNoConfluence(termo) {
  const baseURL = process.env.CONFLUENCE_BASE_URL;
  const email = process.env.CONFLUENCE_EMAIL;
  const apiToken = process.env.CONFLUENCE_API_TOKEN;

  const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

  const response = await fetch(`${baseURL}/rest/api/search?cql=text~"${encodeURIComponent(termo)}"`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    console.error('Erro ao buscar no Confluence:', response.statusText);
    return [];
  }

  const data = await response.json();
  return data.results?.map(p => ({
    title: p.title,
    url: `${baseURL}${p._links.webui}`
  })) || [];
}

// Rota de chat com IA e busca no Confluence
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const buscaConfluence = await buscarNoConfluence(userMessage);

    let contextoExtra = '';
    if (buscaConfluence.length > 0) {
      contextoExtra = buscaConfluence
        .map(r => `• ${r.title}: ${r.url}`)
        .join('\n');
    }

    const promptFinal = `
Usuário perguntou: ${userMessage}

Resultados do Confluence encontrados:
${contextoExtra || 'Nenhum resultado encontrado'}

Baseado nisso, gere uma resposta útil e clara.
    `;

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:8b',
        messages: [
          { role: 'system', content: 'Você é uma IA que ajuda usuários com informações da empresa, usando Confluence quando possível.' },
          { role: 'user', content: promptFinal }
        ],
        stream: false
      })
    });

    const data = await response.json();
    const reply = data?.message?.content || 'A IA não retornou uma resposta.';

    res.json({ reply });
  } catch (err) {
    console.error('Erro no chat:', err);
    res.status(500).json({ reply: 'Erro ao processar a mensagem.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
