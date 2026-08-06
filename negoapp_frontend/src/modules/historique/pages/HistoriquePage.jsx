import { useEffect, useState } from 'react';
import { getHistorique } from '../../../api/historique';

export default function HistoriquePage() {
  const [lignes, setLignes] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { getHistorique().then((data) => setLignes(data.results || data)).catch(() => setError("Impossible de charger l'historique.")); }, []);
  return <div>
    <h1 className="text-2xl font-bold text-navy-950">Historique des prix</h1>
    <p className="text-sm text-slate-500 mb-6">Comparaison automatique du prix négocié avec l’année précédente.</p>
    {error && <p className="text-rust-600 mb-3">{error}</p>}
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-3">Article</th><th className="text-left px-4 py-3">Année</th><th className="text-left px-4 py-3">Fournisseur retenu</th><th className="text-right px-4 py-3">Prix négocié</th><th className="text-right px-4 py-3">Écart N/N-1</th><th className="text-right px-4 py-3">Écart %</th></tr></thead><tbody>{lignes.map((l) => <tr key={l.id} className="border-t border-slate-100"><td className="px-4 py-3"><span className="font-mono">{l.article_cpn}</span><div className="text-xs text-slate-500">{l.article_desc}</div></td><td className="px-4 py-3">{l.annee}</td><td className="px-4 py-3">{l.fournisseur_retenu_nom}</td><td className="px-4 py-3 text-right">{Number(l.prix_final_eur).toFixed(2)} €</td><td className="px-4 py-3 text-right">{l.variation_n_1 == null ? '—' : `${Number(l.variation_n_1).toFixed(2)} €`}</td><td className="px-4 py-3 text-right">{l.variation_pct_n_1 == null ? '—' : `${Number(l.variation_pct_n_1).toFixed(2)} %`}</td></tr>)}{lignes.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-slate-400">Aucun historique disponible</td></tr>}</tbody></table></div>
  </div>;
}
