from django.db import models
from referentiel.models import Article, Fournisseur
from users.models import Utilisateur


class Negociation(models.Model):
    code_nego = models.CharField(max_length=100, unique=True)  # séquence annuelle, ex. NEGO-2026-0001
    annee = models.IntegerField()
    statut = models.CharField(max_length=20)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_cloture = models.DateTimeField(null=True, blank=True)
    commentaire = models.TextField(blank=True)
    utilisateur = models.ForeignKey(Utilisateur, on_delete=models.PROTECT, related_name='negociations')

    def __str__(self):
        return self.code_nego


class NegociationArticle(models.Model):
    negociation = models.ForeignKey(Negociation, on_delete=models.CASCADE, related_name='articles_negocies')
    article = models.ForeignKey(Article, on_delete=models.PROTECT, related_name='negociations_liees')
    forecast = models.IntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['negociation', 'article'], name='uniq_negociation_article')
        ]

    def __str__(self):
        return f"{self.negociation.code_nego} — {self.article.cpn}"


class ConsultationFournisseur(models.Model):
    """Trace qu'un fournisseur a été sollicité sur un article d'une négociation,
    avant même qu'il ait répondu avec un prix (OffreFournisseur)."""
    negociation_article = models.ForeignKey(NegociationArticle, on_delete=models.CASCADE, related_name='consultations')
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.PROTECT)
    date_consultation = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['negociation_article', 'fournisseur'], name='uniq_consultation')
        ]


class OffreFournisseur(models.Model):
    negociation_article = models.ForeignKey(NegociationArticle, on_delete=models.CASCADE, related_name='offres')
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.PROTECT)

    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=4)
    prix_avant_nego = models.DecimalField(max_digits=12, decimal_places=4, null=True, blank=True)
    devise = models.CharField(max_length=3)
    taux_change_applique = models.DecimalField(max_digits=12, decimal_places=6)
    prix_eur = models.DecimalField(max_digits=12, decimal_places=4)
    moq = models.IntegerField()
    mpq = models.IntegerField()
    lead_time = models.IntegerField()
    ncnr = models.BooleanField(default=False)
    source_prix = models.CharField(max_length=100, blank=True)
    date_validite = models.DateField()
    retenu = models.BooleanField(default=False)


class PrixReference(models.Model):
    TYPE_CHOICES = [('PMA', 'PMA'), ('PAV', 'PAV')]  # 'NEGO' retiré -> vit dans HistoriqueNego
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    prix_eur = models.DecimalField(max_digits=12, decimal_places=4)
    annee = models.IntegerField()
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='prix_references')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['article', 'type', 'annee'], name='uniq_prix_reference')
        ]


class Saving(models.Model):
    saving_vs_pma = models.DecimalField(max_digits=12, decimal_places=4)
    saving_vs_pav = models.DecimalField(max_digits=12, decimal_places=4)
    saving_vs_nego_n1 = models.DecimalField(max_digits=12, decimal_places=4)
    saving_vs_pav_n1 = models.DecimalField(max_digits=12, decimal_places=4)
    gap = models.DecimalField(max_digits=6, decimal_places=2)
    classement = models.IntegerField()
    offre = models.OneToOneField(OffreFournisseur, on_delete=models.CASCADE, related_name='saving')