import ImportWizard from '../components/ImportWizard';
import { previewImportArticles, confirmImportArticles } from '../../../api/referentiel';

export default function ArticleImportPage() {
  return (
    <ImportWizard
      title="Import des articles"
      formatHint="Format Base RFQ 2026 (EF-04) : une ligne par source qualifiée. Colonnes obligatoires : EPN_REF, EPN_DESIGNATION, Famille achats, Catégorie, Client, SITE. Colonnes optionnelles reconnues : ACCURIS_ID, Nb_Sources, Nb_fabricants, Acheteur, EPN_LONG_DESCRIPTION, MPN_REF, MPN_FAB_NOM, MPN_FAB_DESIGNATION, MPN_FAB_REFERENCE, ACCURIS_COUNTRY__ORIGIN, Fournisseur, SRC_AUTORISATION, SRC_AUTORISATION_DT, Description libre, PMA, Obsolète."
      backLink="/referentiel/articles"
      onPreview={previewImportArticles}
      onConfirm={confirmImportArticles}
      ligneColumns={[
        { key: 'cpn', label: 'EPN_REF' },
        { key: 'designation', label: 'Désignation' },
        { key: 'mpn', label: 'MPN fabricant' },
      ]}
    />
  );
}