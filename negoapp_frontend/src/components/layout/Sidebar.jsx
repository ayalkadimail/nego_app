import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `block px-3 py-1.5 rounded text-sm ${
    isActive ? 'bg-teal-700 text-white' : 'text-slate-300 hover:bg-navy-900'
  }`;

const sectionLabel = 'text-xs uppercase tracking-wide text-slate-500 px-3 mt-6 mb-2';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-navy-950 text-white min-h-screen p-4 flex-shrink-0">
      <div className="px-3 mb-6">
        <div className="text-lg font-bold">NegoApp</div>
        <div className="text-xs text-slate-400 tracking-wide">TRONICO ATLAS · ACHATS</div>
      </div>

      <div className={sectionLabel}>Pilotage</div>
      <NavLink to="/tableau-de-bord" className={linkClass}>Tableau de bord</NavLink>

      <div className={sectionLabel}>Négociations</div>
      <NavLink to="/negociations" className={linkClass}>Liste des négociations</NavLink>

      <div className={sectionLabel}>Référentiels</div>
      <NavLink to="/referentiel/articles" className={linkClass}>Référentiel articles</NavLink>
      <NavLink to="/referentiel/fournisseurs" className={linkClass}>Fournisseurs</NavLink>
      <NavLink to="/historique" className={linkClass}>Historique</NavLink>
    </aside>
  );
}