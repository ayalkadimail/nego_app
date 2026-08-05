import re
from django.db import transaction, IntegrityError


def generer_code_nego(annee):
    """Verrouille les lignes correspondantes (select_for_update) le temps de la
    transaction englobante, pour empêcher deux créations simultanées de calculer
    le même prochain numéro de séquence. Coût quasi nul : le nombre de négociations
    par année reste petit, et on est déjà dans une transaction atomique appelante."""
    from .models import Negociation
    prefix = f"NEGO-{annee}-"
    codes = (
        Negociation.objects.select_for_update()
        .filter(code_nego__startswith=prefix)
        .values_list('code_nego', flat=True)
    )
    max_seq = 0
    for code in codes:
        m = re.match(rf'^{re.escape(prefix)}(\d+)$', code)
        if m:
            max_seq = max(max_seq, int(m.group(1)))
    return f"{prefix}{max_seq + 1:04d}"


def creer_negociation_avec_retry(create_fn, max_essais=3):
    """Filet de sécurité résiduel : avec select_for_update en place, une collision
    sur code_nego devient très improbable (uniquement si deux requêtes concurrentes
    se chevauchent avant que le verrou ne soit posé, ce que Django empêche déjà en
    pratique dans ce flux). On garde le retry pour ne jamais renvoyer une 400 brute
    à l'utilisateur dans le pire des cas plutôt que de supprimer ce filet."""
    for _ in range(max_essais):
        try:
            with transaction.atomic():
                return create_fn()
        except IntegrityError:
            continue
    raise IntegrityError("Impossible de générer un code de négociation unique après plusieurs essais.")