import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticleDetail } from '../hooks/useArticleDetail';
import MpnQualifieModal from '../components/MpnQualifieModal';

export default function ArticleDetailPage() {
  const { id } = useParams();
  const { article, loading, error, refetch } = useArticleDetail(id);
  const [showModal, setShowModal] = useState(false);

  if (loading) return <div className="text-slate-400">Chargement...</div>;
  if (error) return <div className="text-rust-600">{error}</div>;
  if (!article) return null;

  const pma = article.prix_references?.find((p) => p.type === 'PMA');
  const pav = article.prix_references?.find((p) => p.type === 'PAV');

  return (
    <div>
      <Link to="/referentiel/articles" className="text-sm text-slate-500 hover:underline">
        ← Retour à la liste
      </Link>

      <div className="bg-navy-950 text-white rounded-lg p-6 mt-3 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold font-mono">{article.cpn}</h1>
          <p className="text-slate-300 text-sm mt-1">
            {article.short_desc} · Client {article.customer || '—'} · Site {article.site || '—'}
          </p>
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{article.famille_achat || 'Non catégorisé'}</span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/10">
              {article.obsolete ? 'Obsolète' : 'Non obsolète'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/10">
              {article.mpn_qualifies?.length || 0} fabricant{article.mpn_qualifies?.length > 1 ? 's' : ''} qualifié{article.mpn_qualifies?.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <Link
          to={`/referentiel/articles/${article.id}/modifier`}
          className="px-4 py-2 rounded-lg bg-white text-navy-950 text-sm font-medium"
        >
          Modifier
        </Link>
      </div>

      {article.negociation_ouverte_code && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 flex justify-between items-center text-sm">
          <span>⚠ Une négociation est actuellement ouverte sur cet article — <strong>{article.negociation_ouverte_code}</strong></span>
          <Link to={`/negociations/${article.negociation_ouverte_code}`} className="px-3 py-1.5 rounded-lg bg-teal-700 text-white font-medium">
            Ouvrir la négociation
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="font-semibold text-navy-950 mb-3">Fabricants qualifiés</h2>
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase">
              <tr>
                <th className="text-left pb-2">Fabricant</th>
                <th className="text-left pb-2">MPN</th>
                <th className="text-left pb-2">Réf. interne</th>
                <th className="text-left pb-2">Pays</th>
                <th className="text-left pb-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {(article.mpn_qualifies || []).map((mpn) => (
                <tr key={mpn.id} className="border-t border-slate-100">
                  <td className="py-2 font-medium">{mpn.fabricant_nom}</td>
                  <td className="py-2 font-mono">{mpn.mpn}</td>
                  <td className="py-2 font-mono text-slate-500">{mpn.mpn_ref_interne || '—'}</td>
                  <td className="py-2">{mpn.pays_origine || '—'}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      mpn.statut_qualification === 'Qualifié' ? 'bg-teal-700/10 text-teal-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {mpn.statut_qualification}
                    </span>
                  </td>
                </tr>
              ))}
              {(!article.mpn_qualifies || article.mpn_qualifies.length === 0) && (
                <tr><td colSpan={5} className="py-4 text-center text-slate-400">Aucun fabricant qualifié</td></tr>
              )}
            </tbody>
          </table>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
          >
            + Ajouter un fabricant qualifié
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="font-semibold text-navy-950 mb-3">Prix de référence</h2>
            <div className="flex justify-between text-sm py-1.5 border-b border-slate-100">
              <span>PAV {pav?.annee || ''}</span>
              <span className="font-medium">{pav ? `${Number(pav.prix_eur).toFixed(2)} €` : 'Non renseigné'}</span>
            </div>
            <div className="flex justify-between text-sm py-1.5">
              <span>PMA {pma?.annee || ''}</span>
              <span className="font-medium">{pma ? `${Number(pma.prix_eur).toFixed(2)} €` : 'Non renseigné'}</span>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              🔒 PMA/PAV modifiables par l'Administrateur uniquement
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="font-semibold text-navy-950 mb-3">Informations générales</h2>
            <dl className="text-sm space-y-1.5">
              <div className="flex justify-between"><dt className="text-slate-500">Famille achats</dt><dd>{article.famille_achat || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Catégorie</dt><dd>{article.categorie || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Site</dt><dd>{article.site || '—'}</dd></div>
            </dl>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="font-semibold text-navy-950 mb-3">Historique des négociations</h2>
            <p className="text-sm text-slate-400">Disponible avec le module Historique (à venir).</p>
          </div>
        </div>
      </div>

      {showModal && (
        <MpnQualifieModal
          articleId={article.id}
          onClose={() => setShowModal(false)}
          onCreated={refetch}
        />
      )}
    </div>
  );
}