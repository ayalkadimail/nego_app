from django.db import migrations, models


def migrate_latest_pma(apps, schema_editor):
    Article = apps.get_model('referentiel', 'Article')
    PrixReference = apps.get_model('referentiel', 'PrixReference')
    for article in Article.objects.all():
        dernier_pma = PrixReference.objects.filter(article_id=article.id, type='PMA').order_by('-annee', '-id').first()
        if dernier_pma:
            article.pma = dernier_pma.prix_eur
            article.save(update_fields=['pma'])


class Migration(migrations.Migration):
    dependencies = [('referentiel', '0002_alter_article_categorie_alter_article_famille_achat')]
    operations = [
        migrations.AddField(model_name='article', name='pma', field=models.DecimalField(decimal_places=4, default=0, max_digits=12)),
        migrations.AddField(model_name='fournisseur', name='pva', field=models.DecimalField(decimal_places=4, default=0, max_digits=12)),
        migrations.RunPython(migrate_latest_pma, migrations.RunPython.noop),
    ]
