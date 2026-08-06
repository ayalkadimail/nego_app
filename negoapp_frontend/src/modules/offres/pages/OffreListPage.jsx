import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOffres } from '../../../api/offres';

export default function OffreListPage() {
  const [data, setData] = useState({ results: [], count: 0 }); const [search, setSearch] = useState(''); const [error, setError] = useState('');
  useEffect(() => { getOffres(search ? { search } : {}).then(setData).catch(() => setError('Impossible de charger les offres.')); }, [search]);
  return <div>
    <div className="flex justify-between items-start mb-6"><div><h1 className="text-2xl font-bold text-navy-950">Offres fournisseurs</h1><p className="text-sm text-slate-500">Offres indépendantes des négociations · {data.count} offre(s)</p></div><div className="flex gap-2"><Link to="/offres/import" className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium">Importer</Link><Link to="/offres/nouvelle" className="px-4 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium">+ Ajouter une offre</Link></div></div>
    <input className="w-full max-w-md mb-4 rounded-lg border border-slate-300 px-3 py-2 text-sm" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un CPN, article ou fournisseur…" />
    {error && <p className="text-rust-600 mb-3">{error}</p>}
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden"><table className="w-full text-sm"><thead className="bg-slate-50 text-slate-500 text-xs uppercase"><tr><th className="text-left px-4 py-3">Article</th><th className="text-left px-4 py-3">Fournisseur</th><th className="text-right px-4 py-3">Prix</th><th className="text-right px-4 py-3">MOQ</th><th className="text-right px-4 py-3">Lead time</th><th className="text-left px-4 py-3">Validité</th></tr></thead><tbody>{data.results.map(o => <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50"><td className="px-4 py-3"><Link className="font-mono text-teal-700 font-medium" to={`/offres/${o.id}/modifier`}>{o.article_cpn}</Link><div className="text-xs text-slate-500">{o.article_desc}</div></td><td className="px-4 py-3">{o.fournisseur_nom}</td><td className="px-4 py-3 text-right font-mono">{Number(o.prix_unitaire).toFixed(2)} {o.devise}</td><td className="px-4 py-3 text-right">{o.moq}</td><td className="px-4 py-3 text-right">{o.lead_time} j</td><td className="px-4 py-3">{o.date_validite || '—'}</td></tr>)}{data.results.length === 0 && <tr><td colSpan="6" className="text-center py-10 text-slate-400">Aucune offre enregistrée</td></tr>}</tbody></table></div>
  </div>;
}
