export default function FilterDropdown({ label, value, options, onChange }) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}