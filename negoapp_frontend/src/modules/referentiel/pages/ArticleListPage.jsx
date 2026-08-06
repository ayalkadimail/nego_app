import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import SearchBar from '../../../components/common/SearchBar';
import FilterDropdown from '../../../components/common/FilterDropdown';
import Pagination from '../../../components/common/Pagination';

const PAGE_SIZE = 20;

export default function ArticleListPage() {
  const [search, setSearch] = useState('');
  const [obsolete, setObsolete] = useState('false');
  const [page, setPage] = useState(1);

  const filters = {
    search: search || undefined,
    obsolete: obsolete === '' ? undefined : obsolete,
    page,
  };

  const { data, loading, error } = useArticles(filters);

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Articles</h1>
          <p className="text-sm text-slate-500">{data.count} articles</p>
        </div>
        <div className="flex gap-2">
          <Link to="/referentiel/articles/import" className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white">
            Importer
          </Link>
          <Link to="/referentiel/articles/nouveau" className="px-4 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium">
            + Ajouter un article
          </Link>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher un CPN, MPN, désignation..." />
        <FilterDropdown
          label="Obsolète : Non"
          value={obsolete}
          onChange={(v) => { setObsolete(v ?? ''); setPage(1); }}
          options={[{ value: 'true', label: 'Obsolète : Oui' }, { value: 'false', label: 'Obsolète : Non' }]}
        />
      </div>

      {error && <div className="text-rust-600 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">CPN</th>
              <th className="text-left px-4 py-3">Désignation</th>
              <th className="text-left px-4 py-3">Famille achats</th>
              <th className="text-left px-4 py-3">Client</th>
              <th className="text-left px-4 py-3">MPN qualifiés</th>
              <th className="text-right px-4 py-3">PMA</th>
              <th className="text-center px-4 py-3">Obsolète</th>
              <th className="text-left px-4 py-3">Négo en cours</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="text-center py-8 text-slate-400">Chargement...</td></tr>
            )}
            {!loading && data.results.length === 0 && (
              <tr><td colSpan={8} className="text-center py-8 text-slate-400">Aucun article trouvé</td></tr>
            )}
            {!loading && data.results.map((article) => (
              <tr key={article.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono">
                  <Link to={`/referentiel/articles/${article.id}`} className="text-teal-700 font-medium">
                    {article.cpn}
                  </Link>
                </td>
                <td className="px-4 py-3">{article.short_desc}</td>
                <td className="px-4 py-3">{article.famille_achat || '—'}</td>
                <td className="px-4 py-3">{article.customer || '—'}</td>
                <td className="px-4 py-3">
                  {article.nb_mpn_qualifies > 0 ? `${article.nb_mpn_qualifies} fabricant${article.nb_mpn_qualifies > 1 ? 's' : ''}` : '—'}
                </td>
                <td className="px-4 py-3 text-right">{article.pma !== null && article.pma !== undefined ? `${Number(article.pma).toFixed(2)} €` : '—'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    article.obsolete ? 'bg-rust-100 text-rust-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {article.obsolete ? 'Oui' : 'Non'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {article.negociation_ouverte_code ? (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-700/10 text-teal-700">
                      {article.negociation_ouverte_code}
                    </span>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && (
          <Pagination page={page} count={data.count} pageSize={PAGE_SIZE} onPageChange={setPage} />
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Pagination et filtres calculés côté serveur — exigence CDC &lt;500ms même à 50 000 lignes.
      </p>
    </div>
  );
}
