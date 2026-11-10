import { useEffect, useId, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftRight,
  Backpack,
  Briefcase,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Luggage,
  Map as MapIcon,
  Minus,
  Moon,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Search,
  SlidersHorizontal,
  Sun,
  Sunrise,
  Sunset,
  User,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import Footer from '@/components/layout/footer';
import { airports } from '@/components/features/flights/flightData';
import { cn } from '@/lib/utils';
import {
  applyFilters,
  createDefaultFilters,
  FARE_LABEL,
  formatDuration,
  getFilterBounds,
  getFilterOptions,
  getFlightResults,
  getFlightSearch,
  getStopsLabel,
  getTabSummary,
  sortFlights,
  TIME_SLOTS,
} from '@/components/features/flights/flightResultsData';
import { isFlightApiConfigured, searchFlights } from '@/lib/flightBookingApi';

const SLOT_ICONS = {
  'before-6': Sunrise,
  '6-12': Sun,
  '12-18': Sunset,
  'after-18': Moon,
};
const EMPTY_FLIGHTS = [];

const THUMB_CLASSES =
  'pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent focus-visible:outline-none ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-500 [&::-webkit-slider-thumb]:bg-white ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-slate-500 [&::-moz-range-thumb]:bg-white';

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FilterSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className="border-t border-zinc-200 py-4 first:border-t-0 first:pt-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-center justify-between rounded text-left text-base font-semibold text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          {title}
          {open ? <ChevronUp className="size-4 text-zinc-700" aria-hidden /> : <ChevronDown className="size-4 text-zinc-700" aria-hidden />}
        </button>
      </h3>
      {open && <div id={panelId} className="mt-4">{children}</div>}
    </section>
  );
}

function Stepper({ label, icon: Icon, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm text-zinc-800">
        <Icon className="size-4 text-zinc-600" aria-hidden />
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= 0}
          onClick={() => onChange(value - 1)}
          className="grid size-6 place-items-center rounded-md bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 disabled:text-zinc-300 disabled:hover:bg-white">
          <Minus className="size-3.5" aria-hidden />
        </button>
        <span className="w-4 text-center text-sm tabular-nums">{value}</span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
          className="grid size-6 place-items-center rounded-md bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100">
          <Plus className="size-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

function CheckRow({ id, label, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3 text-sm text-zinc-800">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="size-4 rounded accent-slate-500" />
      {label}
    </label>
  );
}

function TimeGroup({ title, selected, onToggle }) {
  return (
    <div className="mt-4 first:mt-0">
      <p className="mb-2 text-sm text-zinc-800">{title}</p>
      <div className="grid grid-cols-4 gap-2">
        {TIME_SLOTS.map((slot) => {
          const Icon = SLOT_ICONS[slot.id];
          const active = selected.includes(slot.id);
          return (
            <button
              key={slot.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(slot.id)}
              className={cn(
                'flex h-16 flex-col items-center justify-center gap-1 rounded-xl border px-1 text-center text-[11px] leading-tight text-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                active ? 'border-transparent bg-white shadow-sm' : 'border-zinc-300 hover:bg-white/60',
              )}>
              <Icon className="size-5" aria-hidden />
              {slot.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FlightFilters({ filters, onChange, bounds, options, origin, destination, hasReturn }) {
  const uid = useId();
  const mode = filters.timeMode;
  const [minPrice, maxPrice] = filters.price;
  const timeGroups = mode === 'takeoff'
    ? [{ leg: 'outbound', title: `Take-off from ${origin.code}` }, { leg: 'inbound', title: `Take-off from ${destination.code}` }]
    : [{ leg: 'outbound', title: `Landing in ${destination.code}` }, { leg: 'inbound', title: `Landing in ${origin.code}` }];
  const activeTimeGroups = hasReturn ? timeGroups : timeGroups.slice(0, 1);

  function toggleTime(leg, slotId) {
    onChange({
      times: {
        ...filters.times,
        [mode]: { ...filters.times[mode], [leg]: toggleInList(filters.times[mode][leg], slotId) },
      },
    });
  }

  return (
    <div>
      <FilterSection title="Bags" defaultOpen>
        <div className="space-y-3">
          <Stepper label="Cabin baggage" icon={Backpack} value={filters.cabinBags} onChange={(value) => onChange({ cabinBags: value })} />
          <Stepper label="Checked baggage" icon={Luggage} value={filters.checkedBags} onChange={(value) => onChange({ checkedBags: value })} />
        </div>
      </FilterSection>
      <FilterSection title="Stops" defaultOpen>
        <div className="space-y-3">
          <CheckRow id={`${uid}-direct`} label="Direct" checked={filters.stops.direct} onChange={() => onChange({ stops: { ...filters.stops, direct: !filters.stops.direct } })} />
          <CheckRow id={`${uid}-one`} label="1 stop" checked={filters.stops.one} onChange={() => onChange({ stops: { ...filters.stops, one: !filters.stops.one } })} />
          <CheckRow id={`${uid}-two`} label="2+ stops" checked={filters.stops.twoPlus} onChange={() => onChange({ stops: { ...filters.stops, twoPlus: !filters.stops.twoPlus } })} />
        </div>
      </FilterSection>
      <FilterSection title="Times" defaultOpen>
        <div role="tablist" aria-label="Time filter type" className="mb-4 grid grid-cols-2 rounded-lg bg-white p-0.5 text-xs font-medium">
          {[{ id: 'takeoff', label: 'Take-off' }, { id: 'landing', label: 'Landing' }].map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={mode === tab.id}
              onClick={() => onChange({ timeMode: tab.id })}
              className={cn('rounded-md py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500', mode === tab.id ? 'bg-slate-500 text-white' : 'text-zinc-700 hover:bg-zinc-100')}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTimeGroups.map((group) => (
          <TimeGroup key={group.leg} title={group.title} selected={filters.times[mode][group.leg]} onToggle={(slotId) => toggleTime(group.leg, slotId)} />
        ))}
      </FilterSection>
      <FilterSection title="Price" defaultOpen>
        <div className="relative h-5">
          <div className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-500" />
          <input type="range" aria-label="Minimum price" min={0} max={bounds.maxPrice} step={10} value={minPrice} onChange={(event) => onChange({ price: [Math.min(Number(event.target.value), maxPrice), maxPrice] })} className={THUMB_CLASSES} />
          <input type="range" aria-label="Maximum price" min={0} max={bounds.maxPrice} step={10} value={maxPrice} onChange={(event) => onChange({ price: [minPrice, Math.max(Number(event.target.value), minPrice)] })} className={THUMB_CLASSES} />
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className="flex flex-1 items-center justify-between rounded-lg bg-zinc-100 px-3 py-2"><span className="text-xs text-zinc-500">USD</span><span className="font-medium tabular-nums">{minPrice}</span></div>
          <span className="text-xs text-zinc-500">To</span>
          <div className="flex flex-1 items-center justify-between rounded-lg bg-white px-3 py-2"><span className="text-xs text-zinc-500">USD</span><span className="font-medium tabular-nums">{maxPrice >= bounds.maxPrice ? 'Any' : maxPrice}</span></div>
        </div>
      </FilterSection>
      <FilterSection title="Duration">
        <input type="range" aria-label="Maximum total duration" min={0} max={bounds.maxDuration} step={15} value={filters.maxDuration} onChange={(event) => onChange({ maxDuration: Number(event.target.value) })} className="w-full accent-slate-500" />
        <p className="mt-2 text-xs text-zinc-500">Total trip time up to {formatDuration(filters.maxDuration)}</p>
      </FilterSection>
      <FilterSection title="Airline">
        <div className="space-y-3">
          {options.airlines.map((airline) => <CheckRow key={airline} id={`${uid}-airline-${airline}`} label={airline} checked={filters.airlines.includes(airline)} onChange={() => onChange({ airlines: toggleInList(filters.airlines, airline) })} />)}
        </div>
      </FilterSection>
      <FilterSection title="Airports">
        <div className="space-y-3">
          {options.airports.map((airport) => <CheckRow key={airport} id={`${uid}-airport-${airport}`} label={airport} checked={filters.airports.includes(airport)} onChange={() => onChange({ airports: toggleInList(filters.airports, airport) })} />)}
        </div>
      </FilterSection>
    </div>
  );
}

function Pill({ icon: Icon, label, value, ariaLabel, separator, className }) {
  return (
    <button type="button" aria-label={ariaLabel} className={cn('flex h-11 items-center gap-2 rounded-xl bg-zinc-800 px-4 text-sm text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500', className)}>
      {Icon && <Icon className="size-3.5 shrink-0 text-zinc-400" aria-hidden />}
      {label && <span className="shrink-0 text-xs text-zinc-400">{label}</span>}
      {separator && <span className="h-4 w-px shrink-0 bg-zinc-600" />}
      <span className="truncate font-medium">{value}</span>
      <ChevronDown className="ml-auto size-4 shrink-0 text-zinc-300" aria-hidden />
    </button>
  );
}

function FlightResultsSearchBar({ search }) {
  const navigate = useNavigate();

  return (
    <section aria-label="Flight search" className="bg-zinc-900 pt-16 md:pt-20">
      <form onSubmit={(event) => { event.preventDefault(); navigate('/flights'); }} className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 sm:px-6">
        <Pill ariaLabel="Trip type" value={search.tripType} className="w-full sm:w-auto" />
        <Pill icon={PlaneTakeoff} label="From" ariaLabel="Departure city" value={search.from.label} className="min-w-0 flex-1 basis-40" />
        <button type="button" aria-label="Swap origin and destination" className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <ArrowLeftRight className="size-4" aria-hidden />
        </button>
        <Pill icon={PlaneLanding} label="To" ariaLabel="Destination city" value={search.to.label} className="min-w-0 flex-1 basis-40" />
        <Pill icon={CalendarDays} label="Flexible dates" separator ariaLabel="Travel dates" value={search.dates} className="min-w-0 flex-1 basis-48" />
        <Pill icon={User} label="Travelers" ariaLabel="Travelers" value={search.travelers} className="min-w-0 flex-1 basis-40" />
        <button type="submit" aria-label="Search flights" className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <Search className="size-4" aria-hidden />
        </button>
      </form>
    </section>
  );
}

const SORT_TABS = [
  { id: 'best', label: 'Best' },
  { id: 'cheapest', label: 'Cheapest' },
  { id: 'fastest', label: 'Fastest' },
];

function FlightSortTabs({ value, onChange, summaries }) {
  return (
    <div role="tablist" aria-label="Sort flights" className="grid grid-cols-3 rounded-3xl bg-white px-2 shadow-sm">
      {SORT_TABS.map((tab) => {
        const active = value === tab.id;
        const summary = summaries[tab.id];
        return (
          <button key={tab.id} type="button" role="tab" aria-selected={active} onClick={() => onChange(tab.id)} className={cn('relative px-3 pb-3 pt-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:px-6', active ? 'text-blue-600' : 'text-zinc-900')}>
            <span className="block text-sm font-semibold sm:text-base">{tab.label}</span>
            <span className={cn('mt-0.5 block text-[11px] sm:text-xs', active ? 'text-blue-500' : 'text-zinc-500')}>
              {summary ? `${summary.price} USD · ${formatDuration(summary.duration)}` : '—'}
            </span>
            {active && <motion.span layoutId="flight-sort-underline" className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />}
          </button>
        );
      })}
    </div>
  );
}

function Leg({ leg }) {
  return (
    <div>
      <p className="text-[11px] text-zinc-500">{leg.dateLabel}</p>
      <div className="mt-2 flex items-center gap-3">
        <span className="w-10 shrink-0 text-sm font-semibold text-zinc-900">{leg.from}</span>
        <div className="flex flex-1 items-center">
          <span className="h-px flex-1 bg-zinc-300" />
          <span className="mx-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium text-zinc-700">{getStopsLabel(leg.stops)}</span>
          <Plane className="size-3.5 shrink-0 rotate-45 fill-blue-600 text-blue-600" aria-hidden />
          <span className="h-px flex-1 bg-zinc-300" />
        </div>
        <span className="w-10 shrink-0 text-right text-sm font-semibold text-zinc-900">{leg.to}</span>
      </div>
      <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center text-xs text-zinc-500">
        <span>{leg.depart}</span>
        <span className="font-medium text-blue-600">{formatDuration(leg.durationMinutes)}</span>
        <span className="text-right">{leg.arrive}</span>
      </div>
    </div>
  );
}

function FlightResultCard({ flight, destinationCity, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const { outbound, inbound, bags } = flight;
  return (
    <motion.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="list-none">
      <article className="relative flex flex-col rounded-3xl bg-white shadow-sm md:flex-row">
        <div className="flex-1 p-5 sm:p-6">
          <Leg leg={outbound} />
          {inbound && (
            <>
              <div className="my-4 flex items-center">
                <span className="flex-1 border-t border-dashed border-zinc-300" />
                <span className="mx-3 rounded-full bg-zinc-100 px-3 py-1 text-[11px] text-zinc-600">{flight.nights} nights in {destinationCity}</span>
                <span className="flex-1 border-t border-dashed border-zinc-300" />
              </div>
              <Leg leg={inbound} />
            </>
          )}
        </div>
        <aside className="relative flex flex-col justify-between border-t border-dashed border-zinc-300 p-5 md:w-64 md:border-l md:border-t-0">
          <span aria-hidden className="absolute -left-2 -top-2 hidden size-4 rounded-full bg-zinc-50 md:block" />
          <span aria-hidden className="absolute -bottom-2 -left-2 hidden size-4 rounded-full bg-zinc-50 md:block" />
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-900">
              <div className="flex items-center gap-3" aria-label={`${bags.cabin} cabin bag, ${bags.checked} checked bag`}>
                <span className="flex items-center gap-1">{bags.cabin}<Briefcase className="size-4" aria-hidden /></span>
                <Backpack className="size-4 text-zinc-300" aria-hidden />
                <span className="flex items-center gap-1">{bags.checked}<Luggage className="size-4" aria-hidden /></span>
              </div>
              <button type="button" aria-label="Toggle fare details" aria-expanded={expanded} onClick={() => setExpanded((open) => !open)} className="rounded p-1 text-zinc-600 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <ChevronDown className={cn('size-4 transition-transform', expanded && 'rotate-180')} aria-hidden />
              </button>
            </div>
            {expanded && <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">{flight.airline} · {bags.cabin} cabin bag · {bags.checked} checked bag</p>}
            <p className="mt-2 border-t border-zinc-100 pt-2 text-[11px] text-zinc-500">{FARE_LABEL}</p>
          </div>
          <p className="my-4 text-center text-2xl font-semibold text-zinc-900">{flight.price} USD</p>
          <button type="button" onClick={() => onSelect(flight)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700">
            Select flight
          </button>
        </aside>
      </article>
    </motion.li>
  );
}

function FlightRouteMap({ flights, origin, destination }) {
  const minPrice = flights.length
    ? flights.reduce((lowest, flight) => Math.min(lowest, flight.price), Infinity)
    : null;
  return (
    <figure className="overflow-hidden rounded-3xl bg-white p-3 shadow-sm">
      <svg viewBox="0 0 400 260" role="img" aria-label={`Route map from ${origin.city} to ${destination.city}`} className="h-auto w-full rounded-2xl bg-sky-50">
        <defs>
          <pattern id="flight-map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#bae6fd" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="260" fill="url(#flight-map-grid)" />
        <path d="M300 90 Q205 18 112 178" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" />
        <circle cx="300" cy="90" r="11" fill="#2563eb" opacity="0.15" />
        <circle cx="300" cy="90" r="6" fill="#2563eb" />
        <text x="300" y="74" textAnchor="middle" fontSize="12" fontWeight="600" fill="#18181b">{origin.city} ({origin.code})</text>
        <circle cx="112" cy="178" r="5" fill="#fff" stroke="#2563eb" strokeWidth="2" />
        <text x="112" y="205" textAnchor="middle" fontSize="12" fontWeight="600" fill="#18181b">{destination.city} ({destination.code})</text>
        {minPrice !== null && <text x="112" y="223" textAnchor="middle" fontSize="10" fill="#3f3f46">from {minPrice} USD</text>}
      </svg>
      <figcaption className="px-1 pt-2 text-[11px] text-zinc-500">Sample map with dummy positions. Connect a real map later.</figcaption>
    </figure>
  );
}

export default function FlightResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const rawSearch = useMemo(
    () => location.state?.search ?? {
      tripType: query.get('tripType'),
      from: query.get('from'),
      to: query.get('to'),
      departureDate: query.get('departureDate'),
      returnDate: query.get('returnDate'),
      travellers: Number(query.get('travellers')) || 1,
      cabin: query.get('cabin'),
    },
    [location.state, query],
  );
  const search = useMemo(() => getFlightSearch(rawSearch, airports), [rawSearch]);
  const searchKey = useMemo(() => JSON.stringify(search), [search]);
  const [flightLoad, setFlightLoad] = useState(null);
  const isCurrentSearch = flightLoad?.key === searchKey;
  const flights = isCurrentSearch ? flightLoad.flights : EMPTY_FLIGHTS;
  const loading = !isCurrentSearch;
  const searchError = isCurrentSearch ? flightLoad.error : '';
  const bounds = useMemo(
    () => getFilterBounds(flights),
    [flights],
  );
  const options = useMemo(() => getFilterOptions(flights), [flights]);
  const [filters, setFilters] = useState(() => createDefaultFilters(bounds));
  const [sortMode, setSortMode] = useState('best');
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    let active = true;

    const loadFlights = async () => {
      try {
        const results = isFlightApiConfigured
          ? await searchFlights(search)
          : getFlightResults(search.from, search.to, search.departureDate, search.returnDate, search.tripType);
        if (!active) return;
        setFlightLoad({ key: searchKey, flights: results, error: '' });
        setFilters(createDefaultFilters(getFilterBounds(results)));
      } catch (error) {
        if (!active) return;
        setFlightLoad({
          key: searchKey,
          flights: [],
          error: error.message || 'Unable to load flights. Please try again.',
        });
      }
    };

    loadFlights();
    return () => { active = false; };
  }, [search, searchKey]);

  const filtered = useMemo(() => applyFilters(flights, filters), [flights, filters]);
  const sorted = useMemo(() => sortFlights(filtered, sortMode), [filtered, sortMode]);
  const summaries = useMemo(
    () => ({
      best: getTabSummary(filtered, 'best'),
      cheapest: getTabSummary(filtered, 'cheapest'),
      fastest: getTabSummary(filtered, 'fastest'),
    }),
    [filtered],
  );

  function updateFilters(patch) {
    setFilters((current) => ({ ...current, ...patch }));
  }

  function resetFilters() {
    setFilters(createDefaultFilters(bounds));
  }

  function selectFlight(flight) {
    navigate('/flights/booking', { state: { search, flight } });
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <FlightResultsSearchBar search={search} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-10">
        {!isFlightApiConfigured && (
          <p role="status" className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Sample flights are shown for preview. Live search, booking, and payment require a connected Tripzo API.
          </p>
        )}
        <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-14">
          <aside aria-label="Flight filters" className={showFilters ? 'block' : 'hidden lg:block'}>
            <FlightFilters filters={filters} onChange={updateFilters} bounds={bounds} options={options} origin={search.from} destination={search.to} hasReturn={search.tripType !== 'One-way'} />
          </aside>
          <section aria-label="Flight results" className="mx-auto w-full max-w-2xl lg:mx-0">
            <FlightSortTabs value={sortMode} onChange={setSortMode} summaries={summaries} />
            <div className="mb-3 mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-zinc-800" aria-live="polite">{loading ? 'Searching flights…' : `${sorted.length} results`}</p>
              <div className="flex items-center gap-2">
                <button type="button" aria-expanded={showFilters} onClick={() => setShowFilters((open) => !open)} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden">
                  <SlidersHorizontal className="size-3.5" aria-hidden />Filters
                </button>
                <button type="button" aria-pressed={showMap} onClick={() => setShowMap((open) => !open)} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <MapIcon className="size-3.5" aria-hidden />{showMap ? 'Hide map' : 'Show map'}
                </button>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {showMap && (
                <motion.div key="map" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="mb-4 overflow-hidden">
                  <FlightRouteMap flights={sorted} origin={search.from} destination={search.to} />
                </motion.div>
              )}
            </AnimatePresence>
            {loading ? (
              <div role="status" className="rounded-3xl bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold">Searching available flights…</p>
                <p className="mt-1 text-xs text-zinc-500">This may take a few seconds.</p>
              </div>
            ) : searchError ? (
              <div role="alert" className="rounded-3xl bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold">We couldn’t load flights</p>
                <p className="mt-1 text-sm text-red-700">{searchError}</p>
                <button type="button" onClick={() => navigate(0)} className="mt-4 h-10 rounded-xl bg-blue-600 px-5 text-sm text-white hover:bg-blue-700">Try again</button>
              </div>
            ) : sorted.length > 0 ? (
              <ul className="space-y-5">
                {sorted.map((flight) => (
                  <FlightResultCard key={flight.id} flight={flight} destinationCity={search.to.city} onSelect={selectFlight} />
                ))}
              </ul>
            ) : flights.length === 0 ? (
              <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold">No flights found for this search</p>
                <p className="mt-1 text-xs text-zinc-500">Try different cities or travel dates.</p>
                <button type="button" onClick={() => navigate('/flights')} className="mt-4 h-10 rounded-xl bg-blue-600 px-5 text-sm text-white hover:bg-blue-700">Change search</button>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
                <p className="text-sm font-semibold">No flights match your filters</p>
                <p className="mt-1 text-xs text-zinc-500">Try widening the price, stops or time options.</p>
                <button type="button" onClick={resetFilters} className="mt-4 h-10 rounded-xl bg-blue-600 px-5 text-sm text-white hover:bg-blue-700">Reset filters</button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
