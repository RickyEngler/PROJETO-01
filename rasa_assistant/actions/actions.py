import os
import requests
from dotenv import load_dotenv
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import logging

# Carregar variáveis de ambiente
load_dotenv(".env")

# Configurações do Confluence
CONFLUENCE_URL = os.getenv("CONFLUENCE_URL") 
CONFLUENCE_EMAIL = os.getenv("CONFLUENCE_EMAIL")
CONFLUENCE_TOKEN = os.getenv("CONFLUENCE_TOKEN")

class ActionBuscarFAQConfluence(Action):
    def name(self):
        return "action_faq_buscar_confluence"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict):
        user_query = tracker.latest_message['text']  # Captura a mensagem do usuário
        logging.info(f"🔍 Buscando FAQ com a query: {user_query}")

        headers = {
            "Accept": "application/json"
        }

        # Construindo a URL da API do Confluence
        search_url = f"{CONFLUENCE_URL}/rest/api/content/search"
        params = {
            "cql": f'text~"{user_query}"',
            "expand": "body.storage"
        }

        # Fazendo a requisição GET
        response = requests.get(search_url, params=params, auth=(CONFLUENCE_EMAIL, CONFLUENCE_TOKEN), headers=headers)

        logging.info(f"📡 Resposta da API: {response.status_code}, {response.text}")

        if response.status_code == 200:
            results = response.json().get("results", [])
            logging.info(f"📄 {len(results)} resultados encontrados.")

            if results:
                resposta = "📌 **FAQs encontradas:**\n"
                for result in results[:5]:  # Mostra no máximo 5 resultados
                    title = result['title']
                    link = f"{CONFLUENCE_URL}{result['_links']['webui']}"
                    resposta += f"🔹 [{title}]({link})\n"

                dispatcher.utter_message(resposta)
            else:
                dispatcher.utter_message("⚠️ Nenhuma FAQ encontrada no Confluence para essa pesquisa.")

        else:
            dispatcher.utter_message("❌ Erro ao buscar informações no Confluence.")

        return []
