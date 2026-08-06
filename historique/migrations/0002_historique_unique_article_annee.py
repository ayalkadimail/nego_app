from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('historique', '0001_initial')]
    operations = [
        migrations.AddConstraint(
            model_name='historiquenego',
            constraint=models.UniqueConstraint(fields=('article', 'annee'), name='uniq_historique_article_annee'),
        ),
    ]
