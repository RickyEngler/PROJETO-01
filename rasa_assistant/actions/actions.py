import os
import requests
from dotenv import load_dotenv
from rasa_sdk import Action
from rasa_sdk.events import SlotSet

load_dotenv("src/.env")

CONFLUENCE_URL = os.getenv("CONFLUENCE_URL")
USERNAME = os.getenv("CONFLUENCE_USERNAME")
API_TOKEN = os.getenv("CONFLUENCE_API_TOKEN")

class ActionBuscarNoConfluence(Action):
    def name(self):
        return "action_buscar_confluence"

    def run(self, dispatcher, tracker, domain):
        user_query = tracker.latest_message['text'] 

        headers = {"Accept": "application/json"}
        response = requests.get(
            CONFLUENCE_URL,
            params={"title": user_query, "expand": "body.storage"},
            auth=(USERNAME, API_TOKEN),
            headers=headers
        )

        if response.status_code == 200:
            results = response.json().get("results", [])
            if results:
                content = results[0]['body']['storage']['value']
                dispatcher.utter_message(f"Aqui está o que encontrei no Confluence:\n{content}")
            else:
                dispatcher.utter_message("Não encontrei nada relacionado no Confluence.")
        else:
            dispatcher.utter_message("Ocorreu um erro ao buscar no Confluence.")

        return []
