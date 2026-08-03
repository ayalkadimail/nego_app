# negociations/admin.py
from django.contrib import admin
from .models import Negociation, NegociationArticle, ConsultationFournisseur, OffreFournisseur, PrixReference, Saving

admin.site.register(Negociation)
admin.site.register(NegociationArticle)
admin.site.register(ConsultationFournisseur)
admin.site.register(OffreFournisseur)
admin.site.register(PrixReference)
admin.site.register(Saving)