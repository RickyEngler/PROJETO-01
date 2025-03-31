import os
import requests
from dotenv import load_dotenv
from rasa_sdk import Action
import logging

load_dotenv("src/.env")

CONFLUENCE_URL = os.getenv("CONFLUENCE_URL")
USERNAME = os.getenv("CONFLUENCE_EMAIL")
API_TOKEN = os.getenv("CONFLUENCE_TOKEN")

class ActionBuscarNoConfluence(Action):
    def name(self):
        return "action_buscar_confluence"

    def run(self, dispatcher, tracker, domain):
        user_query = tracker.latest_message['text']
        logging.info(f"Buscando por: {user_query}")

        headers = {
            "Accept": "application/json"
        }
        params = {
            "cql": f'text ~ "{user_query}" ORDER BY lastModified DESC',
            "expand": "body.storage"
        }

        # Requisição GET para Confluence
        response = requests.get(
            f"{CONFLUENCE_URL}/rest/api/content/search",
            params=params,
            auth=(USERNAME, API_TOKEN),
            headers=headers
        )

        logging.info(f"Resposta da API: {response.status_code}, {response.text}")

        if response.status_code == 200:
            results = response.json().get("results", [])
            logging.info(f"Resultados encontrados: {results}")

            if results:
                resposta = "📄 **Documentos encontrados:**\n"
                for result in results[:10]:  # Retorna no máximo 3 documentos
                    title = result['title']
                    link = f"{CONFLUENCE_URL}{result['_links']['webui']}"
                    resposta += f"🔹 [{title}]({link})\n"

                dispatcher.utter_message(resposta)
            else:
                dispatcher.utter_message("Nenhum documento encontrado no Confluence para essa pesquisa.")

        else:
            dispatcher.utter_message("⚠️ Erro ao buscar informações no Confluence.")

        return []
