import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import { formatMoney } from '@/components/features/stays/stayData';
import { Button } from '@/components/ui/button';
import { getTaxiSpecs, toTaxiQuery } from './taxiUtils';

export default function TaxiCard({ taxi, search }) {
  const query = toTaxiQuery(search);
  const to = `/airport-taxi/vehicles/${taxi.id}${query ? `?${query}` : ''}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="grid overflow-hidden rounded-[20px] border border-black/20 bg-white shadow-md sm:grid-cols-[minmax(0,240px)_1fr] lg:grid-cols-[minmax(0,280px)_1fr]"
    >
      <div className="relative bg-white">
        <img src={taxi.image} alt={taxi.name} className="h-44 w-full object-contain sm:h-full" loading="lazy" />
        <button
          type="button"
          aria-label={`Save ${taxi.name}`}
          className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-black/10 text-black/60 hover:text-red-500"
        >
          <Heart className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-medium leading-tight tracking-wide text-[#044777] md:text-2xl xl:text-[32px]">
              {taxi.name}
            </h2>
            <p className="text-sm text-black/70 xl:text-base">{taxi.subtitle}</p>
            <p className="text-xs tracking-wide text-[#010A0F] sm:text-sm">
              {taxi.distanceFromCenterKm} km from center
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium" aria-label={`${taxi.rating} out of 5 stars`}>
            <Star className="size-4 fill-amber-400 text-amber-500" aria-hidden="true" />
            {taxi.rating}
          </span>
        </div>

        <div className="flex flex-1 flex-wrap items-end justify-between gap-4">
          <ul className="list-disc space-y-0.5 pl-5 text-sm tracking-wide sm:text-base xl:text-lg">
            {getTaxiSpecs(taxi).map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <div className="ml-auto flex flex-col items-end gap-2">
            <Link to={to} className="text-base font-medium tracking-wide text-[#43A8C8] hover:underline xl:text-xl">
              View Details
            </Link>
            <Button
              render={<Link to={to} />}
              nativeButton={false}
              className="rounded-full bg-[#124E7B] px-6 py-5 text-base font-bold tracking-wide text-white shadow-md hover:bg-[#0e3f64] xl:text-xl"
            >
              {formatMoney(taxi.price, 'NPR')}
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
