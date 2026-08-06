from django.db import models
from referentiel.models import Article, Fournisseur

class HistoriqueNego(models.Model):
    annee = models.IntegerField()
    prix_final_eur = models.DecimalField(max_digits=12, decimal_places=4)
    moq_final = models.IntegerField()
    fournisseur_retenu_nom = models.CharField(max_length=200)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.SET_NULL, null=True)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='historique')