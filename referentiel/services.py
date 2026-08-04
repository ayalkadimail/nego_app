import openpyxl

from .models import Article, Fournisseur

ARTICLE_COLUMNS = ['CPN', 'Désignation', 'Famille achats', 'Catégorie', 'Client', 'Site', 'Obsolète']
FOURNISSEUR_COLUMNS = ['Nom', 'Contact', 'Actif']

FAMILLES_VALIDES = {c[0] for c in Article.FAMILLE_ACHAT_CHOICES}
CATEGORIES_VALIDES = {c[0] for c in Article.CATEGORIE_CHOICES}


def _lire_lignes(fichier):
    wb = openpyxl.load_workbook(fichier, data_only=True, read_only=True)
    ws = wb.active
    lignes = list(ws.iter_rows(values_only=True))
    if not lignes:
        return [], []
    entete = [str(h).strip() if h else '' for h in lignes[0]]
    return entete, lignes[1:]


def _valeur(d, cle):
    v = d.get(cle)
    return str(v).strip() if v not in (None, '') else ''


def _bool_fr(valeur, defaut=False):
    if valeur in (None, ''):
        return defaut
    return str(valeur).strip().lower() in ('oui', 'true', '1', 'vrai')


def valider_articles(fichier):
    entete, lignes = _lire_lignes(fichier)
    manquantes = [c for c in ARTICLE_COLUMNS if c not in entete]
    if manquantes:
        raise ValueError(f"Colonnes manquantes : {', '.join(manquantes)}")

    existants = set(Article.objects.values_list('cpn', flat=True))
    vus_dans_fichier = set()
    rapport, lignes_valides = [], []

    for i, ligne in enumerate(lignes, start=2):
        d = dict(zip(entete, ligne))
        cpn = _valeur(d, 'CPN')
        designation = _valeur(d, 'Désignation')

        if not cpn:
            rapport.append({'ligne': i, 'cpn': None, 'designation': designation,
                             'statut': 'ERREUR', 'detail': 'CPN manquant sur cette ligne'})
            continue
        if cpn in vus_dans_fichier:
            rapport.append({'ligne': i, 'cpn': cpn, 'designation': designation,
                             'statut': 'ERREUR', 'detail': f'CPN {cpn} en double dans le fichier'})
            continue
        vus_dans_fichier.add(cpn)

        famille_brute = _valeur(d, 'Famille achats')
        categorie_brute = _valeur(d, 'Catégorie')
        avertissements = []

        if not famille_brute:
            famille = 'Non catégorisé'
            avertissements.append('Famille achats absente — classé "Non catégorisé"')
        elif famille_brute not in FAMILLES_VALIDES:
            famille = ''
            avertissements.append(
                f'Famille achats "{famille_brute}" non reconnue — ligne ignorée, à corriger dans le fichier ou ajouter à la liste des familles'
            )
        else:
            famille = famille_brute

        if categorie_brute and categorie_brute not in CATEGORIES_VALIDES:
            avertissements.append(f'Catégorie "{categorie_brute}" non reconnue — laissée vide')
            categorie_brute = ''

        # Famille non reconnue = ligne bloquante (ERREUR), pas juste un avertissement,
        # car il n'y a pas de valeur de repli valable comme pour "vide" -> "Non catégorisé"
        if famille_brute and famille_brute not in FAMILLES_VALIDES:
            rapport.append({'ligne': i, 'cpn': cpn, 'designation': designation,
                             'statut': 'ERREUR',
                             'detail': f'Famille achats "{famille_brute}" non reconnue par NegoApp'})
            continue

        if cpn in existants:
            avertissements.append(f'CPN {cpn} déjà existant — sera mis à jour')

        row_data = {
            'cpn': cpn,
            'short_desc': designation,
            'famille_achat': famille,
            'categorie': categorie_brute,
            'customer': _valeur(d, 'Client'),
            'site': _valeur(d, 'Site'),
            'obsolete': _bool_fr(d.get('Obsolète')),
        }
        lignes_valides.append(row_data)

        rapport.append({
            'ligne': i, 'cpn': cpn, 'designation': designation,
            'statut': 'AVERTISSEMENT' if avertissements else 'OK',
            'detail': '; '.join(avertissements) if avertissements else None,
        })

    return rapport, lignes_valides


def commit_articles(lignes_valides):
    crees, mis_a_jour = 0, 0
    for row_data in lignes_valides:
        _, cree = Article.objects.update_or_create(cpn=row_data['cpn'], defaults=row_data)
        crees += cree
        mis_a_jour += not cree
    return crees, mis_a_jour


def valider_fournisseurs(fichier):
    entete, lignes = _lire_lignes(fichier)
    manquantes = [c for c in FOURNISSEUR_COLUMNS if c not in entete]
    if manquantes:
        raise ValueError(f"Colonnes manquantes : {', '.join(manquantes)}")

    vus_dans_fichier = set()
    rapport, lignes_valides = [], []

    for i, ligne in enumerate(lignes, start=2):
        d = dict(zip(entete, ligne))
        nom = _valeur(d, 'Nom')
        contact = _valeur(d, 'Contact')

        if not nom:
            rapport.append({'ligne': i, 'nom': None, 'contact': contact,
                             'statut': 'ERREUR', 'detail': 'Nom manquant sur cette ligne'})
            continue
        if nom in vus_dans_fichier:
            rapport.append({'ligne': i, 'nom': nom, 'contact': contact,
                             'statut': 'ERREUR', 'detail': f'Fournisseur {nom} en double dans le fichier'})
            continue
        vus_dans_fichier.add(nom)

        avertissements = []
        if not contact:
            avertissements.append('Contact absent — fournisseur créé sans coordonnées')

        row_data = {'nom': nom, 'contact': contact, 'actif': _bool_fr(d.get('Actif'), defaut=True)}
        lignes_valides.append(row_data)

        rapport.append({
            'ligne': i, 'nom': nom, 'contact': contact,
            'statut': 'AVERTISSEMENT' if avertissements else 'OK',
            'detail': '; '.join(avertissements) if avertissements else None,
        })

    return rapport, lignes_valides


def commit_fournisseurs(lignes_valides):
    crees, mis_a_jour = 0, 0
    for row_data in lignes_valides:
        _, cree = Fournisseur.objects.update_or_create(nom=row_data['nom'], defaults=row_data)
        crees += cree
        mis_a_jour += not cree
    return crees, mis_a_jour