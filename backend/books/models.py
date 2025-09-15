from django.db import models

class Book(models.Model):
    isbn = models.CharField(max_length=13, unique=True)
    title = models.CharField(max_length=255)
    authors = models.TextField()
    publishers = models.TextField()
    publish_date = models.CharField(max_length=50, )
    cover = models.URLField(null=True, blank=True)
