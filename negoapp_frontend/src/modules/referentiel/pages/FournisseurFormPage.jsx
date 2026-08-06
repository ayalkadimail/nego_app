import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createFournisseur } from '../../../api/referentiel';

export default function FournisseurFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', contact: '', actif: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await createFournisseur(form);
      navigate(`/referentiel/fournisseurs/${created.id}`);
    } catch (err) {
      setError(err.response?.data?.nom?.[0] || "Impossible de créer le fournisseur.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link to="/referentiel/fournisseurs" className="text-sm text-slate-500 hover:underline">
        ← Retour à la liste
      </Link>

      <h1 className="text-2xl font-bold text-navy-950 mt-3">Ajouter un fournisseur</h1>
      <p className="text-sm text-slate-500 mb-6">Création d'une fiche fournisseur dans le référentiel</p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 max-w-lg">
        <div>
          <label className="text-sm font-medium text-navy-950">Nom</label>
          <input
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            placeholder="ex: Souriau"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-950">Contact</label>
          <input
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            placeholder="ex: contact@souriau.com"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.actif}
            onChange={(e) => setForm({ ...form, actif: e.target.checked })}
          />
          Fournisseur actif (peut être sollicité sur de nouvelles négociations)
        </label>

        <p className="text-xs text-slate-400">Aucun historique de négociation à ce stade — ce fournisseur vient d'être créé.</p>

        {error && <div className="text-rust-600 text-sm">{error}</div>}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Création...' : 'Créer le fournisseur'}
          </button>
          <Link to="/referentiel/fournisseurs" className="px-5 py-2 rounded-lg border border-slate-300 text-sm font-medium">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}