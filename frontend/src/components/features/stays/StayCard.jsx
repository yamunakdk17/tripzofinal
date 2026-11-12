import { Link } from 'react-router-dom';

import { formatMoney, toStayQuery } from './stayData';
import StarRating from './StarRating';

export default function StayCard({ stay, search }) {
  return (
    <article className="grid overflow-hidden rounded-3xl border border-black/10 bg-white shadow-md sm:grid-cols-[minmax(0,1fr)_1.2fr]">
      <img src={stay.image} alt={stay.name} className="h-56 w-full object-cover sm:h-full" loading="lazy" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3"><div><h2 className="text-2xl font-semibold text-[#044777]">{stay.name}</h2><p className="text-sm text-zinc-600">{stay.area}, {stay.city}</p><p className="mt-1 text-sm">{stay.distanceFromCenterKm} km from centre</p></div><StarRating value={stay.rating} /></div>
        <p className="text-sm leading-6">{stay.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3"><span className="font-semibold">{formatMoney(stay.pricePerNight, stay.price.currency)} / night</span><Link className="rounded-full bg-[#124E7B] px-5 py-3 font-semibold text-white" to={`/stays/${stay.id}?${toStayQuery(search)}`}>View stay</Link></div>
      </div>
    </article>
  );
}
