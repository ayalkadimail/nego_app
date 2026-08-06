import { useState } from 'react';

const STATUT_STYLES = {
  OK: 'text-teal-700',
  AVERTISSEMENT: 'text-amber-600',
  ERREUR: 'text-rust-600',
};

const STATUT_ICONS = {
  OK: '✓',
  AVERTISSEMENT: '⚠',
  ERREUR: '✕',
};

export default function ImportWizard({
  title,
  formatHint,
  onPreview,
  onConfirm,
  backLink,
  ligneColumns, // [{ key: 'cpn', label: 'CPN' }, ...]
}) {
  const [step, setStep] = useState('fichier'); // 'fichier' | 'validation' | 'resultat'
  const [fichier, setFichier] = useState(null);
  const [report, setReport] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    setFichier(f);
    setError(null);
  };

  const handleAnalyser = async () => {
    if (!fichier) return;
    setLoading(true);
    setError(null);
    try {
      const data = await onPreview(fichier);
      setReport(data);
      setStep('validation');
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de l'analyse du fichier.");
    } finally {
      setLoading(false);
    }
  };

  const handleValider = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await onConfirm(fichier);
      setResult(data);
      setStep('resultat');
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur lors de l'import.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecommencer = () => {
    setStep('fichier');
    setFichier(null);
    setReport(null);
    setResult(null);
    setError(null);
  };

  return (
    <div>
      <a href={backLink} className="text-sm text-slate-500 hover:underline">← Retour à la liste</a>

      <h1 className="text-2xl font-bold text-navy-950 mt-3">{title}</h1>
      <p className="text-sm text-slate-500 mb-6">Import de masse — format standardisé (EF-04)</p>

      <div className="flex gap-6 border-b border-slate-200 mb-6 text-sm font-medium">
        <span className={step === 'fichier' ? 'text-navy-950 border-b-2 border-navy-950 pb-2' : 'text-slate-400 pb-2'}>
          1. Fichier
        </span>
        <span className={step !== 'fichier' ? 'text-navy-950 border-b-2 border-navy-950 pb-2' : 'text-slate-400 pb-2'}>
          2. Validation
        </span>
      </div>

      {step === 'fichier' && (
        <div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center mb-4">
            <div>
              <h2 className="font-semibold text-navy-950 text-sm">Format attendu</h2>
              <p className="text-xs text-slate-500 mt-1">{formatHint}</p>
            </div>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={`border-2 border-dashed rounded-lg py-16 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-teal-600 bg-teal-50' : 'border-slate-300 bg-white'
            }`}
            onClick={() => document.getElementById('import-file-input').click()}
          >
            <input
              id="import-file-input"
              type="file"
              accept=".xlsx,.csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {fichier ? (
              <p className="text-sm font-medium">{fichier.name}</p>
            ) : (
              <>
                <p className="text-sm">
                  <span className="font-medium">Glissez votre fichier ici</span>, ou cliquez pour parcourir
                </p>
                <p className="text-xs text-slate-400 mt-1">Formats acceptés : .xlsx, .csv</p>
              </>
            )}
          </div>

          {error && <div className="text-rust-600 text-sm mt-3">{error}</div>}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAnalyser}
              disabled={!fichier || loading}
              className="px-5 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Analyse...' : 'Suivant — Validation →'}
            </button>
            <a href={backLink} className="px-5 py-2 rounded-lg border border-slate-300 text-sm font-medium">
              Annuler
            </a>
          </div>
        </div>
      )}

      {step === 'validation' && report && (
        <div>
          <div className="flex gap-3 mb-4">
            <span className="px-3 py-1.5 rounded-lg bg-teal-700/10 text-teal-700 text-sm font-medium">
              ✓ {report.nb_ok} lignes OK
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 text-sm font-medium">
              ⚠ {report.nb_avertissements} avertissements
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-rust-100 text-rust-600 text-sm font-medium">
              ✕ {report.nb_erreurs} erreurs
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Ligne</th>
                  {ligneColumns.map((col) => (
                    <th key={col.key} className="text-left px-4 py-3">{col.label}</th>
                  ))}
                  <th className="text-left px-4 py-3">Statut</th>
                  <th className="text-left px-4 py-3">Détail</th>
                </tr>
              </thead>
              <tbody>
                {report.lignes.map((l) => (
                  <tr key={l.ligne} className="border-t border-slate-100">
                    <td className="px-4 py-3">{l.ligne}</td>
                    {ligneColumns.map((col) => (
                      <td key={col.key} className="px-4 py-3">{l[col.key] ?? '—'}</td>
                    ))}
                    <td className={`px-4 py-3 font-medium ${STATUT_STYLES[l.statut]}`}>
                      {STATUT_ICONS[l.statut]} {l.statut === 'ERREUR' ? 'Erreur' : l.statut === 'AVERTISSEMENT' ? 'Avertissement' : 'OK'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{l.detail || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {error && <div className="text-rust-600 text-sm mt-3">{error}</div>}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleValider}
              disabled={loading || report.nb_ok + report.nb_avertissements === 0}
              className="px-5 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Import...' : `Valider l'import (${report.nb_ok + report.nb_avertissements} lignes)`}
            </button>
            <button onClick={handleRecommencer} className="px-5 py-2 rounded-lg border border-slate-300 text-sm font-medium">
              Revenir
            </button>
          </div>
        </div>
      )}

      {step === 'resultat' && result && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-teal-700 mb-3">✓ Import effectué avec succès</h2>
          <ul className="text-sm space-y-1">
            <li>{result.crees} ligne{result.crees > 1 ? 's' : ''} créée{result.crees > 1 ? 's' : ''}</li>
            <li>{result.mis_a_jour} ligne{result.mis_a_jour > 1 ? 's' : ''} mise{result.mis_a_jour > 1 ? 's' : ''} à jour</li>
            <li>{result.lignes_ignorees} ligne{result.lignes_ignorees > 1 ? 's' : ''} ignorée{result.lignes_ignorees > 1 ? 's' : ''} (erreurs)</li>
          </ul>
          <div className="flex gap-2 mt-5">
            <a href={backLink} className="px-5 py-2 rounded-lg bg-navy-950 text-white text-sm font-medium">
              Retour à la liste
            </a>
            <button onClick={handleRecommencer} className="px-5 py-2 rounded-lg border border-slate-300 text-sm font-medium">
              Importer un autre fichier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}