import { Link } from 'react-router-dom';

import StarRating from '@/components/features/stays/StarRating';
import StaySearchBar from '@/components/features/stays/StaySearchBar';
import StayPageFrame from '@/components/features/stays/StayPageFrame';
import { stayHero } from '@/components/features/stays/stayData';
import { useStayOffers } from '@/hooks/useStays';

export default function StaysPage() {
  const { data: offers = [], loading, error } = useStayOffers();
  return <>
    <section className="relative bg-cover bg-center" style={{ backgroundImage: `url(${stayHero.image})` }}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/10 to-black/10" />
      <div className="relative mx-auto grid max-w-[1500px] gap-8 px-4 pb-16 pt-20 sm:px-8 lg:min-h-[620px] lg:grid-cols-[minmax(0,520px)_1fr] lg:items-end">
        <div><h1 className="text-4xl font-semibold text-[#050138] sm:text-6xl">{stayHero.title}<span className="block">{stayHero.highlight}</span></h1><p className="mt-6 max-w-lg rounded-3xl bg-[#FFEEB1]/90 p-5 text-lg leading-7 shadow-md">{stayHero.description}</p></div>
        <StaySearchBar />
      </div>
    </section>
    <StayPageFrame className="space-y-8">
      <h2 className="text-3xl font-semibold text-[#020522] sm:text-5xl">Unbeatable Deals on <span className="font-bold">Budget Stays</span></h2>
      {loading && <p role="status">Loading offers…</p>}{error && <p role="alert" className="text-red-700">Couldn’t load stay offers.</p>}
      <ul className="grid gap-6 lg:grid-cols-3">{offers.map((offer) => <li key={offer.id} className="overflow-hidden rounded-3xl bg-white shadow-lg"><img src={offer.image} alt={offer.name} className="h-56 w-full object-cover" loading="lazy"/><div className="space-y-3 p-5"><div className="flex justify-between gap-3"><div><h3 className="text-2xl font-semibold">{offer.name}</h3><p className="text-sm text-zinc-600">{offer.location}</p></div><StarRating value={offer.rating}/></div><p className="font-semibold text-emerald-800">{offer.offer}</p><p className="rounded-full bg-teal-700 py-2 text-center font-bold text-white">{offer.currency} {offer.pricePerNight.toLocaleString('en-US')} per night</p><Link to={`/stays/search?destination=${encodeURIComponent(offer.location)}`} className="block rounded-xl border border-teal-800 py-2 text-center font-semibold text-teal-900">Explore this area</Link></div></li>)}</ul>
    </StayPageFrame>
  </>;
}
