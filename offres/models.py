from django.db import models
from referentiel.models import Article, Fournisseur


class Offre(models.Model):
    """Offre fournisseur autonome : elle ne dépend d'aucune négociation."""
    article = models.ForeignKey(Article, on_delete=models.PROTECT, related_name='offres_fournisseurs')
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.PROTECT, related_name='offres')
    prix_unitaire = models.DecimalField(max_digits=12, decimal_places=4)
    pva = models.DecimalField(max_digits=12, decimal_places=4, default=0)
    devise = models.CharField(max_length=3, default='EUR')
    moq = models.PositiveIntegerField(default=1)
    mpq = models.PositiveIntegerField(default=1)
    lead_time = models.PositiveIntegerField(default=0)
    ncnr = models.BooleanField(default=False)
    source_prix = models.CharField(max_length=255, blank=True)
    date_validite = models.DateField(null=True, blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['article__cpn', 'fournisseur__nom', '-date_modification']

    def __str__(self):
        return f'{self.article.cpn} — {self.fournisseur.nom}'
