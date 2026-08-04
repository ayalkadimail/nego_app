from rest_framework.permissions import BasePermission
from .models import Utilisateur


class HasRole(BasePermission):
    """
    Permission temporaire, en attendant AUTH_USER_MODEL + vraie authentification.
    Lit l'en-tête X-User-Id, retrouve l'Utilisateur, vérifie son rôle.

    Le jour de la bascule : ne toucher QUE _get_utilisateur() pour qu'elle
    retourne request.user à la place. has_permission() et allowed_roles
    ne changent pas.
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
        request.utilisateur = utilisateur  # accessible dans la vue si besoin
        allowed = getattr(view, 'allowed_roles', None)
        if allowed is None:
            return True  # authentifié, tout rôle accepté
        return utilisateur.role in allowed