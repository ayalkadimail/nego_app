from django.db import models
from referentiel.models import Article, Fournisseur
from users.models import Utilisateur

class Negociation(models.Model):
    code_nego = models.CharField(max_length=100, unique=True)
    annee = models.IntegerField()
    statut = models.CharField(max_length=20)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_cloture = models.DateTimeField(null=True, blank=True)
    commentaire = models.TextField(blank=True)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.PROTECT, related_name='negociations')

    def __str__(self):
        return self.code_nego


class OffreFournisseur(models.Model):
    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=4)
    devise = models.CharField(max_length=3)
    taux_change_applique = models.DecimalField(max_digits=12, decimal_places=6)
    prix_eur = models.DecimalField(max_digits=12, decimal_places=4)  # dynamique — calculé
    moq = models.IntegerField()
    mpq = models.IntegerField()
    lead_time = models.IntegerField()
    ncnr = models.BooleanField(default=False)
    source_prix = models.CharField(max_length=100, blank=True)
    date_validite = models.DateField()
    retenu = models.BooleanField(default=False)
    negociation = models.ForeignKey(Negociation, on_delete=models.CASCADE, related_name='offres')
    article = models.ForeignKey(Article, on_delete=models.PROTECT)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.PROTECT)


class PrixReference(models.Model):
    TYPE_CHOICES = [('PMA', 'PMA'), ('PAV', 'PAV'), ('NEGO', 'NEGO')]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    prix_eur = models.DecimalField(max_digits=12, decimal_places=4)
    annee = models.IntegerField()
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='prix_references')


class Saving(models.Model):
    saving_vs_pma = models.DecimalField(max_digits=12, decimal_places=4)
    saving_vs_pav = models.DecimalField(max_digits=12, decimal_places=4)
    saving_vs_n1 = models.DecimalField(max_digits=12, decimal_places=4)
    gap = models.DecimalField(max_digits=6, decimal_places=2)
    classement = models.IntegerField()
    offre = models.OneToOneField(OffreFournisseur, on_delete=models.CASCADE, related_name='saving')