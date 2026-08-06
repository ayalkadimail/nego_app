import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ArticleListPage from '../modules/referentiel/pages/ArticleListPage';
import ArticleDetailPage from '../modules/referentiel/pages/ArticleDetailPage';
import ArticleFormPage from '../modules/referentiel/pages/ArticleFormPage';
import ArticleImportPage from '../modules/referentiel/pages/ArticleImportPage';
import FournisseurImportPage from '../modules/referentiel/pages/FournisseurImportPage';
import FournisseurListPage from '../modules/referentiel/pages/FournisseurListPage';
import FournisseurDetailPage from '../modules/referentiel/pages/FournisseurDetailPage';
import FournisseurFormPage from '../modules/referentiel/pages/FournisseurFormPage';
import OffreListPage from '../modules/offres/pages/OffreListPage';
import OffreFormPage from '../modules/offres/pages/OffreFormPage';
import OffreImportPage from '../modules/offres/pages/OffreImportPage';

const Stub = ({ label }) => <div className="text-slate-400">{label} — à venir</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Stub label="Tableau de bord" /> },
      { path: 'tableau-de-bord', element: <Stub label="Tableau de bord" /> },
      { path: 'negociations', element: <Stub label="Liste des négociations" /> },
      { path: 'historique', element: <Stub label="Historique" /> },
      { path: 'offres', element: <OffreListPage /> },
      { path: 'offres/nouvelle', element: <OffreFormPage /> },
      { path: 'offres/:id/modifier', element: <OffreFormPage /> },
      { path: 'offres/import', element: <OffreImportPage /> },

      { path: 'referentiel/articles', element: <ArticleListPage /> },
      { path: 'referentiel/articles/nouveau', element: <ArticleFormPage /> },
      { path: 'referentiel/articles/:id/modifier', element: <ArticleFormPage /> },
      { path: 'referentiel/articles/:id', element: <ArticleDetailPage /> },
      { path: 'referentiel/articles/:id/modifier', element: <Stub label="Formulaire article (édition)" /> },
      { path: 'referentiel/articles/import', element: <ArticleImportPage /> },

      { path: 'referentiel/fournisseurs', element: <FournisseurListPage /> },
      { path: 'referentiel/fournisseurs/nouveau', element: <FournisseurFormPage /> },
      { path: 'referentiel/fournisseurs/:id', element: <FournisseurDetailPage /> },
      { path: 'referentiel/fournisseurs/import', element: <FournisseurImportPage /> },    ],
  },
]);
