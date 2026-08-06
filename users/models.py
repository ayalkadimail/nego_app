from django.db import models

class Utilisateur(models.Model):
    ROLE_CHOICES = [
        ('ASC', 'Agent Sourcing et Contracting'),
        ('ADMINISTRATEUR', 'Administrateur'),
    ]
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    mot_de_passe = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.prenom} {self.nom}"