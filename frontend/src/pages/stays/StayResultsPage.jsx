import { useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import StayCard from '@/components/features/stays/StayCard';
import StayFilters from '@/components/features/stays/StayFilters';
import StayPageFrame from '@/components/features/stays/StayPageFrame';
import StaySearchBar from '@/components/features/stays/StaySearchBar';
import { emptyStayFilters, readStaySearch, toStayQuery } from '@/components/features/stays/stayData';
import { useStaySearch } from '@/hooks/useStays';

export default function StayResultsPage() {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const params = readStaySearch(query);
  const [filters, setFilters] = useState(emptyStayFilters);
  const [sortBy, setSortBy] = useState('recommended');
  const [retry, setRetry] = useState(0);
  const { data, loading, error } = useStaySearch({ ...params, retry }, filters, sortBy);
  function search(values) { setFilters(emptyStayFilters); navigate(`/stays/search?${toStayQuery(values)}`); }

  return <StayPageFrame className="space-y-8">
    <StaySearchBar key={toStayQuery(params)} defaultValues={params} compact onSearch={search} />
    <div className="grid gap-8 lg:grid-cols-[minmax(0,320px)_1fr]">
      <StayFilters filters={filters} onChange={setFilters}/>
      <section className="min-w-0 rounded-3xl bg-white p-4 shadow-md sm:p-6" aria-busy={loading}>
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-xl font-semibold sm:text-3xl">{data ? `${data.locationLabel}: ${data.total} properties found` : 'Searching stays…'}</h1><label className="flex items-center gap-2"><ArrowDownUp className="size-5"/><span className="sr-only">Sort results</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border px-3 py-2"><option value="recommended">Top picks</option><option value="priceLow">Price: low to high</option><option value="priceHigh">Price: high to low</option><option value="rating">Guest rating</option></select></label></header>
        {error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">Couldn’t load stays. <button type="button" onClick={() => setRetry((value) => value + 1)} className="underline">Try again</button></div>}
        {loading && <p role="status" className="rounded-2xl bg-sky-50 p-8 text-center">Finding available places to stay…</p>}
        {!loading && data?.items.length === 0 && <p className="rounded-2xl bg-sky-50 p-8 text-center">No stays match your search. Try another destination or clear filters.</p>}
        {!loading && data?.items.length > 0 && <div className="space-y-6">{data.items.map((stay) => <StayCard key={stay.id} stay={stay} search={params}/>)}</div>}
      </section>
    </div>
  </StayPageFrame>;
}
