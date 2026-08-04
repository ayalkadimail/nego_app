from django.db.models import Count, Subquery, OuterRef, Q
from django.db.models.deletion import ProtectedError
from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from django_filters.rest_framework import DjangoFilterBackend

from users.permissions import HasRole
from . import services
from .models import Article, Fournisseur, MpnQualifie, PrixReference
from .serializers import (
    ArticleListSerializer, ArticleDetailSerializer,
    FournisseurSerializer, MpnQualifieSerializer,
    PrixReferenceWriteSerializer,
)


class SafeDeleteMixin:
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"detail": "Impossible de supprimer : cet élément est référencé "
                            "dans au moins une négociation. Désactivez-le plutôt."},
                status=status.HTTP_409_CONFLICT
            )


class ArticleViewSet(SafeDeleteMixin, viewsets.ModelViewSet):
    permission_classes = [HasRole]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['famille_achat', 'categorie', 'customer', 'site', 'obsolete']
    search_fields = ['cpn', 'short_desc', 'long_desc']

    def get_queryset(self):
        qs = Article.objects.all().order_by('cpn')
        if self.action == 'list':
            pma_sq = PrixReference.objects.filter(
                article=OuterRef('pk'), type='PMA'
            ).order_by('-annee').values('prix_eur')[:1]
            pav_sq = PrixReference.objects.filter(
                article=OuterRef('pk'), type='PAV'
            ).order_by('-annee').values('prix_eur')[:1]
            negociation_sq = Article.objects.filter(pk=OuterRef('pk')) \
                .filter(negociations_liees__negociation__statut='OUVERTE') \
                .order_by('-negociations_liees__negociation__date_creation') \
                .values('negociations_liees__negociation__code_nego')[:1]

            qs = qs.annotate(
                nb_mpn_qualifies=Count('mpn_qualifies', distinct=True),
                pma=Subquery(pma_sq),
                pav=Subquery(pav_sq),
                negociation_ouverte_code=Subquery(negociation_sq),
            )
        else:
            qs = qs.prefetch_related('mpn_qualifies', 'prix_references')
        return qs

    def get_serializer_class(self):
        return ArticleListSerializer if self.action == 'list' else ArticleDetailSerializer


class FournisseurViewSet(SafeDeleteMixin, viewsets.ModelViewSet):
    serializer_class = FournisseurSerializer
    permission_classes = [HasRole]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['actif']
    search_fields = ['nom', 'contact']

    def get_queryset(self):
        return Fournisseur.objects.annotate(
            nb_negociations_actives=Count(
                'offrefournisseur__negociation_article__negociation',
                filter=Q(offrefournisseur__negociation_article__negociation__statut='OUVERTE'),
                distinct=True
            )
        ).order_by('nom')


class MpnQualifieViewSet(viewsets.ModelViewSet):
    serializer_class = MpnQualifieSerializer
    permission_classes = [HasRole]

    def get_queryset(self):
        qs = MpnQualifie.objects.all()
        article_id = self.request.query_params.get('article')
        if article_id:
            qs = qs.filter(article_id=article_id)
        return qs


class PrixReferenceViewSet(viewsets.ModelViewSet):
    queryset = PrixReference.objects.all().order_by('article', 'type', '-annee')
    serializer_class = PrixReferenceWriteSerializer
    permission_classes = [HasRole]
    allowed_roles = ['ADMINISTRATEUR']


# ---- Import EF-04 : Articles ----

class ArticleImportPreviewView(APIView):
    permission_classes = [HasRole]
    parser_classes = [MultiPartParser]

    def post(self, request):
        fichier = request.FILES.get('fichier')
        if not fichier:
            return Response({"detail": "Aucun fichier fourni (champ 'fichier' attendu)."}, status=400)
        try:
            rapport, _ = services.valider_articles(fichier)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)
        return Response(_resume(rapport))


class ArticleImportConfirmView(APIView):
    permission_classes = [HasRole]
    parser_classes = [MultiPartParser]

    def post(self, request):
        fichier = request.FILES.get('fichier')
        if not fichier:
            return Response({"detail": "Aucun fichier fourni (champ 'fichier' attendu)."}, status=400)
        try:
            rapport, lignes_valides = services.valider_articles(fichier)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)
        crees, mis_a_jour = services.commit_articles(lignes_valides)
        return Response({
            "crees": crees, "mis_a_jour": mis_a_jour,
            "lignes_ignorees": len(rapport) - len(lignes_valides),
        })


# ---- Import EF-04 : Fournisseurs ----

class FournisseurImportPreviewView(APIView):
    permission_classes = [HasRole]
    parser_classes = [MultiPartParser]

    def post(self, request):
        fichier = request.FILES.get('fichier')
        if not fichier:
            return Response({"detail": "Aucun fichier fourni (champ 'fichier' attendu)."}, status=400)
        try:
            rapport, _ = services.valider_fournisseurs(fichier)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)
        return Response(_resume(rapport))


class FournisseurImportConfirmView(APIView):
    permission_classes = [HasRole]
    parser_classes = [MultiPartParser]

    def post(self, request):
        fichier = request.FILES.get('fichier')
        if not fichier:
            return Response({"detail": "Aucun fichier fourni (champ 'fichier' attendu)."}, status=400)
        try:
            rapport, lignes_valides = services.valider_fournisseurs(fichier)
        except ValueError as e:
            return Response({"detail": str(e)}, status=400)
        crees, mis_a_jour = services.commit_fournisseurs(lignes_valides)
        return Response({
            "crees": crees, "mis_a_jour": mis_a_jour,
            "lignes_ignorees": len(rapport) - len(lignes_valides),
        })


def _resume(rapport):
    return {
        "nb_ok": sum(1 for r in rapport if r['statut'] == 'OK'),
        "nb_avertissements": sum(1 for r in rapport if r['statut'] == 'AVERTISSEMENT'),
        "nb_erreurs": sum(1 for r in rapport if r['statut'] == 'ERREUR'),
        "lignes": rapport,
    }