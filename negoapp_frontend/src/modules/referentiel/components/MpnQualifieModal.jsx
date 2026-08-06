import { useState } from 'react';
import { createMpnQualifie } from '../../../api/referentiel';

export default function MpnQualifieModal({ articleId, onClose, onCreated }) {
  const [form, setForm] = useState({
    mpn: '',
    mpn_ref_interne: '',
    pays_origine: '',
    fabricant_nom: '',
    statut_qualification: 'En cours',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await createMpnQualifie({ ...form, article: articleId });
      onCreated();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.non_field_errors?.[0] ||
        data?.detail ||
        "Impossible d'ajouter ce fabricant qualifié — vérifiez les champs."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold text-navy-950 mb-4">Ajouter un fabricant qualifié</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-500">Fabricant</label>
            <input
              required
              value={form.fabricant_nom}
              onChange={handleChange('fabricant_nom')}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              placeholder="ex: Leach International"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">MPN</label>
            <input
              required
              value={form.mpn}
              onChange={handleChange('mpn')}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              placeholder="ex: E205E1A1500"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Réf. interne</label>
            <input
              value={form.mpn_ref_interne}
              onChange={handleChange('mpn_ref_interne')}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              placeholder="ex: MPN0044120"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Pays d'origine</label>
            <input
              value={form.pays_origine}
              onChange={handleChange('pays_origine')}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              placeholder="ex: France"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Statut</label>
            <select
              value={form.statut_qualification}
              onChange={handleChange('statut_qualification')}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
            >
              <option value="En cours">En cours</option>
              <option value="Qualifié">Qualifié</option>
            </select>
          </div>

          {error && <div className="text-rust-600 text-sm">{error}</div>}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Ajout...' : 'Ajouter'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}