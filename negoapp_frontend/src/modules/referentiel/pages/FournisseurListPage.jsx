import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFournisseurs } from '../hooks/useFournisseurs';
import { updateFournisseur } from '../../../api/referentiel';
import SearchBar from '../../../components/common/SearchBar';
import FilterDropdown from '../../../components/common/FilterDropdown';
import Pagination from '../../../components/common/Pagination';

const PAGE_SIZE = 20;

export default function FournisseurListPage() {
  const [search, setSearch] = useState('');
  const [actif, setActif] = useState('');
  const [page, setPage] = useState(1);

  const filters = {
    search: search || undefined,
    actif: actif || undefined,
    page,
  };

  const { data, loading, error, refetch } = useFournisseurs(filters);

  const toggleActif = async (fournisseur) => {
    await updateFournisseur(fournisseur.id, { actif: !fournisseur.actif });
    refetch();
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-950">Fournisseurs</h1>
          <p className="text-sm text-slate-500">{data.count} fournisseurs référencés</p>
        </div>
        <div className="flex gap-2">
          <Link to="/referentiel/fournisseurs/import" className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium bg-white">
            Importer
          </Link>
          <Link to="/referentiel/fournisseurs/nouveau" className="px-4 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium">
            + Ajouter un fournisseur
          </Link>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Rechercher un fournisseur..." />
        <FilterDropdown
          label="Statut : Tous"
          value={actif}
          onChange={(v) => { setActif(v ?? ''); setPage(1); }}
          options={[{ value: 'true', label: 'Statut : Actif' }, { value: 'false', label: 'Statut : Inactif' }]}
        />
      </div>

      {error && <div className="text-rust-600 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Nom</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">Négociations actives</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="text-left px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Chargement...</td></tr>
            )}
            {!loading && data.results.length === 0 && (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Aucun fournisseur trouvé</td></tr>
            )}
            {!loading && data.results.map((f) => (
              <tr key={f.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link to={`/referentiel/fournisseurs/${f.id}`} className="text-teal-700 font-medium">
                    {f.nom}
                  </Link>
                </td>
                <td className="px-4 py-3">{f.contact || '—'}</td>
                <td className="px-4 py-3">{f.nb_negociations_actives}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    f.actif ? 'bg-teal-700/10 text-teal-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {f.actif ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link to={`/referentiel/fournisseurs/${f.id}`} className="text-sm font-medium text-navy-950">
                    Modifier
                  </Link>
                  <button
                    onClick={() => toggleActif(f)}
                    className={`text-sm font-medium ${f.actif ? 'text-rust-600' : 'text-teal-700'}`}
                  >
                    {f.actif ? 'Désactiver' : 'Réactiver'}
                  </button>
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
        Un fournisseur avec des négociations actives ne peut pas être supprimé — seulement désactivé (RM-16/17, traçabilité des offres passées).
      </p>
    </div>
  );
}
