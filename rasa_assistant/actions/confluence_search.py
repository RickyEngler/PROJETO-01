import os
import requests
from dotenv import load_dotenv
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

# Carregar variáveis do arquivo .env
load_dotenv("../../src/.env")

class ActionSearchConfluence(Action):
    def name(self) -> str:
        return "action_search_confluence"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict):
        query = tracker.latest_message.get('text')  # A consulta que o usuário enviou

        # Verificar se há consulta
        if not query:
            dispatcher.utter_message(text="Por favor, me envie um termo de busca.")
            return []

        # Carregar as credenciais do Confluence do .env
        confluence_email = os.getenv("CONFLUENCE_EMAIL")
        confluence_api_token = os.getenv("CONFLUENCE_API_TOKEN")

        # Fazer a requisição para a API do Confluence
        url = f"https://libertyti.atlassian.net/wiki/rest/api/content/search?cql=text~\"{query}\""
        auth = (confluence_email, confluence_api_token)  # Usar as credenciais carregadas

        response = requests.get(url, auth=auth)

        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])

            if results:
                message = "Encontrei os seguintes artigos no Confluence:\n\n"
                for item in results:
                    title = item.get('title')
                    url = item.get('_links', {}).get('webui')
                    message += f"- [{title}]({url})\n"
                dispatcher.utter_message(text=message)
            else:
                dispatcher.utter_message(text="Não encontrei artigos relacionados à sua busca.")
        else:
            dispatcher.utter_message(text="Desculpe, ocorreu um erro ao buscar no Confluence.")

        return []
