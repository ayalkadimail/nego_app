from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [('referentiel', '0004_alter_prixreference_type')]
    operations = [migrations.RemoveField(model_name='fournisseur', name='pva')]
