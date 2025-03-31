import os
import requests
import logging
from dotenv import load_dotenv
from rasa_sdk import Action
from rasa_sdk.executor import CollectingDispatcher
from requests.auth import HTTPBasicAuth

# Carregar variáveis de ambiente
load_dotenv("src/.env")

# Definir constantes a partir das variáveis de ambiente
CONFLUENCE_URL = os.getenv("CONFLUENCE_URL")
USERNAME = os.getenv("CONFLUENCE_EMAIL")
API_TOKEN = os.getenv("CONFLUENCE_TOKEN")

# Validar se as variáveis estão carregadas corretamente
if not all([CONFLUENCE_URL, USERNAME, API_TOKEN]):
    raise ValueError("❌ ERRO: Variáveis de ambiente do Confluence não carregadas corretamente!")

class ActionBuscarFAQConfluence(Action):
    def name(self):
        return "action_buscar_faq_confluence"

    def run(self, dispatcher: CollectingDispatcher, tracker, domain):
        user_query = tracker.latest_message.get('text', '').strip()
        
        if not user_query:
            dispatcher.utter_message("⚠️ Por favor, informe um termo para buscar no Confluence.")
            return []

        logging.info(f"🔍 Buscando no Confluence por: {user_query}")

        headers = {"Accept": "application/json"}
        params = {
            "cql": f'title ~ "FAQ" AND text ~ "{user_query}" ORDER BY lastModified DESC',
            "expand": "body.storage"
        }

        try:
            response = requests.get(
                f"{CONFLUENCE_URL}/rest/api/content/search",
                params=params,
                auth=HTTPBasicAuth(USERNAME, API_TOKEN),
                headers=headers,
                timeout=10  # Timeout de 10 segundos para evitar travamento
            )

            logging.info(f"📡 Resposta da API: {response.status_code}")

            if response.status_code == 200:
                results = response.json().get("results", [])
                logging.info(f"📄 {len(results)} resultados encontrados.")

                if results:
                    resposta = "📌 **FAQs encontradas:**\n"
                    for result in results[:5]:  # Limita a 5 resultados
                        title = result.get('title', 'Sem título')
                        link = f"{CONFLUENCE_URL}{result['_links']['webui']}"
                        resposta += f"🔹 [{title}]({link})\n"

                    dispatcher.utter_message(resposta)
                else:
                    dispatcher.utter_message("⚠️ Nenhuma FAQ encontrada no Confluence.")

            else:
                dispatcher.utter_message("❌ Erro ao buscar informações no Confluence.")
                logging.error(f"❌ Erro na API: {response.text}")

        except requests.exceptions.RequestException as e:
            dispatcher.utter_message("❌ Erro de conexão com o Confluence.")
            logging.error(f"❌ Erro de requisição: {e}")

        return []
