from django.db import transaction
from rest_framework import serializers

from referentiel.models import Article, Fournisseur
from .models import Negociation, NegociationArticle, ConsultationFournisseur, OffreFournisseur
from .services import generer_code_nego, creer_negociation_avec_retry


# ---- Création (étapes 1+2+3 des maquettes fusionnées en un seul appel) ----

class NegociationArticleInputSerializer(serializers.Serializer):
    article = serializers.PrimaryKeyRelatedField(queryset=Article.objects.all())
    forecast = serializers.IntegerField(min_value=0)
    fournisseurs = serializers.PrimaryKeyRelatedField(
        queryset=Fournisseur.objects.filter(actif=True), many=True, required=False, default=list
    )


class NegociationCreateSerializer(serializers.Serializer):
    annee = serializers.IntegerField()
    commentaire = serializers.CharField(required=False, allow_blank=True, default='')
    articles = NegociationArticleInputSerializer(many=True)

    def validate_articles(self, value):
        if not value:
            raise serializers.ValidationError("Au moins un article est requis.")
        ids = [item['article'].id for item in value]
        if len(ids) != len(set(ids)):
            raise serializers.ValidationError("Un même article ne peut pas apparaître deux fois dans la même négociation.")
        return value

    def create(self, validated_data):
        utilisateur = self.context['request'].utilisateur
        articles_data = validated_data['articles']
        annee = validated_data['annee']
        commentaire = validated_data.get('commentaire', '')

        def _create():
            code_nego = generer_code_nego(annee)
            negociation = Negociation.objects.create(
                code_nego=code_nego, annee=annee, statut='OUVERTE',
                commentaire=commentaire, utilisateur=utilisateur,
            )
            for item in articles_data:
                na = NegociationArticle.objects.create(
                    negociation=negociation, article=item['article'], forecast=item['forecast']
                )
                for fournisseur in item.get('fournisseurs', []):
                    ConsultationFournisseur.objects.create(negociation_article=na, fournisseur=fournisseur)
            return negociation

        return creer_negociation_avec_retry(_create)


# ---- Lecture ----

class NegociationListSerializer(serializers.ModelSerializer):
    nb_articles = serializers.IntegerField(read_only=True)
    nb_offres = serializers.IntegerField(read_only=True)
    saving_total = serializers.SerializerMethodField()

    class Meta:
        model = Negociation
        fields = ['id', 'code_nego', 'annee', 'statut', 'date_creation', 'nb_articles', 'nb_offres', 'saving_total']

    def get_saving_total(self, obj):
        return None  # en attente du moteur de calcul — Module 4


class NegociationDetailSerializer(serializers.ModelSerializer):
    utilisateur_nom = serializers.SerializerMethodField()

    class Meta:
        model = Negociation
        fields = ['id', 'code_nego', 'annee', 'statut', 'date_creation', 'date_cloture',
                  'commentaire', 'utilisateur', 'utilisateur_nom']
        read_only_fields = ['annee']

    def get_utilisateur_nom(self, obj):
        return f"{obj.utilisateur.prenom} {obj.utilisateur.nom}"

class NegociationArticleDetailSerializer(serializers.ModelSerializer):
    article_cpn = serializers.CharField(source='article.cpn', read_only=True)
    article_desc = serializers.CharField(source='article.short_desc', read_only=True)
    nb_offres = serializers.IntegerField(read_only=True)
    meilleur_prix = serializers.DecimalField(max_digits=12, decimal_places=4, read_only=True, allow_null=True)
    fournisseur_retenu = serializers.CharField(read_only=True, allow_null=True)
    fournisseurs_consultes = serializers.SerializerMethodField()

    class Meta:
        model = NegociationArticle
        fields = ['id', 'article', 'article_cpn', 'article_desc', 'forecast',
                  'nb_offres', 'meilleur_prix', 'fournisseur_retenu', 'fournisseurs_consultes']

    def get_fournisseurs_consultes(self, obj):
        return list(
            obj.consultations.values_list('fournisseur__nom', flat=True)
        )