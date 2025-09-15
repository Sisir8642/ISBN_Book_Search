from decouple import config
import requests
from rest_framework.views import APIView
from rest_framework.response import Response

class BookAPIView(APIView):
    def get(self, request, format=None):
        isbn = request.GET.get('isbn')
        if not isbn:
            return Response({"error": "ISBN parameter is required"}, status=400)

        base_url = config('OPENLIBRARY_BASE_URL', default='https://openlibrary.org/api/books')
        url = f"{base_url}?bibkeys=ISBN:{isbn}&format=json&jscmd=data"
        resp = requests.get(url)

        if resp.status_code != 200:
            return Response({"error": "Failed to fetch data"}, status=500)

        data = resp.json()
        key = f"ISBN:{isbn}"
        if key not in data:
            return Response({"error": "Book not found"}, status=404)

        book = data[key]
        cover_url = book.get("cover", {}).get("medium")

        
        if cover_url:
            if cover_url.startswith("//"):
                cover_url = "https:" + cover_url
        else:
            cover_url = None  

        result = {
            "title": book.get("title"),
            "authors": [author["name"] for author in book.get("authors", [])],
            "publish_date": book.get("publish_date"),
            "publishers": [p["name"] for p in book.get("publishers", [])],
            "cover": cover_url
        }

        return Response(result)
