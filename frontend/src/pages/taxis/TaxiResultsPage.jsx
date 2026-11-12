import { ArrowDownUp, Loader2, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import TaxiCard from '@/components/features/taxis/TaxiCard';
import TaxiFilters from '@/components/features/taxis/TaxiFilters';
import TaxiPageShell from '@/components/features/taxis/TaxiPageShell';
import TaxiSearchBar from '@/components/features/taxis/TaxiSearchBar';
import { emptyTaxiFilters } from '@/components/features/taxis/taxiData';
import { readTaxiParams, toTaxiQuery } from '@/components/features/taxis/taxiUtils';
import { Button } from '@/components/ui/button';
import { useTaxiSearch } from '@/hooks/useTaxis';

const PAGE_SIZE = 3;

export default function TaxiResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = readTaxiParams(searchParams);
  const [filters, setFilters] = useState(emptyTaxiFilters);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [retryKey, setRetryKey] = useState(0);
  const { data, loading, error } = useTaxiSearch(params, filters, limit, retryKey);

  function handleSearch(values) {
    setLimit(PAGE_SIZE);
    setFilters(emptyTaxiFilters);
    navigate(`/airport-taxi/results?${toTaxiQuery(values)}`);
  }

  function handleFilters(name, value) {
    setLimit(PAGE_SIZE);
    setFilters((current) => ({
      ...current,
      [name]: current[name].includes(value)
        ? current[name].filter((item) => item !== value)
        : [...current[name], value],
    }));
  }

  return (
    <TaxiPageShell>
      <main className="mx-auto max-w-[1500px] space-y-6 px-4 pb-16 pt-24 sm:px-8">
        <TaxiSearchBar
          key={toTaxiQuery(params)}
          variant="compact"
          defaultValues={params}
          onSearch={handleSearch}
        />

        <div>
          <p className="mb-1 text-right text-xs">Advertisement</p>
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-sky-200 px-5 py-4 sm:flex-row">
            <p className="text-2xl font-black uppercase leading-none text-[#0B1B3A] sm:text-4xl xl:text-6xl">
              Join our taxi team!
            </p>
            <a href="tel:+94897654123" className="flex items-center gap-3 rounded-full bg-[#0B2A3F] px-5 py-2 text-white">
              <span className="text-sm sm:text-base xl:text-xl">+94 897 654 123</span>
              <Phone className="size-5" aria-hidden="true" />
              <span className="font-bold">CALL US</span>
            </a>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,350px)_1fr] xl:grid-cols-[minmax(0,415px)_1fr]">
          <TaxiFilters filters={filters} onChange={handleFilters} />

          <section className="rounded-[2rem] bg-white p-4 shadow-md sm:p-6" aria-busy={loading}>
            <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-xl font-medium sm:text-2xl xl:text-[35px]">
                {data ? `${data.locationLabel}: ${data.total} Cars available` : 'Taxi results'}
              </h1>
              <p className="flex items-center gap-2 text-sm font-light sm:text-base xl:text-xl">
                <ArrowDownUp className="size-5" aria-hidden="true" /> Sort by: Our top picks
              </p>
            </header>

            <p className="mb-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              Demo inventory: vehicle availability and fares are sample data and are not live-checked.
            </p>

            {loading && (
              <p className="flex items-center gap-2 py-8 text-sm text-slate-600" role="status">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Loading available vehicles…
              </p>
            )}
            {error && (
              <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">
                <p>Could not load vehicles: {error.message}</p>
                <Button type="button" variant="outline" className="mt-3" onClick={() => setRetryKey((key) => key + 1)}>
                  Try again
                </Button>
              </div>
            )}

            <div className="space-y-6">
              {!loading && data?.items.map((taxi) => (
                <TaxiCard key={taxi.id} taxi={taxi} search={params} />
              ))}
              {!loading && data && data.items.length === 0 && (
                <div className="rounded-xl border border-dashed p-6 text-center">
                  <p className="font-medium">No vehicles match this search.</p>
                  <p className="mt-1 text-sm text-black/60">Try fewer passengers or remove one or more filters.</p>
                </div>
              )}
            </div>

            {data?.hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() => setLimit((count) => count + PAGE_SIZE)}
                  className="rounded-[20px] border-[#82C0EE] bg-[#DEF3FE] px-8 py-6 text-lg font-medium tracking-wide text-[#0857A1] shadow-md hover:bg-[#cdeafd] xl:text-2xl"
                >
                  Load more results
                </Button>
              </div>
            )}
            <Link to="/airport-taxi" className="mt-6 inline-block text-sm font-medium text-[#124E7B] underline">
              Start a new taxi search
            </Link>
          </section>
        </div>
      </main>
    </TaxiPageShell>
  );
}
