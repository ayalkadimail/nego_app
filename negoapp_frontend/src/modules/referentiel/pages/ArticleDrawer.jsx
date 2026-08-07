export default function ArticleDrawer({ article, onClose }) {

    if (!article) return null;

    return (

        <>
            {/* Fond sombre */}

            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Drawer */}

            <div className="fixed top-0 right-0 h-screen w-[500px] bg-white shadow-2xl z-50 flex flex-col animate-slideLeft">

                {/* Header */}

                <div className="border-b px-6 py-5 flex justify-between items-center">

                    <div>

                        <p className="text-xs uppercase text-slate-500">
                            Article
                        </p>

                        <h2 className="text-2xl font-bold mt-1">

                            {article.cpn}

                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="text-2xl text-slate-500 hover:text-red-600"
                    >
                        ×
                    </button>

                </div>

                {/* Corps */}

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    <Section
                        titre="Désignation"
                        valeur={article.short_desc}
                    />

                    <Section
                        titre="Famille achats"
                        valeur={article.famille_achat}
                    />

                    <Section
                        titre="Client"
                        valeur={article.customer}
                    />

                    <Section
                        titre="Site"
                        valeur={article.site}
                    />

                    <Section
                        titre="Acheteur"
                        valeur={article.acheteur}
                    />

                    <Section
                        titre="PMA"
                        valeur={
                            article.pma
                                ? Number(article.pma).toFixed(2) + " €"
                                : "—"
                        }
                    />

                    <Section
                        titre="Nombre de fabricants"
                        valeur={article.nb_mpn_qualifies}
                    />

                    <div>

                        <p className="text-xs uppercase text-slate-500 mb-2">

                            Etat

                        </p>

                        {article.obsolete ? (

                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                                Obsolète

                            </span>

                        ) : (

                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">

                                Actif

                            </span>

                        )}

                    </div>

                </div>

                {/* Footer */}

                <div className="border-t p-5 flex gap-3">

                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3">

                        Modifier

                    </button>

                    <button className="flex-1 border rounded-xl py-3 hover:bg-red-50 text-red-600">

                        Supprimer

                    </button>

                </div>

            </div>

        </>

    );

}

function Section({ titre, valeur }) {

    return (

        <div>

            <p className="text-xs uppercase text-slate-500 mb-1">

                {titre}

            </p>

            <div className="bg-slate-100 rounded-xl p-3">

                {valeur || "—"}

            </div>

        </div>

    );

}