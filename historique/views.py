from django.db.models import OuterRef, Subquery, F, ExpressionWrapper, DecimalField
from rest_framework.generics import ListAPIView
from users.permissions import HasRole
from .models import HistoriqueNego
from .serializers import HistoriqueNegoSerializer

class HistoriqueNegoListView(ListAPIView):
    serializer_class = HistoriqueNegoSerializer
    permission_classes = [HasRole]

    def get_queryset(self):
        precedent = HistoriqueNego.objects.filter(
            article_id=OuterRef('article_id'), annee__lt=OuterRef('annee')
        ).order_by('-annee')
        qs = HistoriqueNego.objects.select_related('article', 'fournisseur').annotate(
            prix_n_1=Subquery(precedent.values('prix_final_eur')[:1]),
        ).order_by('article__cpn', '-annee')
        article = self.request.query_params.get('article')
        annee = self.request.query_params.get('annee')
        if article:
            qs = qs.filter(article_id=article)
        if annee:
            qs = qs.filter(annee=annee)
        return qs.annotate(
            variation_n_1=ExpressionWrapper(F('prix_final_eur') - F('prix_n_1'), output_field=DecimalField(max_digits=12, decimal_places=4)),
            variation_pct_n_1=ExpressionWrapper((F('prix_final_eur') - F('prix_n_1')) * 100 / F('prix_n_1'), output_field=DecimalField(max_digits=8, decimal_places=2)),
        )
