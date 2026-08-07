import { useState } from "react";
import { Link } from "react-router-dom";
import { useArticles } from "../hooks/useArticles";
import SearchBar from "../../../components/common/SearchBar";
import FilterDropdown from "../../../components/common/FilterDropdown";
import Pagination from "../../../components/common/Pagination";
import ArticleDrawer from "./ArticleDrawer";
const PAGE_SIZE = 20;

export default function ArticleListPage() {

    const [search, setSearch] = useState("");
    const [obsolete, setObsolete] = useState("false");
    const [page, setPage] = useState(1);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const filters = {
        search: search || undefined,
        obsolete: obsolete === "" ? undefined : obsolete,
        page,
    };

    const { data, loading, error } = useArticles(filters);

    return (
      


        <div className="space-y-6">

            {/* ================= HEADER ================= */}

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Articles
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Gestion du référentiel des articles, fournisseurs et
                        négociations.
                    </p>
                    <ArticleDrawer
    article={selectedArticle}
    onClose={() => setSelectedArticle(null)}
/>

                </div>

                <div className="flex gap-3">

                    <Link
                        to="/referentiel/articles/import"
                        className="rounded-xl border border-slate-300 bg-white px-5 py-3 hover:bg-slate-50 transition font-medium"
                    >
                        Importer Excel
                    </Link>

                    <Link
                        to="/referentiel/articles/nouveau"
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 shadow font-medium transition"
                    >
                        + Nouvel article
                    </Link>

                </div>

            </div>

            {/* ================= KPI ================= */}

            <div className="grid grid-cols-4 gap-5">

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

                    <p className="text-sm text-slate-500">
                        Articles
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        {data.count}
                    </h2>

                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

                    <p className="text-sm text-slate-500">
                        Fabricants
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        --
                    </h2>

                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

                    <p className="text-sm text-slate-500">
                        Clients
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        --
                    </h2>

                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

                    <p className="text-sm text-slate-500">
                        Négociations ouvertes
                    </p>

                    <h2 className="text-3xl font-bold text-blue-600 mt-2">
                        --
                    </h2>

                </div>

            </div>

            {/* ================= RECHERCHE ================= */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

                <div className="grid grid-cols-5 gap-4">

                    <div className="col-span-2">

                        <SearchBar
                            value={search}
                            onChange={(v) => {
                                setSearch(v);
                                setPage(1);
                            }}
                            placeholder="Rechercher un CPN, un MPN ou une désignation..."
                        />

                    </div>

                    <FilterDropdown
                        label="Obsolète"
                        value={obsolete}
                        onChange={(v) => {
                            setObsolete(v ?? "");
                            setPage(1);
                        }}
                        options={[
                            {
                                value: "false",
                                label: "Non",
                            },
                            {
                                value: "true",
                                label: "Oui",
                            },
                        ]}
                    />

                    <select className="rounded-xl border border-slate-300 px-4">

                        <option>Site</option>

                    </select>

                    <select className="rounded-xl border border-slate-300 px-4">

                        <option>Acheteur</option>

                    </select>

                </div>

            </div>

            {/* ================= MESSAGE ERREUR ================= */}

            {error && (

                <div className="rounded-xl border border-red-200 bg-red-50 text-red-600 p-4">

                    {error}

                </div>

            )}

            {/* ================= TABLEAU ================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

                <table className="w-full text-sm">

                    <thead className="bg-slate-100">

                        <tr className="text-slate-600 uppercase text-xs">

                            <th className="px-5 py-4 text-left">CPN</th>

                            <th className="px-5 py-4 text-left">Désignation</th>

                            <th className="px-5 py-4 text-left">Famille</th>

                            <th className="px-5 py-4 text-left">Client</th>

                            <th className="px-5 py-4 text-left">Site</th>

                            <th className="px-5 py-4 text-left">Acheteur</th>

                            <th className="px-5 py-4 text-left">Fabricants</th>

                            <th className="px-5 py-4 text-right">PMA</th>

                            <th className="px-5 py-4 text-center">Etat</th>

                            <th className="px-5 py-4 text-center">Négociation</th>

                        </tr>

                    </thead>
          <tbody>
                                   {loading && (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="py-16 text-center text-slate-400"
                                >
                                    Chargement des articles...
                                </td>
                            </tr>
                        )}

                        {!loading && data.results.length === 0 && (
                            <tr>
                                <td
                                    colSpan={10}
                                    className="py-16 text-center text-slate-400"
                                >
                                    Aucun article trouvé.
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            data.results.map((article) => (

                                <tr
    key={article.id}
    onClick={() => setSelectedArticle(article)}
    className="border-t border-slate-100 hover:bg-blue-50 cursor-pointer transition duration-200"
>

                                    {/* CPN */}

                                    <td className="px-5 py-4">

                                        <Link
                                            to={`/referentiel/articles/${article.id}`}
                                            className="font-semibold text-blue-600 hover:text-blue-800"
                                        >
                                            {article.cpn}
                                        </Link>

                                    </td>

                                    {/* Désignation */}

                                    <td className="px-5 py-4">

                                        <div className="font-medium text-slate-800">

                                            {article.short_desc}

                                        </div>

                                    </td>

                                    {/* Famille */}

                                    <td className="px-5 py-4">

                                        {article.famille_achat || "—"}

                                    </td>

                                    {/* Client */}

                                    <td className="px-5 py-4">

                                        {article.customer || "—"}

                                    </td>

                                    {/* Site */}

                                    <td className="px-5 py-4">

                                        {article.site || "—"}

                                    </td>

                                    {/* Acheteur */}

                                    <td className="px-5 py-4">

                                        {article.acheteur || "—"}

                                    </td>

                                    {/* Fabricants */}

                                    <td className="px-5 py-4">

                                        {article.nb_mpn_qualifies > 0 ? (

                                            <span className="rounded-full bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-semibold">

                                                {article.nb_mpn_qualifies} fabricant
                                                {article.nb_mpn_qualifies > 1
                                                    ? "s"
                                                    : ""}

                                            </span>

                                        ) : (

                                            <span className="text-slate-400">

                                                —

                                            </span>

                                        )}

                                    </td>

                                    {/* PMA */}

                                    <td className="px-5 py-4 text-right font-semibold">

                                        {article.pma !== null &&
                                        article.pma !== undefined
                                            ? `${Number(article.pma).toFixed(
                                                  2
                                              )} €`
                                            : "—"}

                                    </td>

                                    {/* Etat */}

                                    <td className="px-5 py-4 text-center">

                                        {article.obsolete ? (

                                            <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold">

                                                Obsolète

                                            </span>

                                        ) : (

                                            <span className="rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-semibold">

                                                Actif

                                            </span>

                                        )}

                                    </td>

                                    {/* Négociation */}

                                    <td className="px-5 py-4 text-center">

                                        {article.negociation_ouverte_code ? (

                                            <span className="rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold">

                                                {
                                                    article.negociation_ouverte_code
                                                }

                                            </span>

                                        ) : (

                                            <span className="text-slate-400">

                                                —

                                            </span>

                                        )}

                                    </td>

                                </tr>

                            ))}
                                                </tbody>

                </table>

                {/* ================= PAGINATION ================= */}

                {!loading && (

                    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">

                        <Pagination
                            page={page}
                            count={data.count}
                            pageSize={PAGE_SIZE}
                            onPageChange={setPage}
                        />

                    </div>

                )}

            </div>

            {/* ================= PIED DE PAGE ================= */}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">

                <div className="flex justify-between items-center">

                    <div>

                        <h3 className="font-semibold text-slate-800">

                            Performance du référentiel

                        </h3>

                        <p className="text-sm text-slate-600 mt-1">

                            Les recherches, filtres et la pagination sont
                            exécutés côté serveur afin de garantir de bonnes
                            performances même avec plusieurs dizaines de
                            milliers d'articles.

                        </p>

                    </div>

                    <div className="text-right">

                        <div className="text-2xl font-bold text-blue-600">

                            {data.count}

                        </div>

                        <div className="text-xs text-slate-500">

                            Articles référencés

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}