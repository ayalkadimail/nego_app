from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import OffreViewSet, OffreImportPreviewView, OffreImportConfirmView

router = DefaultRouter()
router.register('offres', OffreViewSet, basename='offre')
urlpatterns = router.urls + [
    path('offres/import/preview/', OffreImportPreviewView.as_view()),
    path('offres/import/confirm/', OffreImportConfirmView.as_view()),
]
