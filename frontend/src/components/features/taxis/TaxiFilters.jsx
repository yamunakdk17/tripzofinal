import { MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { taxiFilterOptions } from './taxiData';

function FilterGroup({ title, name, options, filters, onChange }) {
  return (
    <fieldset className="border-b border-[#74C5F2] px-5 py-4 last:border-b-0">
      <legend className="mb-3 text-base font-semibold sm:text-lg">{title}</legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm sm:text-base">
            <input
              type="checkbox"
              checked={filters[name].includes(option.value)}
              onChange={() => onChange(name, option.value)}
              className="size-4 accent-[#0762B5]"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function TaxiFilters({ filters, onChange }) {
  return (
    <aside className="grid content-start gap-5 sm:grid-cols-2 lg:grid-cols-1">
      <div className="relative h-40 overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-100 via-sky-100 to-emerald-200 shadow-md">
        <Button
          type="button"
          disabled
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 gap-2 rounded-full bg-[#CEE9D6] text-[#0C2833] shadow-md hover:bg-[#bddfc8]"
          aria-label="Map view is not available"
        >
          <MapPin className="size-4" /> Map view unavailable
        </Button>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#DAF4FA] to-[#AAC1ED]/70 shadow-md">
        <h2 className="border-b border-[#74C5F2] bg-[#CDE6F0] px-5 py-4 text-lg font-medium tracking-wide sm:text-xl xl:text-2xl">
          Filter by:
        </h2>
        <FilterGroup
          title="Car category"
          name="categories"
          options={taxiFilterOptions.categories}
          filters={filters}
          onChange={onChange}
        />
        <FilterGroup
          title="Deposit required at pick-up"
          name="deposits"
          options={taxiFilterOptions.deposits}
          filters={filters}
          onChange={onChange}
        />
        <FilterGroup
          title="Fuel type"
          name="fuels"
          options={taxiFilterOptions.fuels}
          filters={filters}
          onChange={onChange}
        />
      </div>
    </aside>
  );
}
