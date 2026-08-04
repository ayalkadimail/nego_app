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
