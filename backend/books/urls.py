from django.urls import path
from .views import BookAPIView

urlpatterns = [
    path('books/', BookAPIView.as_view(), name='get_book_by_isbn'),
]
