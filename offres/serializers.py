from rest_framework import serializers
from .models import Offre


class OffreSerializer(serializers.ModelSerializer):
    article_cpn = serializers.CharField(source='article.cpn', read_only=True)
    article_desc = serializers.CharField(source='article.short_desc', read_only=True)
    fournisseur_nom = serializers.CharField(source='fournisseur.nom', read_only=True)

    class Meta:
        model = Offre
        fields = ['id', 'article', 'article_cpn', 'article_desc', 'fournisseur', 'fournisseur_nom',
                  'prix_unitaire', 'devise', 'moq', 'mpq', 'lead_time', 'ncnr', 'source_prix',
                  'date_validite', 'date_creation', 'date_modification']
