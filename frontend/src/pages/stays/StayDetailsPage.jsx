import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, MapPin, Phone, Share2 } from 'lucide-react';

import StarRating from '@/components/features/stays/StarRating';
import StayPageFrame from '@/components/features/stays/StayPageFrame';
import { formatMoney, getNights, readStaySearch, toStayQuery } from '@/components/features/stays/stayData';
import { useStay } from '@/hooks/useStays';

export default function StayDetailsPage() {
  const { stayId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [query] = useSearchParams();
  const search = readStaySearch(query);
  const { data: stay, loading, error } = useStay(stayId);
  if (loading) return <StayPageFrame><p role="status">Loading stay details…</p></StayPageFrame>;
  if (error || !stay) return <StayPageFrame><div role="alert" className="rounded-2xl bg-white p-6">Stay not found. <button onClick={() => navigate('/stays/search')} className="underline">Back to results</button></div></StayPageFrame>;
  const nights = getNights(search.checkIn, search.checkOut);
  const total = stay.pricePerNight * Math.max(nights, 1) * search.rooms;
  function share() { if (navigator.share) navigator.share({ title: stay.name, url: window.location.href }).catch(() => {}); else if (navigator.clipboard) navigator.clipboard.writeText(window.location.href); }

  return <StayPageFrame className="space-y-8">
    <button type="button" onClick={() => navigate(`/stays/search${location.search}`)} className="inline-flex items-center gap-2 font-semibold text-[#124E7B]"><ArrowLeft className="size-4"/>Back to results</button>
    <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-semibold text-[#08446E] sm:text-5xl">{stay.name}</h1><p className="mt-2 flex flex-wrap items-center gap-2"><StarRating value={stay.rating} size={18}/>{stay.reviewCount} reviews · {stay.rankText}</p><p className="mt-2 text-zinc-600">{stay.area}, {stay.city} · {stay.distanceFromCenterKm} km from centre</p></div><div className="flex items-center gap-3"><button type="button" onClick={share} aria-label="Share stay" className="rounded-full bg-white p-3"><Share2/></button><button type="button" onClick={() => navigate(`/stays/${stay.id}/reserve?${toStayQuery(search)}`)} className="rounded-full bg-[#2A84C8] px-6 py-3 font-bold text-white">Choose a room</button></div></header>
    <section aria-label="Photos" className="grid gap-4 lg:grid-cols-[1fr_375px]">{stay.gallery.map((image, index) => <img key={image} src={image} alt={`${stay.name} photo ${index + 1}`} className={`${index === 0 ? 'h-72 lg:h-[500px]' : 'hidden h-60 lg:block'} w-full rounded-3xl object-cover shadow-md`}/>)}</section>
    <section className="grid gap-6 lg:grid-cols-3">
      <article className="rounded-3xl bg-white p-6 shadow-md"><h2 className="mb-3 text-xl font-semibold">Ratings and reviews</h2><p className="flex items-center gap-3"><strong className="text-4xl">{stay.rating}</strong><StarRating value={stay.rating}/>{stay.reviewCount}+ reviews</p><p className="mt-3">{stay.rankText}</p><dl className="mt-4 space-y-2">{stay.ratingBreakdown.map((item) => <div key={item.label} className="flex justify-between"><dt>{item.label}</dt><dd><StarRating value={item.value}/></dd></div>)}</dl></article>
      <article className="rounded-3xl bg-white p-6 shadow-md"><h2 className="mb-3 text-xl font-semibold">Guest highlights</h2>{stay.highlights.map((item) => <div key={item.title} className="mb-4 last:mb-0"><h3 className="font-semibold">{item.title}</h3><p className="text-sm">{item.tags}</p><p className="text-sm italic">{item.quote}</p></div>)}</article>
      <article className="rounded-3xl bg-white p-6 shadow-md"><h2 className="mb-3 text-xl font-semibold">Location and contact</h2><p className="mb-4 rounded-2xl bg-emerald-100 p-4"><MapPin className="mr-2 inline size-4"/>{stay.city}</p><p className="flex gap-2 text-sm"><MapPin className="size-5 shrink-0"/>{stay.contact.address}</p><p className="mt-3 flex gap-2 text-sm"><Phone className="size-4"/>{stay.contact.phone}</p><p className="mt-3 flex gap-2 break-all text-sm"><Mail className="size-4"/>{stay.contact.email}</p></article>
    </section>
    <section className="grid gap-6 rounded-3xl bg-white p-6 shadow-md md:grid-cols-3"><div><h2 className="font-semibold">About</h2><p>{stay.about}</p></div><dl><dt className="font-semibold">Property details</dt><dd className="mt-2">{stay.details.propertyType}<br/>{stay.details.priceRange}<br/>{stay.details.specialDiets}</dd></dl><dl><dt className="font-semibold">Facilities and times</dt><dd className="mt-2">{stay.details.amenities.join(', ')}<br/>Check-in: {stay.details.checkIn}<br/>Check-out: {stay.details.checkOut}</dd></dl><p className="font-semibold md:col-span-3">Estimated total: {formatMoney(total, stay.price.currency)} for {Math.max(nights, 1)} night(s), {search.rooms} room(s)</p></section>
  </StayPageFrame>;
}
