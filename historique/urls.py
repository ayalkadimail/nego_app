from django.urls import path
from .views import HistoriqueNegoListView

urlpatterns = [path('historique/', HistoriqueNegoListView.as_view(), name='historique-nego')]
