import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, createArticle, updateArticle } from '../../../api/referentiel';
import { FAMILLES_ACHAT, CATEGORIES, CLIENTS, SITES } from '../constants';

const EMPTY_FORM = {
  cpn: '',
  short_desc: '',
  famille_achat: '',
  categorie: '',
  customer: '',
  site: '',
  obsolete: false,
};

export default function ArticleFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEdit) return;
    getArticle(id).then((article) => {
      setForm({
        cpn: article.cpn,
        short_desc: article.short_desc || '',
        famille_achat: article.famille_achat || '',
        categorie: article.categorie || '',
        customer: article.customer || '',
        site: article.site || '',
        obsolete: article.obsolete,
      });
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const saved = isEdit
        ? await updateArticle(id, form)
        : await createArticle(form);
      navigate(`/referentiel/articles/${saved.id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        setErrors(data);
      } else {
        setErrors({ non_field_errors: ["Une erreur est survenue lors de l'enregistrement."] });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-400">Chargement...</div>;

  return (
    <div>
      <Link
        to={isEdit ? `/referentiel/articles/${id}` : '/referentiel/articles'}
        className="text-sm text-slate-500 hover:underline"
      >
        ← Annuler
      </Link>

      <h1 className="text-2xl font-bold text-navy-950 mt-3">
        {isEdit ? "Modifier l'article" : 'Ajouter un article'}
      </h1>
      <p className="text-sm text-slate-500 mb-6">
        {isEdit ? `Édition de la fiche ${form.cpn}` : "Création d'une fiche article dans le référentiel"}
      </p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 grid grid-cols-2 gap-5">
        <div>
          <label className="text-sm font-medium text-navy-950">CPN</label>
          <input
            required
            disabled={isEdit}
            value={form.cpn}
            onChange={handleChange('cpn')}
            placeholder="ex: 00540A711A"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 disabled:bg-slate-100"
          />
          {errors.cpn && <p className="text-rust-600 text-xs mt-1">{errors.cpn[0]}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-navy-950">Désignation courte</label>
          <input
            required
            value={form.short_desc}
            onChange={handleChange('short_desc')}
            placeholder="ex: Relais électromécanique"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-navy-950">Famille achats</label>
          <select
            value={form.famille_achat}
            onChange={handleChange('famille_achat')}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          >
            <option value="">— Non catégorisé —</option>
            {FAMILLES_ACHAT.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-navy-950">Catégorie</label>
          <select
            value={form.categorie}
            onChange={handleChange('categorie')}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          >
            <option value="">— Non renseigné —</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-navy-950">Client</label>
          <select
            value={form.customer}
            onChange={handleChange('customer')}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          >
            <option value="">— Non renseigné —</option>
            {CLIENTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-navy-950">Site</label>
          <select
            value={form.site}
            onChange={handleChange('site')}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1"
          >
            <option value="">— Non renseigné —</option>
            {SITES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {isEdit && (
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="obsolete"
              checked={form.obsolete}
              onChange={handleChange('obsolete')}
            />
            <label htmlFor="obsolete" className="text-sm">Marquer comme obsolète</label>
          </div>
        )}

        {!isEdit && (
          <div className="col-span-2">
            <label className="text-sm font-medium text-navy-950">PMA / PAV</label>
            <input
              disabled
              placeholder="Réservé à l'administrateur"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 mt-1 bg-slate-100 text-slate-400"
            />
            <p className="text-xs text-slate-400 mt-1">Sera renseigné séparément par l'Admin</p>
          </div>
        )}

        {errors.non_field_errors && (
          <div className="col-span-2 text-rust-600 text-sm">{errors.non_field_errors[0]}</div>
        )}

        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : (isEdit ? 'Enregistrer' : "Créer l'article")}
          </button>
          <Link
            to={isEdit ? `/referentiel/articles/${id}` : '/referentiel/articles'}
            className="px-5 py-2 rounded-lg border border-slate-300 text-sm font-medium"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}