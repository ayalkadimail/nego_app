from django.db import models


class Fournisseur(models.Model):
    nom = models.CharField(max_length=200)
    contact = models.CharField(max_length=200, blank=True)
    actif = models.BooleanField(default=True)

    def __str__(self):
        return self.nom


class Article(models.Model):
    cpn = models.CharField(max_length=100, unique=True)
    short_desc = models.CharField(max_length=255, blank=True)
    long_desc = models.TextField(blank=True)
    customer = models.CharField(max_length=150, blank=True)
    site = models.CharField(max_length=150, blank=True)
    famille_achat = models.CharField(max_length=150, blank=True)
    categorie = models.CharField(max_length=150, blank=True)
    obsolete = models.BooleanField(default=False)

    def __str__(self):
        return self.cpn


class MpnQualifie(models.Model):
    mpn = models.CharField(max_length=100)
    mpn_ref_interne = models.CharField(max_length=100, blank=True)
    pays_origine = models.CharField(max_length=100, blank=True)
    fabricant_nom = models.CharField(max_length=200)
    statut_qualification = models.CharField(max_length=50)
    date_qualification = models.DateField(null=True, blank=True)
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='mpn_qualifies')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['article', 'mpn'], name='uniq_article_mpn')
        ]

    def __str__(self):
        return f"{self.mpn} ({self.fabricant_nom})"


class PrixReference(models.Model):
    TYPE_CHOICES = [('PMA', 'PMA'), ('PAV', 'PAV')]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    prix_eur = models.DecimalField(max_digits=12, decimal_places=4)
    annee = models.IntegerField()
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='prix_references')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['article', 'type', 'annee'], name='uniq_prix_reference')
        ]

    def __str__(self):
        return f"{self.article.cpn} — {self.type} {self.annee}"