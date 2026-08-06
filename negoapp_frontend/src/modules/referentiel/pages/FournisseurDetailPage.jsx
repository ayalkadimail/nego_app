import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFournisseurDetail } from '../hooks/useFournisseurDetail';
import { updateFournisseur } from '../../../api/referentiel';

export default function FournisseurDetailPage() {
  const { id } = useParams();
  const { fournisseur, loading, error, refetch } = useFournisseurDetail(id);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  if (loading) return <div className="text-slate-400">Chargement...</div>;
  if (error) return <div className="text-rust-600">{error}</div>;
  if (!fournisseur) return null;

  const current = form || fournisseur;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateFournisseur(id, { nom: current.nom, contact: current.contact, actif: current.actif });
      await refetch();
      setForm(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link to="/referentiel/fournisseurs" className="text-sm text-slate-500 hover:underline">
        ← Retour à la liste
      </Link>

      <h1 className="text-2xl font-bold text-navy-950 mt-3">{fournisseur.nom}</h1>
      <p className="text-sm text-slate-500 mb-6">Fiche fournisseur</p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 max-w-lg">
        <h2 className="font-semibold text-navy-950">Informations générales</h2>

        <div>
          <label className="text-sm font-medium text-navy-950">Nom</label>
          <input
            required
            value={current.nom}
            onChange={(e) => setForm({ ...current, nom: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-950">Contact</label>
          <input
            value={current.contact}
            onChange={(e) => setForm({ ...current, contact: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          />
        </div>


        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={current.actif}
            onChange={(e) => setForm({ ...current, actif: e.target.checked })}
          />
          Fournisseur actif (peut être sollicité sur de nouvelles négociations)
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link to="/referentiel/fournisseurs" className="px-5 py-2 rounded-lg border border-slate-300 text-sm font-medium">
            Annuler
          </Link>
        </div>
      </form>

      <div className="bg-white border border-slate-200 rounded-lg p-6 mt-4 max-w-lg">
        <h2 className="font-semibold text-navy-950 mb-2">Historique des négociations</h2>
        <p className="text-sm text-slate-400">
          {fournisseur.nb_negociations_actives} négociation{fournisseur.nb_negociations_actives > 1 ? 's' : ''} active{fournisseur.nb_negociations_actives > 1 ? 's' : ''} au total — détail ligne par ligne disponible avec le module Négociations (à venir).
        </p>
      </div>
    </div>
  );
}
