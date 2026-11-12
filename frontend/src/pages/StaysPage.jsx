import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowDownUp,
  ArrowLeft,
  BedDouble,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Search,
  Share2,
  Star,
} from 'lucide-react';

import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import {
  countries,
  emptyStayFilters,
  emptyStaySearch,
  filterOptions,
  formatMoney,
  formatStayDate,
  getNights,
  readStaySearch,
  stayHero,
  stayOffers,
  staySearchDefaults,
  toStayQuery,
} from '@/components/features/stays/stayData';
import { createStayBooking, getStayBooking, getStayById, searchStays, simulateStayPayment } from '@/services/stayService';

const shellClass = 'min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-white';
const inputClass = 'mt-1.5 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-[#2A84C8] focus:ring-2 focus:ring-sky-100';
const cardClass = 'rounded-[20px] bg-white p-5 shadow-md sm:p-6';

function StarRating({ value, size = 16 }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={size} className={index < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-amber-400'} aria-hidden="true" />
      ))}
    </span>
  );
}

function PageFrame({ children, className = '' }) {
  return (
    <div className={shellClass}>
      <main className={`mx-auto min-h-[65vh] max-w-[1500px] px-4 pb-16 pt-24 sm:px-8 md:pt-28 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

function StaySearchBar({ initialValues = emptyStaySearch, onSearch, compact = false }) {
  const [error, setError] = useState('');
  const today = new Date().toISOString().slice(0, 10);

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      destination: String(form.get('destination') || '').trim(),
      checkIn: String(form.get('checkIn') || ''),
      checkOut: String(form.get('checkOut') || ''),
      rooms: Number(form.get('rooms')) || 1,
    };

    if (!values.destination) {
      setError('Enter a destination to find a stay.');
      return;
    }
    if (!values.checkIn || !values.checkOut) {
      setError('Choose both check-in and check-out dates.');
      return;
    }
    if (values.checkOut <= values.checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }
    setError('');
    onSearch(values);
  }

  const shell = compact
    ? 'flex flex-wrap gap-3 rounded-2xl bg-white/80 p-3 shadow-md lg:flex-nowrap'
    : 'grid gap-3 rounded-[2rem] bg-white/80 p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-[minmax(240px,1.8fr)_1fr_1fr_150px_auto] lg:p-5';

  return (
    <form onSubmit={submit} noValidate className={shell}>
      <label className={`flex min-w-0 items-center gap-2 rounded-full bg-[#EADBC8]/80 px-4 py-2.5 ${compact ? 'flex-[2] basis-56' : ''}`}>
        <MapPin className="size-5 shrink-0 text-[#124E7B]" aria-hidden="true" />
        <span className="sr-only">Destination</span>
        <input name="destination" defaultValue={initialValues.destination} placeholder="Going to? Add your destination" className="w-full min-w-0 bg-transparent text-sm font-medium outline-none placeholder:text-zinc-600" />
      </label>
      <label className="flex items-center gap-2 rounded-full bg-[#EADBC8]/80 px-4 py-2.5">
        <CalendarDays className="size-5 shrink-0 text-[#124E7B]" aria-hidden="true" />
        <span className="sr-only">Check-in date</span>
        <input name="checkIn" aria-label="Check-in date" type="date" min={today} defaultValue={initialValues.checkIn} required className="w-full min-w-0 bg-transparent text-sm outline-none" />
      </label>
      <label className="flex items-center gap-2 rounded-full bg-[#EADBC8]/80 px-4 py-2.5">
        <CalendarDays className="size-5 shrink-0 text-[#124E7B]" aria-hidden="true" />
        <span className="sr-only">Check-out date</span>
        <input name="checkOut" aria-label="Check-out date" type="date" min={initialValues.checkIn || today} defaultValue={initialValues.checkOut} required className="w-full min-w-0 bg-transparent text-sm outline-none" />
      </label>
      <label className="flex items-center gap-2 rounded-full bg-[#EADBC8]/80 px-4 py-2.5">
        <BedDouble className="size-5 shrink-0 text-[#124E7B]" aria-hidden="true" />
        <span className="sr-only">Rooms</span>
        <select name="rooms" defaultValue={initialValues.rooms || 1} className="w-full bg-transparent text-sm outline-none">
          {Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? 'Room' : 'Rooms'}</option>)}
        </select>
      </label>
      <Button type="submit" className="h-11 rounded-full bg-[#124E7B] px-6 text-white hover:bg-[#0e3f64]">
        <Search className="size-4" aria-hidden="true" /> Search
      </Button>
      {error && <p role="alert" className="col-span-full text-sm font-medium text-red-700">{error}</p>}
    </form>
  );
}

function StayHome() {
  const navigate = useNavigate();

  function search(values) {
    navigate(`/stays/search?${toStayQuery(values)}`);
  }

  return (
    <div>
      <section className="relative bg-cover bg-center" style={{ backgroundImage: `url(${stayHero.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/10 to-black/20" />
        <div className="relative mx-auto grid max-w-[1500px] gap-8 px-4 pb-20 pt-24 sm:px-8 sm:pb-24 lg:min-h-[650px] lg:grid-cols-[minmax(0,560px)_1fr] lg:items-end lg:pb-20">
          <div>
            <h1 className="text-4xl font-semibold leading-tight text-[#050138] sm:text-6xl">
              {stayHero.title}<span className="block">{stayHero.highlight}</span>
            </h1>
            <p className="mt-6 max-w-lg rounded-[2rem] bg-gradient-to-b from-[#FFEEB1]/95 to-[#E2E9E7]/95 p-5 text-base leading-7 shadow-md sm:text-xl">
              {stayHero.description}
            </p>
          </div>
          <StaySearchBar onSearch={search} />
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-200/80 to-emerald-100 py-14 sm:py-16">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
          <h2 className="text-3xl font-semibold text-[#020522] sm:text-5xl">
            Unbeatable Deals on <span className="font-bold">Budget Stays</span>
          </h2>
          <ul className="mt-8 flex snap-x gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {stayOffers.map((offer) => (
              <li key={offer.id} className="w-[85%] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-white shadow-lg sm:w-[60%] lg:w-auto">
                <img src={offer.image} alt={offer.name} className="h-56 w-full object-cover" loading="lazy" />
                <div className="space-y-2 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div><h3 className="text-2xl font-medium text-[#012438]">{offer.name}</h3><p className="text-sm text-black/60">{offer.location}</p></div>
                    <StarRating value={offer.rating} />
                  </div>
                  <p className="text-lg font-semibold text-[#057910]">OFFER: <span>{offer.offer}</span></p>
                  <p className="rounded-full bg-teal-600 py-2 text-center text-lg font-bold text-white">{offer.currency} {offer.pricePerNight.toLocaleString('en-US')} per night</p>
                  <button type="button" onClick={() => search({ ...staySearchDefaults, destination: offer.location, rooms: 1 })} className="w-full rounded-xl border border-teal-700 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-50">Explore this area</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function StayFilters({ filters, onChange, onShowMap }) {
  function toggle(name, value) {
    const selected = filters[name];
    onChange({
      ...filters,
      [name]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
    });
  }

  const groups = [
    { title: 'Property type', name: 'propertyTypes', options: filterOptions.propertyTypes },
    { title: 'Price Range', name: 'priceRanges', options: filterOptions.priceRanges },
    { title: 'Facilities', name: 'facilities', options: filterOptions.facilities },
    { title: 'Distance from centre', name: 'distances', options: filterOptions.distances },
  ];

  return (
    <aside className="space-y-5">
      <div className="relative grid h-40 place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-100 via-sky-100 to-emerald-200 shadow-md">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <svg viewBox="0 0 400 160" className="size-full"><path d="M0 130 Q70 30 135 100 T260 60 T400 100" fill="none" stroke="#28856b" strokeWidth="3" /><path d="M0 145 Q100 70 180 130 T400 80" fill="none" stroke="#5593bd" strokeWidth="2" /></svg>
        </div>
        <button type="button" onClick={onShowMap} className="relative rounded-full bg-[#CEE9D6] px-5 py-3 text-sm font-semibold text-[#0C2833] shadow-md hover:bg-[#bddfc8]"><MapPin className="mr-1 inline size-4" aria-hidden="true" />Show on map</button>
      </div>
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#DAF4FA] to-[#AAC1ED]/70 shadow-md">
        <h2 className="border-b border-[#74C5F2] bg-[#CDE6F0] px-5 py-4 text-xl font-medium">Filter by:</h2>
        {groups.map((group) => (
          <fieldset key={group.name} className="border-b border-[#3B9CD3] px-5 py-4 last:border-b-0">
            <legend className="mb-2 text-lg font-medium">{group.title}</legend>
            <div className="space-y-2">
              {group.options.map((option) => (
                <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" checked={filters[group.name].includes(option.value)} onChange={() => toggle(group.name, option.value)} className="size-4 accent-[#124E7B]" />
                  {option.label}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button type="button" onClick={() => onChange(emptyStayFilters)} className="m-4 text-sm font-semibold text-[#124E7B] underline">Clear all filters</button>
      </div>
    </aside>
  );
}

function StayCard({ stay, search, favorites, onToggleFavorite }) {
  const query = `?${toStayQuery(search)}`;
  return (
    <article className="relative grid overflow-hidden rounded-[20px] border border-black/20 bg-white shadow-md sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <img src={stay.image} alt={stay.name} className="h-52 w-full object-cover sm:h-full" loading="lazy" />
      <button type="button" aria-pressed={favorites.includes(stay.id)} aria-label={`${favorites.includes(stay.id) ? 'Remove' : 'Save'} ${stay.name}`} onClick={() => onToggleFavorite(stay.id)} className="absolute left-3 top-3 grid size-10 place-items-center rounded-full bg-white/90 text-black/60 shadow hover:text-red-500">
        <Heart className={favorites.includes(stay.id) ? 'size-5 fill-red-500 text-red-500' : 'size-5'} />
      </button>
      <div className="flex flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div><h3 className="text-2xl font-medium leading-tight tracking-wide text-[#044777] sm:text-[28px]">{stay.name}</h3><p className="text-sm text-black/70">{stay.area}, {stay.city}</p><p className="text-sm">{stay.distanceFromCenterKm} km from center</p></div>
          <StarRating value={stay.rating} size={18} />
        </div>
        <p className="text-sm font-light leading-6">{stay.description}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <p className="text-sm"><span className="font-semibold">{formatMoney(stay.pricePerNight, stay.price.currency)}</span> / night</p>
          <Link to={`/stays/${stay.id}${query}`} className="rounded-[20px] bg-[#124E7B] px-6 py-3 text-base font-bold tracking-wide text-white shadow-md hover:bg-[#0e3f64]">View Prices</Link>
        </div>
      </div>
    </article>
  );
}

function StayResults({ search }) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(emptyStayFilters);
  const [sortBy, setSortBy] = useState('recommended');
  const [showMap, setShowMap] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [retry, setRetry] = useState(0);
  const [result, setResult] = useState(null);
  const key = JSON.stringify({ search, filters, sortBy, retry });
  const current = result?.key === key ? result : null;

  useEffect(() => {
    let active = true;
    searchStays(search, filters, sortBy)
      .then((data) => { if (active) setResult({ key, data, error: null }); })
      .catch((error) => { if (active) setResult({ key, data: null, error }); });
    return () => { active = false; };
  }, [key, search, filters, sortBy, retry]);

  const loading = !current;

  function searchAgain(values) {
    navigate(`/stays/search?${toStayQuery(values)}`);
  }

  function toggleFavorite(id) {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  function showLocationMap() {
    setShowMap((visible) => !visible);
  }

  return (
    <PageFrame className="space-y-8">
      <StaySearchBar key={toStayQuery(search)} initialValues={search} onSearch={searchAgain} compact />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] xl:grid-cols-[minmax(0,415px)_1fr]">
        <StayFilters filters={filters} onChange={setFilters} onShowMap={showLocationMap} />
        <section className="min-w-0 rounded-[2rem] bg-white p-4 shadow-md sm:p-6" aria-busy={loading}>
          <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-medium sm:text-3xl">{current?.data ? `${current.data.locationLabel}: ${current.data.total} properties found` : 'Searching stays…'}</h1>
            <label className="flex items-center gap-2 text-sm font-medium">
              <ArrowDownUp className="size-5" aria-hidden="true" />
              <span className="sr-only">Sort stays</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-lg border border-zinc-300 bg-white px-2 py-2">
                <option value="recommended">Our top picks</option>
                <option value="priceLow">Price: low to high</option>
                <option value="priceHigh">Price: high to low</option>
                <option value="rating">Guest rating</option>
              </select>
            </label>
          </header>
          {showMap && (
            <div className="mb-5 rounded-2xl bg-gradient-to-br from-emerald-100 to-sky-100 p-5" role="region" aria-label="Stay locations">
              <h2 className="font-semibold text-[#044777]">Properties near {search.destination || 'your destination'}</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {(current?.data?.items || []).map((stay) => <li key={stay.id} className="flex items-center gap-2 rounded-xl bg-white/80 p-3 text-sm"><MapPin className="size-4 text-teal-700" aria-hidden="true" />{stay.name} · {stay.distanceFromCenterKm} km from centre</li>)}
              </ul>
            </div>
          )}
          {current?.error && <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">Couldn’t load stays: {current.error.message} <button type="button" onClick={() => setRetry((value) => value + 1)} className="ml-2 underline">Try again</button></div>}
          {loading && <div role="status" className="flex items-center justify-center gap-3 rounded-2xl bg-sky-50 p-10 text-sm text-[#124E7B]"><LoaderCircle className="size-5 animate-spin" aria-hidden="true" />Finding available places to stay…</div>}
          {!loading && current?.data?.items.length === 0 && <div className="rounded-2xl bg-sky-50 p-8 text-center"><h2 className="font-semibold">No stays match this search</h2><p className="mt-2 text-sm text-zinc-600">Try another destination or clear some filters.</p><button type="button" onClick={() => setFilters(emptyStayFilters)} className="mt-4 font-semibold text-[#124E7B] underline">Clear filters</button></div>}
          {!loading && current?.data?.items.length > 0 && <div className="space-y-6">{current.data.items.map((stay) => <StayCard key={stay.id} stay={stay} search={search} favorites={favorites} onToggleFavorite={toggleFavorite} />)}</div>}
        </section>
      </div>
    </PageFrame>
  );
}

function StayDetails({ stay, search }) {
  const navigate = useNavigate();
  const [galleryIndex, setGalleryIndex] = useState(-1);
  const [favorite, setFavorite] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const query = `?${toStayQuery(search)}`;
  const nights = getNights(search.checkIn, search.checkOut);
  const total = stay.pricePerNight * Math.max(nights, 1) * search.rooms;

  async function share() {
    const shareData = { title: stay.name, text: `${stay.name} in ${stay.area}, ${stay.city}`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage('Link copied to clipboard.');
      } else {
        setShareMessage('Copy the page address from your browser to share this stay.');
      }
    } catch {
      setShareMessage('This stay could not be shared right now.');
    }
  }

  const card = cardClass;

  return (
    <PageFrame className="space-y-8">
      <Link to={`/stays/search${query}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#124E7B]"><ArrowLeft className="size-4" aria-hidden="true" />Back to results</Link>
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#08446E] sm:text-5xl">{stay.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-sm sm:text-lg"><StarRating value={stay.rating} size={19} /> {stay.reviewCount}+ reviews <span className="text-zinc-500">| {stay.rankText}</span></p>
          <p className="mt-2 flex items-center gap-2 text-sm text-zinc-600"><MapPin className="size-4" aria-hidden="true" />{stay.area}, {stay.city} · {stay.distanceFromCenterKm} km from centre</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setFavorite((value) => !value)} aria-pressed={favorite} aria-label="Save to favourites" className="rounded-full p-3 text-zinc-500 hover:bg-white hover:text-red-500"><Heart className={favorite ? 'size-5 fill-red-500 text-red-500' : 'size-5'} /></button>
          <button type="button" onClick={share} className="rounded-full p-3 text-zinc-500 hover:bg-white" aria-label="Share stay"><Share2 className="size-5" /></button>
          <button type="button" onClick={() => navigate(`/stays/${stay.id}/reserve${query}`, { state: { stay, search } })} className="rounded-full bg-[#2A84C8] px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-[#176cae] sm:px-8 sm:text-lg">Reserve Now</button>
        </div>
      </header>
      {shareMessage && <p role="status" className="rounded-lg bg-white px-4 py-2 text-sm text-zinc-700">{shareMessage}</p>}
      <section aria-label="Photos" className="grid gap-4 lg:grid-cols-[1fr_375px]">
        {stay.gallery.map((image, index) => (
          <button key={image} type="button" onClick={() => setGalleryIndex(index)} className={`${index === 0 ? 'row-span-2 lg:h-[500px]' : 'h-40 lg:h-full'} relative overflow-hidden rounded-[20px] shadow-md ${index === 0 ? 'lg:col-start-1' : 'hidden lg:block'}`}>
            <img src={image} alt={`${stay.name} photo ${index + 1}`} className="size-full object-cover" />
            {index === 2 && <span className="absolute inset-0 grid place-items-center bg-white/50 text-2xl font-medium text-[#5D5C5C]">See More photos</span>}
            {index === 0 && <span className="absolute left-4 top-4 rounded-[2rem] bg-[#124E7B] px-5 py-3 text-white shadow-md"><span className="block text-2xl font-bold">{formatMoney(total, stay.price.currency)}</span><span className="text-xs">Estimated total · {Math.max(nights, 1)} nights · {search.rooms} rooms</span></span>}
          </button>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        <div className={card}>
          <h2 className="mb-3 text-xl font-medium">Ratings and reviews</h2>
          <p className="flex flex-wrap items-center gap-2"><span className="text-4xl font-semibold text-[#042D6A]">{stay.rating}</span><StarRating value={stay.rating} size={20} /> <span>{stay.reviewCount}+ reviews</span></p>
          <p className="mt-3">{stay.rankText}</p><p className="mt-1">Guest favourite</p>
          <dl className="mt-4 space-y-2">{stay.ratingBreakdown.map((row) => <div key={row.label} className="flex items-center justify-between"><dt>{row.label}</dt><dd><StarRating value={row.value} size={17} /></dd></div>)}</dl>
        </div>
        <div className={card}>
          <h2 className="mb-3 text-xl font-medium">Guest highlights</h2>
          {stay.highlights.map((item) => <div key={item.title} className="mb-4 last:mb-0"><p className="font-medium">{item.title}</p><p className="text-sm">{item.tags}</p><p className="text-sm italic text-black/70">{item.quote}</p></div>)}
        </div>
        <div className={card}>
          <h2 className="mb-3 text-xl font-medium">Location and contact</h2>
          <div className="mb-4 grid h-28 place-items-center rounded-[2rem] bg-gradient-to-br from-emerald-100 via-sky-100 to-emerald-200"><span className="rounded-full bg-[#CEE9D6] px-4 py-2 text-sm text-[#0C2833]"><MapPin className="mr-1 inline size-4" />{stay.city}</span></div>
          <ul className="space-y-3 break-words text-sm"><li className="flex gap-3"><MapPin className="size-5 shrink-0 opacity-60" />{stay.contact.address}</li><li className="flex gap-3"><Phone className="size-5 shrink-0 opacity-60" />{stay.contact.phone}</li><li className="flex gap-3"><Mail className="size-5 shrink-0 opacity-60" />{stay.contact.email}</li></ul>
        </div>
      </section>
      <section className={card}>
        <h2 className="mb-4 text-2xl font-medium">Details</h2>
        <div className="grid gap-8 border-t border-black/20 pt-6 leading-7 md:grid-cols-3">
          <div><h3 className="font-semibold">About</h3><p>{stay.about}</p></div>
          <dl className="space-y-3"><div><dt className="font-semibold">Price Range</dt><dd>{stay.details.priceRange}</dd></div><div><dt className="font-semibold">Property type</dt><dd>{stay.details.propertyType}</dd></div><div><dt className="font-semibold">Special Diets</dt><dd>{stay.details.specialDiets}</dd></div></dl>
          <dl className="space-y-3"><div><dt className="font-semibold">Check-in / Check-out</dt><dd>{stay.details.checkIn} / {stay.details.checkOut}</dd></div><div><dt className="font-semibold">Facilities</dt><dd>{stay.details.amenities.join(', ')}</dd></div></dl>
        </div>
      </section>
      {galleryIndex >= 0 && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Stay photo gallery" onClick={() => setGalleryIndex(-1)}>
          <button type="button" aria-label="Close gallery" onClick={() => setGalleryIndex(-1)} className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-sm font-semibold">Close</button>
          <button type="button" aria-label="Previous photo" onClick={(event) => { event.stopPropagation(); setGalleryIndex((galleryIndex + stay.gallery.length - 1) % stay.gallery.length); }} className="absolute left-4 rounded-full bg-white p-3"><ChevronLeft /></button>
          <img src={stay.gallery[galleryIndex]} alt={`${stay.name} gallery ${galleryIndex + 1}`} className="max-h-[80vh] max-w-full rounded-xl object-contain" onClick={(event) => event.stopPropagation()} />
          <button type="button" aria-label="Next photo" onClick={(event) => { event.stopPropagation(); setGalleryIndex((galleryIndex + 1) % stay.gallery.length); }} className="absolute right-4 rounded-full bg-white p-3"><ChevronRight /></button>
        </div>
      )}
    </PageFrame>
  );
}

const roomTypes = [
  { id: 'standard', name: 'Standard Double Room', multiplier: 1, description: 'Comfortable room with a double bed and private bathroom.' },
  { id: 'deluxe', name: 'Deluxe Sea View Room', multiplier: 1.45, description: 'Spacious room with a scenic view and breakfast included.' },
  { id: 'family', name: 'Family Room', multiplier: 1.8, description: 'Extra space for families, with flexible bedding.' },
];

function Stepper({ current }) {
  const steps = ['Your Selection', 'Your Details', 'Final Step'];
  return (
    <ol className="mb-8 grid grid-cols-3" aria-label="Booking progress">
      {steps.map((label, index) => (
        <li key={label} aria-current={index + 1 === current ? 'step' : undefined} className="relative flex flex-col items-center text-center">
          <span className={`z-10 grid size-9 place-items-center rounded-full text-sm font-semibold ${index + 1 <= current ? 'bg-[#66A2DF] text-white' : 'bg-zinc-200 text-zinc-600'}`}>{index + 1 < current ? <Check className="size-4" /> : index + 1}</span>
          <span className="mt-2 text-xs font-medium sm:text-sm">{label}</span>
          {index < 2 && <span className={`absolute left-1/2 top-4 h-0.5 w-full ${index + 1 < current ? 'bg-[#66A2DF]' : 'bg-zinc-200'}`} />}
        </li>
      ))}
    </ol>
  );
}

function RoomSelection({ stay, search }) {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState('standard');
  const [rooms, setRooms] = useState(search.rooms);
  const nights = getNights(search.checkIn, search.checkOut);

  function continueToDetails() {
    if (!nights) return;
    const room = roomTypes.find((item) => item.id === roomType);
    const reservation = { room, rooms, nights, unitPrice: Math.round(stay.pricePerNight * room.multiplier), total: Math.round(stay.pricePerNight * room.multiplier * rooms * nights) };
    navigate(`/stays/${stay.id}/guest?${toStayQuery({ ...search, rooms })}`, { state: { stay, search: { ...search, rooms }, reservation } });
  }

  return (
    <PageFrame className="max-w-5xl">
      <Stepper current={1} />
      <h1 className="mb-2 text-3xl font-semibold text-[#08446E]">Select your room</h1>
      <p className="mb-6 text-zinc-600">{stay.name} · {formatStayDate(search.checkIn)} – {formatStayDate(search.checkOut)} · {nights} nights</p>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <fieldset className="space-y-3">
          <legend className="sr-only">Room type</legend>
          {roomTypes.map((room) => {
            const price = Math.round(stay.pricePerNight * room.multiplier);
            return (
              <label key={room.id} className={`flex cursor-pointer gap-4 rounded-2xl border bg-white p-4 shadow-sm ${roomType === room.id ? 'border-[#2A84C8] ring-2 ring-sky-100' : 'border-zinc-200'}`}>
                <input type="radio" name="roomType" checked={roomType === room.id} onChange={() => setRoomType(room.id)} className="mt-1 size-4 accent-[#124E7B]" />
                <span className="min-w-0 flex-1"><span className="block font-semibold text-[#044777]">{room.name}</span><span className="mt-1 block text-sm text-zinc-600">{room.description}</span><span className="mt-2 block text-sm font-semibold">{formatMoney(price, stay.price.currency)} <span className="font-normal text-zinc-500">per room / night</span></span></span>
              </label>
            );
          })}
          <label className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"><span className="font-medium">Rooms</span><select value={rooms} onChange={(event) => setRooms(Number(event.target.value))} className="rounded-lg border border-zinc-300 bg-white px-3 py-2">{Array.from({ length: 10 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
        </fieldset>
        <aside className={`${cardClass} h-fit`}>
          <h2 className="text-lg font-semibold">Your stay</h2>
          <p className="mt-2">{stay.name}</p>
          <p className="mt-2 text-sm text-zinc-600">{formatStayDate(search.checkIn)} – {formatStayDate(search.checkOut)}</p>
          <p className="mt-2 text-sm text-zinc-600">{rooms} rooms · {nights} nights</p>
          <p className="mt-4 border-t pt-4 text-lg font-bold">{formatMoney(Math.round(stay.pricePerNight * (roomTypes.find((item) => item.id === roomType)?.multiplier || 1) * rooms * nights), stay.price.currency)}</p>
          <button type="button" disabled={!nights} onClick={continueToDetails} className="mt-4 w-full rounded-xl bg-[#124E7B] px-4 py-3 font-semibold text-white hover:bg-[#0e3f64] disabled:opacity-50">Continue to guest details</button>
          {!nights && <p role="alert" className="mt-2 text-xs text-red-700">Select valid dates to continue.</p>}
        </aside>
      </div>
    </PageFrame>
  );
}

function GuestDetails({ stay, search, reservation }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const country = countries.find((item) => item.value === form.get('country')) || countries[0];
    const guest = {
      firstName: String(form.get('firstName') || '').trim(),
      lastName: String(form.get('lastName') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: `${country.dial} ${String(form.get('phone') || '').trim()}`,
      country: country.label,
      requests: String(form.get('requests') || '').trim(),
    };
    try {
      const booking = await createStayBooking({
        stayId: stay.id,
        stayName: stay.name,
        stayArea: stay.area,
        search,
        reservation,
        guest,
        amount: reservation.total,
        currency: stay.price.currency,
      });
      navigate(`/stays/booking/${booking.reference}`, { state: { booking } });
    } catch (submitError) {
      setError(submitError.message || 'Unable to create your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageFrame className="max-w-5xl">
      <Stepper current={2} />
      <h1 className="mb-2 text-3xl font-semibold text-[#08446E]">Guest details</h1>
      <p className="mb-6 text-zinc-600">Tell us who is checking in. Your booking details will be used for confirmation.</p>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <form onSubmit={submit} className={`${cardClass} space-y-4`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">First name<input name="firstName" required autoComplete="given-name" maxLength={70} className={inputClass} /></label>
            <label className="text-sm font-medium">Last name<input name="lastName" required autoComplete="family-name" maxLength={70} className={inputClass} /></label>
            <label className="text-sm font-medium">Email address<input name="email" type="email" required autoComplete="email" maxLength={254} className={inputClass} /></label>
            <label className="text-sm font-medium">Country<select name="country" defaultValue="LK" className={inputClass}>{countries.map((country) => <option key={country.value} value={country.value}>{country.label}</option>)}</select></label>
            <label className="text-sm font-medium sm:col-span-2">Phone number<input name="phone" type="tel" required autoComplete="tel-national" minLength={6} maxLength={24} className={inputClass} /></label>
            <label className="text-sm font-medium sm:col-span-2">Special requests <span className="font-normal text-zinc-500">(optional)</span><textarea name="requests" rows={3} maxLength={500} className="mt-1.5 w-full rounded-lg border border-zinc-300 p-3 text-sm outline-none focus:border-[#2A84C8] focus:ring-2 focus:ring-sky-100" /></label>
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#124E7B] px-6 font-semibold text-white hover:bg-[#0e3f64] disabled:opacity-60">{loading && <LoaderCircle className="size-4 animate-spin" />}{loading ? 'Creating booking…' : 'Review booking'}</button>
        </form>
        <aside className={`${cardClass} h-fit`}>
          <h2 className="font-semibold">{stay.name}</h2>
          <p className="mt-2 text-sm text-zinc-600">{reservation.room.name}</p>
          <p className="mt-2 text-sm text-zinc-600">{formatStayDate(search.checkIn)} – {formatStayDate(search.checkOut)}</p>
          <p className="mt-2 text-sm text-zinc-600">{reservation.rooms} rooms · {reservation.nights} nights</p>
          <p className="mt-4 border-t pt-4 text-xl font-bold">{formatMoney(reservation.total, stay.price.currency)}</p>
        </aside>
      </div>
    </PageFrame>
  );
}

function BookingReview({ booking }) {
  const navigate = useNavigate();

  if (!booking) return <PageFrame className="max-w-3xl"><div role="alert" className={`${cardClass} text-center`}><h1 className="text-2xl font-semibold">Booking details expired</h1><p className="mt-2 text-zinc-600">Please select a room and enter your guest details again.</p><Link to="/stays" className="mt-4 inline-block text-[#124E7B] underline">Search stays</Link></div></PageFrame>;

  return (
    <PageFrame className="max-w-3xl">
      <Stepper current={3} />
      <h1 className="mb-2 text-3xl font-semibold text-[#08446E]">Review your booking</h1>
      <p className="mb-6 text-zinc-600">Check your details before choosing a payment method.</p>
      <section className={`${cardClass} space-y-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-[#044777]">{booking.stayName}</h2><p className="text-sm text-zinc-600">{booking.stayArea}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Booking {booking.status}</span></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><p className="text-xs uppercase text-zinc-500">Check-in</p><p className="mt-1 font-medium">{formatStayDate(booking.search.checkIn)}</p></div><div><p className="text-xs uppercase text-zinc-500">Check-out</p><p className="mt-1 font-medium">{formatStayDate(booking.search.checkOut)}</p></div><div><p className="text-xs uppercase text-zinc-500">Room</p><p className="mt-1 font-medium">{booking.reservation.room.name} · {booking.reservation.rooms}</p></div><div><p className="text-xs uppercase text-zinc-500">Primary guest</p><p className="mt-1 font-medium">{booking.guest.firstName} {booking.guest.lastName}</p></div><div><p className="text-xs uppercase text-zinc-500">Email</p><p className="mt-1 break-all font-medium">{booking.guest.email}</p></div><div><p className="text-xs uppercase text-zinc-500">Phone</p><p className="mt-1 font-medium">{booking.guest.phone}</p></div></div>
        <div className="flex items-center justify-between border-t pt-4"><span className="text-lg font-semibold">Total for {booking.reservation.nights} nights</span><span className="text-2xl font-bold text-[#044777]">{formatMoney(booking.amount, booking.currency)}</span></div>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">Demo booking: this sample reservation is not sent to a hotel inventory system.</p>
        <button type="button" onClick={() => navigate(`/stays/payment/${booking.reference}`, { state: { booking } })} className="w-full rounded-xl bg-[#124E7B] px-5 py-3 font-semibold text-white hover:bg-[#0e3f64] sm:w-auto">Continue to payment</button>
      </section>
    </PageFrame>
  );
}

function StayPayment({ booking }) {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(booking?.paymentProvider || 'eSewa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function pay(outcome) {
    setLoading(true);
    setError('');
    try {
      const result = await simulateStayPayment(booking, outcome, provider);
      navigate(`/stays/booking/confirmed/${booking.reference}`, { state: { booking: result } });
    } catch (paymentError) {
      setError(paymentError.message || 'Payment could not be completed.');
    } finally {
      setLoading(false);
    }
  }

  if (!booking) return <BookingReview booking={null} />;

  return (
    <PageFrame className="max-w-3xl">
      <Stepper current={3} />
      <h1 className="mb-2 text-3xl font-semibold text-[#08446E]">Payment</h1>
      <p className="mb-6 text-zinc-600">Choose a payment option for your stay.</p>
      <section className={`${cardClass} space-y-5`}>
        <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{booking.stayName}</h2><p className="mt-1 text-sm text-zinc-600">{booking.reservation.room.name}</p><p className="mt-1 text-sm text-zinc-600">{formatStayDate(booking.search.checkIn)} – {formatStayDate(booking.search.checkOut)}</p></div><p className="text-xl font-bold">{formatMoney(booking.amount, booking.currency)}</p></div>
        <fieldset className="space-y-3"><legend className="mb-2 font-semibold">Payment method</legend>{['eSewa', 'Khalti'].map((method) => <label key={method} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${provider === method ? 'border-[#2A84C8] bg-sky-50' : 'border-zinc-200'}`}><input type="radio" name="payment" value={method} checked={provider === method} onChange={() => setProvider(method)} className="size-4 accent-[#124E7B]" /><span className="font-semibold">{method}</span><span className="ml-auto text-xs text-zinc-500">Demo</span></label>)}</fieldset>
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><p className="font-semibold">Demo payment only</p><p className="mt-1">No real money is charged. Choose a test outcome below. Connect the payment provider before accepting real payments.</p></div>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" disabled={loading} onClick={() => pay('success')} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60">{loading ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />}Simulate successful payment</button>
          <button type="button" disabled={loading} onClick={() => pay('failure')} className="h-12 rounded-xl border border-zinc-300 px-5 font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-60">Simulate payment failure</button>
        </div>
      </section>
    </PageFrame>
  );
}

function Confirmation({ booking }) {
  const navigate = useNavigate();

  if (!booking) return <PageFrame className="max-w-3xl"><section className={`${cardClass} text-center`}><h1 className="text-2xl font-semibold">Booking not found</h1><p className="mt-2 text-zinc-600">Open the confirmation from your booking flow to view the result.</p><Link to="/stays" className="mt-4 inline-block text-[#124E7B] underline">Back to stays</Link></section></PageFrame>;

  const confirmed = booking.status === 'confirmed';
  return (
    <PageFrame className="max-w-3xl">
      <Stepper current={3} />
      <section className={`${cardClass} text-center`}>
        {confirmed ? <CheckCircle2 className="mx-auto size-16 text-emerald-600" aria-hidden="true" /> : <div className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-2xl font-bold text-red-700" aria-hidden="true">!</div>}
        <h1 className={`mt-4 text-3xl font-semibold ${confirmed ? 'text-[#08446E]' : 'text-red-800'}`}>{confirmed ? 'Booking confirmed' : 'Payment not completed'}</h1>
        <p className="mt-3 text-sm leading-7 text-zinc-700">
          {confirmed ? <>Reference <strong>{booking.reference}</strong><br />{booking.stayName}, {formatStayDate(booking.search.checkIn)} – {formatStayDate(booking.search.checkOut)}<br />A confirmation has been prepared for {booking.guest.email}.</> : <>Reference <strong>{booking.reference}</strong><br />{booking.paymentMessage}</>}
        </p>
        {confirmed && (
          <>
            <dl className="mt-6 grid gap-4 rounded-xl bg-sky-50 p-4 text-left sm:grid-cols-2">
              <div><dt className="text-xs uppercase text-zinc-500">Location</dt><dd className="mt-1 font-medium">{booking.stayArea}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-500">Room</dt><dd className="mt-1 font-medium">{booking.reservation.room.name} · {booking.reservation.rooms} room(s)</dd></div>
              <div><dt className="text-xs uppercase text-zinc-500">Guest</dt><dd className="mt-1 font-medium">{booking.guest.firstName} {booking.guest.lastName}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-500">Phone</dt><dd className="mt-1 font-medium">{booking.guest.phone}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-500">Booking status</dt><dd className="mt-1 font-medium">{booking.status}</dd></div>
              <div><dt className="text-xs uppercase text-zinc-500">Payment method</dt><dd className="mt-1 font-medium">{booking.paymentProvider}</dd></div>
            </dl>
            <p className="mt-4 text-lg font-bold">{formatMoney(booking.amount, booking.currency)} paid with {booking.paymentProvider}</p>
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-sm text-amber-950">
              This is a demo booking and simulated payment, not a real hotel reservation or charge.
            </p>
          </>
        )}
        {!confirmed && <button type="button" onClick={() => navigate(`/stays/payment/${booking.reference}`, { state: { booking: { ...booking, status: 'pending' } } })} className="mt-5 rounded-xl bg-[#124E7B] px-5 py-3 font-semibold text-white hover:bg-[#0e3f64]">Try payment again</button>}
        <Link to="/stays" className="mt-6 inline-flex rounded-[20px] bg-[#044368] px-8 py-3 text-lg font-bold text-white">Back to Stays</Link>
      </section>
    </PageFrame>
  );
}

function StayRoute() {
  const location = useLocation();
  const { pathname, search } = location;
  const state = location.state;
  const bookingReference =
    pathname.match(/^\/(?:stays|hotels)\/booking\/confirmed\/([^/]+)$/)?.[1] ||
    pathname.match(/^\/(?:stays|hotels)\/(?:booking|payment)\/([^/]+)/)?.[1];
  const [storedBooking, setStoredBooking] = useState(null);
  const params = useMemo(() => new URLSearchParams(search), [search]);
  const [stayRequest, setStayRequest] = useState(null);
  const routeMatch = pathname.match(/^\/(?:stays|hotels)\/([^/]+)/);
  const stayId = routeMatch?.[1];
  const searchValues = useMemo(() => readStaySearch(params), [params]);
  const shouldLoadStay = Boolean(stayId && !['search', 'booking', 'payment'].includes(stayId));
  const stayLoading = shouldLoadStay && stayRequest?.id !== stayId;
  const currentStay = stayRequest && stayRequest.id === stayId ? stayRequest.stay : null;
  const stayError = stayRequest && stayRequest.id === stayId ? stayRequest.error : '';

  useEffect(() => {
    if (!shouldLoadStay) return undefined;
    let active = true;
    getStayById(stayId)
      .then((data) => { if (active) setStayRequest({ id: stayId, stay: data, error: '' }); })
      .catch((error) => { if (active) setStayRequest({ id: stayId, stay: null, error: error.message }); });
    return () => { active = false; };
  }, [stayId, shouldLoadStay]);

  useEffect(() => {
    if (!bookingReference || state?.booking) return undefined;
    let active = true;
    getStayBooking(bookingReference)
      .then((booking) => { if (active) setStoredBooking(booking); })
      .catch(() => { if (active) setStoredBooking(null); });
    return () => { active = false; };
  }, [bookingReference, state?.booking]);

  if (pathname === '/stays' || pathname === '/hotels' || pathname === '/stays/' || pathname === '/hotels/') return <StayHome />;
  if (pathname === '/stays/search' || pathname === '/hotels/search') return <StayResults search={searchValues} />;

  const booking = state?.booking || storedBooking;
  if (/\/booking\/confirmed(?:\/[^/]+)?$/.test(pathname)) return <Confirmation booking={booking} />;
  if (/\/payment\/[^/]+$/.test(pathname)) return <StayPayment booking={booking} />;
  if (/\/booking\/[^/]+$/.test(pathname)) return <BookingReview booking={booking} />;

  if (stayLoading) return <PageFrame><div role="status" className={`${cardClass} text-center`}><LoaderCircle className="mx-auto size-6 animate-spin text-blue-700" />Loading stay details…</div></PageFrame>;
  if (stayError || !currentStay) {
    return <PageFrame><div role="alert" className={cardClass}>{stayError || 'Stay not found.'} <Link className="underline" to="/stays">Go to Stays</Link></div></PageFrame>;
  }

  const detailRoute = pathname.match(/\/([^/]+)$/)?.[1];
  if (detailRoute === 'reserve') return <RoomSelection stay={currentStay} search={searchValues} />;
  if (detailRoute === 'guest') {
    const reservation = state?.reservation;
    return reservation
      ? <GuestDetails stay={currentStay} search={searchValues} reservation={reservation} />
      : <RoomSelection stay={currentStay} search={searchValues} />;
  }
  return <StayDetails stay={currentStay} search={searchValues} />;
}

export default function StaysPage() {
  return <StayRoute />;
}
