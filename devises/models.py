from django.db import models

class Devise(models.Model):
    code = models.CharField(max_length=3, primary_key=True)  # EUR, USD, GBP...
    taux_eur = models.DecimalField(max_digits=12, decimal_places=6)
    date_maj = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code