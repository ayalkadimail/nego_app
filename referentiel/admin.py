# referentiel/admin.py
from django.contrib import admin
from django.contrib import admin
from .models import Article, Fournisseur, MpnQualifie, PrixReference

admin.site.register(Article)
admin.site.register(Fournisseur)
admin.site.register(MpnQualifie)
admin.site.register(PrixReference)