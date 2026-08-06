from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('offres', '0001_initial'),
        ('referentiel', '0005_remove_fournisseur_pva'),
    ]

    operations = [
        migrations.AddField(
            model_name='offre',
            name='pva',
            field=models.DecimalField(decimal_places=4, default=0, max_digits=12),
        ),
    ]
