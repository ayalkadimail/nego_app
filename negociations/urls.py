from rest_framework.routers import DefaultRouter
from .views import NegociationViewSet

router = DefaultRouter()
router.register('negociations', NegociationViewSet, basename='negociation')

urlpatterns = router.urls