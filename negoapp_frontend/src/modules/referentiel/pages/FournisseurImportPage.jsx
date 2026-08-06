import ImportWizard from '../components/ImportWizard';
import { previewImportFournisseurs, confirmImportFournisseurs } from '../../../api/referentiel';

export default function FournisseurImportPage() {
  return (
    <ImportWizard
      title="Import du référentiel fournisseurs"
      formatHint="Le fichier doit respecter le modèle NegoApp (colonnes fixes : Nom, Contact, Actif)."
      backLink="/referentiel/fournisseurs"
      onPreview={previewImportFournisseurs}
      onConfirm={confirmImportFournisseurs}
      ligneColumns={[
        { key: 'nom', label: 'Nom' },
        { key: 'contact', label: 'Contact' },
      ]}
    />
  );
}