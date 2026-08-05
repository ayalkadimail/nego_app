from django.db.models import Count, Q, Min, Subquery, OuterRef
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from users.permissions import HasRole
from .models import Negociation, NegociationArticle, OffreFournisseur
from .serializers import (
    NegociationCreateSerializer, NegociationListSerializer,
    NegociationDetailSerializer, NegociationArticleDetailSerializer,
)


class NegociationViewSet(viewsets.ModelViewSet):
    permission_classes = [HasRole]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['statut', 'annee']

    def get_queryset(self):
        qs = Negociation.objects.all().order_by('-date_creation')
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(code_nego__icontains=search) |
                Q(articles_negocies__article__cpn__icontains=search) |
                Q(articles_negocies__offres__fournisseur__nom__icontains=search)
            ).distinct()

        if self.action == 'list':
            qs = qs.annotate(
                nb_articles=Count('articles_negocies', distinct=True),
                nb_offres=Count('articles_negocies__offres', distinct=True),
            )
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return NegociationCreateSerializer
        if self.action == 'list':
            return NegociationListSerializer
        return NegociationDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        negociation = serializer.save()
        output = NegociationDetailSerializer(negociation)
        return Response(output.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        if 'statut' in request.data:
            return Response(
                {"detail": "Le statut ne peut être modifié que via l'action /cloturer/, pas par modification directe."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
        
    def destroy(self, request, *args, **kwargs):
        negociation = self.get_object()
        if OffreFournisseur.objects.filter(negociation_article__negociation=negociation).exists():
            return Response(
                {"detail": "Impossible de supprimer une négociation contenant des offres reçues."},
                status=status.HTTP_409_CONFLICT
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def articles(self, request, pk=None):
        negociation = self.get_object()
        qs = NegociationArticle.objects.filter(negociation=negociation).select_related('article').annotate(
            nb_offres=Count('offres', distinct=True),
            meilleur_prix=Min('offres__prix_eur'),
            fournisseur_retenu=Subquery(
                OffreFournisseur.objects.filter(negociation_article=OuterRef('pk'), retenu=True)
                .values('fournisseur__nom')[:1]
            ),
        ).order_by('article__cpn')

        page = self.paginate_queryset(qs)
        serializer = NegociationArticleDetailSerializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    @action(detail=True, methods=['post'])
    def cloturer(self, request, pk=None):
        negociation = self.get_object()
        if negociation.statut != 'OUVERTE':
            return Response({"detail": "Cette négociation n'est pas ouverte."}, status=400)

        articles = NegociationArticle.objects.filter(negociation=negociation).select_related('article').annotate(
            nb_offres=Count('offres', distinct=True),
            nb_retenues=Count('offres', filter=Q(offres__retenu=True), distinct=True),
        )

        bloquants = []
        for na in articles:
            if na.nb_retenues == 0:
                detail = (f"{na.nb_offres} offre(s) reçue(s), aucune retenue"
                           if na.nb_offres else "0 fournisseur consulté")
                bloquants.append({'article_id': na.article_id, 'cpn': na.article.cpn, 'detail': detail})

        if bloquants:
            return Response({
                "detail": "Chaque article doit avoir un fournisseur retenu avant la clôture.",
                "regle": "RM-18",
                "articles_bloquants": bloquants,
            }, status=status.HTTP_409_CONFLICT)

        negociation.statut = 'CLOTUREE'
        negociation.date_cloture = timezone.now()
        negociation.save()
        return Response(NegociationDetailSerializer(negociation).data)