from rest_framework import serializers
from .models import HistoriqueNego


class HistoriqueNegoSerializer(serializers.ModelSerializer):
    article_cpn = serializers.CharField(source='article.cpn', read_only=True)
    article_desc = serializers.CharField(source='article.short_desc', read_only=True)
    variation_n_1 = serializers.DecimalField(max_digits=12, decimal_places=4, read_only=True, allow_null=True)
    variation_pct_n_1 = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True, allow_null=True)

    class Meta:
        model = HistoriqueNego
        fields = ['id', 'annee', 'article', 'article_cpn', 'article_desc', 'fournisseur',
                  'fournisseur_retenu_nom', 'prix_final_eur', 'moq_final',
                  'variation_n_1', 'variation_pct_n_1']
