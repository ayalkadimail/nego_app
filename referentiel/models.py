# referentiel/models.py
from django.db import models

class Fournisseur(models.Model):
    nom = models.CharField(max_length=200)
    contact = models.CharField(max_length=200, blank=True)
    actif = models.BooleanField(default=True)
    devise = models.CharField(max_length=3)  # devise par défaut du fournisseur

    def __str__(self):
        return self.nom


class Article(models.Model):
    cpn = models.CharField(max_length=100, unique=True)
    short_desc = models.CharField(max_length=255, blank=True)
    long_desc = models.TextField(blank=True)
    customer = models.CharField(max_length=150, blank=True)
    site = models.CharField(max_length=150, blank=True)
    forecast = models.IntegerField(default=0)

    def __str__(self):
        return self.cpn


class MpnQualifie(models.Model):
    mpn = models.CharField(max_length=100)
    fabricant_nom = models.CharField(max_length=200)
    statut_qualification = models.CharField(max_length=50)
    date_qualification = models.DateField(null=True, blank=True)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='mpn_qualifies')

    def __str__(self):
        return f"{self.mpn} ({self.fabricant_nom})"