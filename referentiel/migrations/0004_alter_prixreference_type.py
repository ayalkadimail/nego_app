from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('referentiel', '0003_article_pma_fournisseur_pva')]
    operations = [
        migrations.AlterField(model_name='prixreference', name='type', field=models.CharField(choices=[('PMA', 'PMA')], max_length=10)),
    ]
