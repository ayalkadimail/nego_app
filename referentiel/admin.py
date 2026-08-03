# referentiel/admin.py
from django.contrib import admin
from .models import Article, Fournisseur, MpnQualifie

admin.site.register(Article)
admin.site.register(Fournisseur)
admin.site.register(MpnQualifie)