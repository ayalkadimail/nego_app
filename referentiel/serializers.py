from rest_framework import serializers
from .models import Article, Fournisseur, MpnQualifie, PrixReference


class MpnQualifieSerializer(serializers.ModelSerializer):
    class Meta:
        model = MpnQualifie
        fields = ['id', 'mpn', 'mpn_ref_interne', 'pays_origine',
                  'fabricant_nom', 'statut_qualification', 'date_qualification', 'article']


class PrixReferenceSerializer(serializers.ModelSerializer):
    """Version imbriquée, lecture seule — utilisée dans ArticleDetailSerializer."""
    class Meta:
        model = PrixReference
        fields = ['type', 'prix_eur', 'annee']


class PrixReferenceWriteSerializer(serializers.ModelSerializer):
    """Version autonome pour le CRUD admin (endpoint /api/prix-references/)."""
    class Meta:
        model = PrixReference
        fields = ['id', 'article', 'type', 'prix_eur', 'annee']


class ArticleListSerializer(serializers.ModelSerializer):
    nb_mpn_qualifies = serializers.IntegerField(read_only=True)
    pma = serializers.DecimalField(max_digits=12, decimal_places=4, read_only=True, allow_null=True)
    pav = serializers.DecimalField(max_digits=12, decimal_places=4, read_only=True, allow_null=True)

    class Meta:
        model = Article
        fields = ['id', 'cpn', 'short_desc', 'famille_achat', 'categorie',
                  'customer', 'site', 'obsolete', 'nb_mpn_qualifies', 'pma', 'pav']


class ArticleDetailSerializer(serializers.ModelSerializer):
    mpn_qualifies = MpnQualifieSerializer(many=True, read_only=True)
    prix_references = PrixReferenceSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = '__all__'


class FournisseurSerializer(serializers.ModelSerializer):
    nb_negociations_actives = serializers.IntegerField(read_only=True)

    class Meta:
        model = Fournisseur
        fields = ['id', 'nom', 'contact', 'actif', 'nb_negociations_actives']

class ArticleListSerializer(serializers.ModelSerializer):
    nb_mpn_qualifies = serializers.IntegerField(read_only=True)
    pma = serializers.DecimalField(max_digits=12, decimal_places=4, read_only=True, allow_null=True)
    pav = serializers.DecimalField(max_digits=12, decimal_places=4, read_only=True, allow_null=True)
    negociation_ouverte_code = serializers.CharField(read_only=True, allow_null=True)

    class Meta:
        model = Article
        fields = ['id', 'cpn', 'short_desc', 'famille_achat', 'categorie',
                  'customer', 'site', 'obsolete', 'nb_mpn_qualifies', 'pma', 'pav',
                  'negociation_ouverte_code']