from rest_framework.views import APIView
from rest_framework.response import Response
import requests

class BookAPIView(APIView):
    
    def get(self, request, format=None):
        isbn = request.GET.get('isbn')
        if not isbn:
            return Response({"error": "ISBN parameter is required"}, status=400)

        url = f"https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&format=json&jscmd=data"
        response = requests.get(url)

        if response.status_code != 200:
            return Response({"error": "Failed to fetch data"}, status=500)

        data = response.json()
        key = f"ISBN:{isbn}"
        if key not in data:
            return Response({"error": "Book not found"}, status=404)

        book = data[key]
        result = {
            "title": book.get("title"),
            "authors": [author["name"] for author in book.get("authors", [])],
            "publish_date": book.get("publish_date"),
            "publishers": [p["name"] for p in book.get("publishers", [])],
            "cover": book.get("cover", {}).get("medium")
        }

        return Response(result)
