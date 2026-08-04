from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    ArticleViewSet, FournisseurViewSet, MpnQualifieViewSet, PrixReferenceViewSet,
    ArticleImportPreviewView, ArticleImportConfirmView,
    FournisseurImportPreviewView, FournisseurImportConfirmView,
)

router = DefaultRouter()
router.register('articles', ArticleViewSet, basename='article')
router.register('fournisseurs', FournisseurViewSet, basename='fournisseur')
router.register('mpn-qualifies', MpnQualifieViewSet, basename='mpnqualifie')
router.register('prix-references', PrixReferenceViewSet, basename='prixreference')

urlpatterns = router.urls + [
    path('articles/import/preview/', ArticleImportPreviewView.as_view(), name='article-import-preview'),
    path('articles/import/confirm/', ArticleImportConfirmView.as_view(), name='article-import-confirm'),
    path('fournisseurs/import/preview/', FournisseurImportPreviewView.as_view(), name='fournisseur-import-preview'),
    path('fournisseurs/import/confirm/', FournisseurImportConfirmView.as_view(), name='fournisseur-import-confirm'),
]