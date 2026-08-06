import csv
from datetime import datetime
from decimal import Decimal, InvalidOperation
from io import TextIOWrapper

from django.db import transaction
from rest_framework import filters, status, viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from referentiel.models import Article, Fournisseur
from users.permissions import HasRole
from .models import Offre
from .serializers import OffreSerializer


class OffreViewSet(viewsets.ModelViewSet):
    queryset = Offre.objects.select_related('article', 'fournisseur').all()
    serializer_class = OffreSerializer
    permission_classes = [HasRole]
    filter_backends = [filters.SearchFilter]
    search_fields = ['article__cpn', 'article__short_desc', 'fournisseur__nom']


def _as_bool(value):
    return str(value or '').strip().lower() in ('1', 'oui', 'yes', 'true')


def _parse_rows(upload):
    if not upload.name.lower().endswith('.csv'):
        raise ValueError('Le format CSV est pris en charge dans cette version.')
    rows = csv.DictReader(TextIOWrapper(upload.file, encoding='utf-8-sig'))
    required = {'CPN', 'Prix unitaire'}
    if not required.issubset(set(rows.fieldnames or [])):
        raise ValueError('Colonnes attendues : CPN, Prix unitaire (Fournisseur facultatif si choisi à l’écran).')
    return list(rows)


class OffreImportPreviewView(APIView):
    permission_classes = [HasRole]
    parser_classes = [MultiPartParser]

    def post(self, request):
        upload = request.FILES.get('fichier')
        fournisseur_id = request.data.get('fournisseur')
        if not upload:
            return Response({'detail': 'Aucun fichier fourni.'}, status=400)
        try:
            rows = _parse_rows(upload)
        except ValueError as exc:
            return Response({'detail': str(exc)}, status=400)
        report = []
        for index, row in enumerate(rows, 2):
            cpn = (row.get('CPN') or '').strip()
            supplier = (row.get('Fournisseur') or '').strip()
            valid = bool(cpn and (supplier or fournisseur_id) and Article.objects.filter(cpn=cpn).exists())
            report.append({'ligne': index, 'cpn': cpn, 'fournisseur': supplier,
                           'prix_unitaire': row.get('Prix unitaire', ''), 'statut': 'OK' if valid else 'ERREUR',
                           'message': '' if valid else 'Article ou fournisseur introuvable / manquant.'})
        return Response({'nb_ok': sum(r['statut'] == 'OK' for r in report), 'nb_erreurs': sum(r['statut'] == 'ERREUR' for r in report), 'lignes': report})


class OffreImportConfirmView(APIView):
    permission_classes = [HasRole]
    parser_classes = [MultiPartParser]

    def post(self, request):
        upload = request.FILES.get('fichier')
        fournisseur_id = request.data.get('fournisseur')
        if not upload:
            return Response({'detail': 'Aucun fichier fourni.'}, status=400)
        try:
            rows = _parse_rows(upload)
        except ValueError as exc:
            return Response({'detail': str(exc)}, status=400)
        default_supplier = Fournisseur.objects.filter(pk=fournisseur_id, actif=True).first() if fournisseur_id else None
        created, ignored = 0, 0
        with transaction.atomic():
            for row in rows:
                article = Article.objects.filter(cpn=(row.get('CPN') or '').strip()).first()
                supplier = default_supplier or Fournisseur.objects.filter(nom__iexact=(row.get('Fournisseur') or '').strip(), actif=True).first()
                try:
                    price = Decimal((row.get('Prix unitaire') or '').replace(',', '.'))
                except (InvalidOperation, AttributeError):
                    price = None
                if not article or not supplier or price is None:
                    ignored += 1
                    continue
                date_value = None
                if row.get('Date de validité'):
                    for fmt in ('%d/%m/%Y', '%Y-%m-%d'):
                        try:
                            date_value = datetime.strptime(row['Date de validité'], fmt).date(); break
                        except ValueError:
                            pass
                Offre.objects.create(article=article, fournisseur=supplier, prix_unitaire=price,
                    devise=(row.get('Devise') or 'EUR').upper(), moq=int(row.get('MOQ') or 1),
                    mpq=int(row.get('MPQ') or 1), lead_time=int(row.get('Lead time') or 0),
                    ncnr=_as_bool(row.get('NCNR')), source_prix=row.get('Source du prix') or '', date_validite=date_value)
                created += 1
        return Response({'crees': created, 'lignes_ignorees': ignored}, status=status.HTTP_201_CREATED)
