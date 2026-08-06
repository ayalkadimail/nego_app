import ImportWizard from '../components/ImportWizard';
import { previewImportArticles, confirmImportArticles } from '../../../api/referentiel';

export default function ArticleImportPage() {
  return (
    <ImportWizard
      title="Import des articles"
      formatHint="Le fichier doit respecter le modèle NegoApp (colonnes fixes : CPN, Désignation, Famille achats, Catégorie, Client, Site, Obsolète)."
      backLink="/referentiel/articles"
      onPreview={previewImportArticles}
      onConfirm={confirmImportArticles}
      ligneColumns={[
        { key: 'cpn', label: 'CPN' },
        { key: 'designation', label: 'Désignation' },
      ]}
    />
  );
}
