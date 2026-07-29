from django.db import models

class Article(models.Model):
    cpn = models.CharField(max_length=100, unique=True)
    mpn = models.CharField(max_length=100)
    fabricant = models.CharField(max_length=200)
    short_desc = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.cpn