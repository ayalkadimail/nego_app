import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DevUserSwitcher from "./DevUserSwitcher";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              NegoApp
            </h1>

            <p className="text-sm text-slate-500">
              Plateforme de gestion des négociations achats
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* Barre de recherche */}
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-80 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
            />

            {/* Notification */}
            <button className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition">
              🔔
            </button>

            {/* Profil */}
            <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-2">

              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                G
              </div>

              <div>
                <p className="font-semibold text-slate-800">
                  Ghita
                </p>

                <p className="text-xs text-slate-500">
                  Acheteur
                </p>
              </div>

            </div>

          </div>

        </header>

        {/* Contenu */}
        <main className="flex-1 p-8 overflow-auto">

          <Outlet />

        </main>

      </div>

      <DevUserSwitcher />

    </div>
  );
}