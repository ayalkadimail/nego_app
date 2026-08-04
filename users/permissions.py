from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Utilisateur


class HasRole(BasePermission):
    """
    Permission temporaire, en attendant AUTH_USER_MODEL + vraie authentification.
    Lit l'en-tête X-User-Id, retrouve l'Utilisateur, vérifie son rôle.

    Deux modes possibles sur une vue :
    - allowed_roles seul : s'applique à TOUTES les méthodes (GET inclus)
    - allowed_roles + read_open_to_all_roles = True : la lecture (GET/HEAD/OPTIONS)
      est ouverte à tout utilisateur authentifié quel que soit son rôle,
      seules les méthodes d'écriture (POST/PUT/PATCH/DELETE) sont restreintes
      à allowed_roles.

    Le jour de la bascule vers la vraie auth : ne toucher QUE _get_utilisateur()
    pour qu'elle retourne request.user à la place. Rien d'autre ne change.
    """
    def _get_utilisateur(self, request):
        user_id = request.headers.get('X-User-Id')
        if not user_id:
            return None
        try:
            return Utilisateur.objects.get(pk=user_id, is_active=True)
        except Utilisateur.DoesNotExist:
            return None

    def has_permission(self, request, view):
        utilisateur = self._get_utilisateur(request)
        if utilisateur is None:
            return False
        request.utilisateur = utilisateur

        allowed = getattr(view, 'allowed_roles', None)
        if allowed is None:
            return True  # authentifié, tout rôle accepté, aucune restriction

        read_open = getattr(view, 'read_open_to_all_roles', False)
        if read_open and request.method in SAFE_METHODS:
            return True  # lecture ouverte, peu importe le rôle

        return utilisateur.role in allowed