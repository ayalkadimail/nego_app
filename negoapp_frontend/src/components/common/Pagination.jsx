export default function Pagination({ page, count, pageSize = 20, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const from = count === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);

  const pagesToShow = () => {
    const pages = new Set([1, totalPages, page, page - 1, page + 1]);
    return [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  };

  const pages = pagesToShow();

  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm text-slate-500">
      <span>{from}–{to} sur {count} résultats</span>
      <div className="flex gap-1">
        {pages.map((p, i) => (
          <span key={p} className="flex items-center">
            {i > 0 && p - pages[i - 1] > 1 && <span className="px-1 text-slate-400">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded text-sm ${
                p === page ? 'bg-navy-950 text-white' : 'bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}