import { useState, useEffect } from 'react';
import api from './api/axios';

function App() {
  const [articles, setArticles] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    api.get('articles/')
      .then((response) => setArticles(response.data))
      .catch((err) => setErreur(err.message));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-600">Test connexion NegoApp</h1>
      {erreur && <p className="text-red-600">Erreur : {erreur}</p>}
      <ul>
        {articles.map((a) => (
          <li key={a.id}>{a.cpn} — {a.fabricant}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;