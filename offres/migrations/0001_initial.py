import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = [('referentiel', '0002_alter_article_categorie_alter_article_famille_achat')]
    operations = [migrations.CreateModel(
        name='Offre',
        fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('prix_unitaire', models.DecimalField(decimal_places=4, max_digits=12)), ('devise', models.CharField(default='EUR', max_length=3)),
            ('moq', models.PositiveIntegerField(default=1)), ('mpq', models.PositiveIntegerField(default=1)),
            ('lead_time', models.PositiveIntegerField(default=0)), ('ncnr', models.BooleanField(default=False)),
            ('source_prix', models.CharField(blank=True, max_length=255)), ('date_validite', models.DateField(blank=True, null=True)),
            ('date_creation', models.DateTimeField(auto_now_add=True)), ('date_modification', models.DateTimeField(auto_now=True)),
            ('article', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='offres_fournisseurs', to='referentiel.article')),
            ('fournisseur', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='offres', to='referentiel.fournisseur')),
        ], options={'ordering': ['article__cpn', 'fournisseur__nom', '-date_modification']},
    )]
