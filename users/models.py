from django.db import models

class Utilisateur(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mot_de_passe = models.CharField(max_length=255)  # sera haché via Django auth plus tard
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=20)  # Acheteur / Admin

    def __str__(self):
        return f"{self.prenom} {self.nom}"