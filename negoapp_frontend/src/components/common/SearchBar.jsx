export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="flex items-center gap-2 border border-slate-300 rounded-lg px-3 py-2 bg-white flex-1">
      <span className="text-slate-400">🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 outline-none text-sm"
      />
    </div>
  );
}