import { NavLink } from "react-router-dom";

const menus = [
  {
    title: "Pilotage",
    items: [
      {
        text: "Tableau de bord",
        to: "/tableau-de-bord",
      },
    ],
  },
  {
    title: "Référentiel",
    items: [
      {
        text: "Articles",
        to: "/referentiel/articles",
      },
      {
        text: "Fournisseurs",
        to: "/referentiel/fournisseurs",
      },
    ],
  },
  {
    title: "Achats",
    items: [
      {
        text: "Offres fournisseurs",
        to: "/offres",
      },
      {
        text: "Négociations",
        to: "/negociations",
      },
      {
        text: "Historique",
        to: "/historique",
      },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-slate-900 text-white min-h-screen border-r border-slate-800 flex flex-col">

      {/* Logo */}
      <div className="px-6 py-8 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight">
          NegoApp
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          TRONICO ATLAS
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        {menus.map((section) => (
          <div key={section.title} className="mb-8">

            <p className="uppercase text-xs text-slate-500 mb-3 px-3 tracking-widest">
              {section.title}
            </p>

            {section.items.map((item) => (
              <NavLink
                key={item.text}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 mb-2 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                {item.text}
              </NavLink>
            ))}

          </div>
        ))}

      </nav>

      {/* Bas de la sidebar */}
      <div className="border-t border-slate-800 p-5">
        <button className="w-full rounded-lg border border-slate-700 px-4 py-2 text-slate-400 hover:bg-slate-800 hover:text-white transition">
          Paramètres
        </button>
      </div>

    </aside>
  );
}