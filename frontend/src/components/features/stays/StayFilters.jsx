import { emptyStayFilters, filterOptions } from './stayData';

export default function StayFilters({ filters, onChange }) {
  const groups = [
    ['Property type', 'propertyTypes'], ['Price range', 'priceRanges'], ['Facilities', 'facilities'], ['Distance from centre', 'distances'],
  ];
  function toggle(name, value) {
    const values = filters[name];
    onChange({ ...filters, [name]: values.includes(value) ? values.filter((item) => item !== value) : [...values, value] });
  }
  return (
    <aside className="overflow-hidden rounded-3xl bg-gradient-to-b from-[#DAF4FA] to-[#AAC1ED]/70 shadow-md">
      <h2 className="bg-[#CDE6F0] px-5 py-4 text-xl font-semibold">Filter by</h2>
      {groups.map(([title, name]) => <fieldset key={name} className="border-b border-sky-400 px-5 py-4"><legend className="mb-2 font-semibold">{title}</legend><div className="space-y-2">{filterOptions[name].map((option) => <label key={option.value} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters[name].includes(option.value)} onChange={() => toggle(name, option.value)} className="size-4 accent-[#124E7B]" />{option.label}</label>)}</div></fieldset>)}
      <button type="button" onClick={() => onChange(emptyStayFilters)} className="m-5 text-sm font-semibold text-[#124E7B] underline">Clear filters</button>
    </aside>
  );
}
