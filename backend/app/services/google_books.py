import requests

BASE_URL = "https://www.googleapis.com/books/v1/volumes"

def search_books(query):

    response = requests.get(
        BASE_URL,
        params={
            "q": query,
            "maxResults": 20
        }
    )

    return response.json()