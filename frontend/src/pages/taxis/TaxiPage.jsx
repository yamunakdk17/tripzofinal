import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import TaxiPageShell from '@/components/features/taxis/TaxiPageShell';
import TaxiSearchBar from '@/components/features/taxis/TaxiSearchBar';
import { taxiAssets, taxiHero, taxiSearchDefaults } from '@/components/features/taxis/taxiData';
import { toTaxiQuery } from '@/components/features/taxis/taxiUtils';

export default function TaxiPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const airportSearch = searchParams.get('tripType') === 'airport';
  const defaults = {
    ...taxiSearchDefaults,
    ...(airportSearch ? { pickup: '', dropoff: '', route: '' } : {}),
    tripType: airportSearch ? 'airport' : taxiSearchDefaults.tripType,
  };

  function handleSearch(values) {
    navigate(`/airport-taxi/results?${toTaxiQuery(values)}`);
  }

  return (
    <TaxiPageShell backdrop={false}>
      <main>
        <section className="relative isolate overflow-hidden">
          <img src={taxiAssets.hero} alt="" className="absolute inset-0 -z-10 size-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/60 via-white/20 to-transparent" />

          <div className="mx-auto flex min-h-[720px] max-w-[1500px] flex-col justify-between gap-10 px-4 pb-10 pt-28 sm:px-8 sm:pt-32 lg:min-h-[780px] lg:py-16 lg:pt-36">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="max-w-xl"
            >
              <h1 className="text-3xl font-semibold leading-tight text-[#0B1B3A] sm:text-4xl md:text-5xl xl:text-6xl">
                {taxiHero.title}
                <span className="block font-bold">{taxiHero.highlight}</span>
              </h1>
              <p className="mt-4 max-w-md rounded-[2rem] bg-white/75 p-4 text-sm leading-6 shadow-md backdrop-blur-sm sm:text-base md:text-lg xl:text-xl">
                {taxiHero.description}
              </p>
            </motion.div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <motion.div whileHover={{ scale: 1.02 }} className="w-full max-w-sm">
                <Link
                  to={`/airport-taxi/results?${toTaxiQuery(taxiSearchDefaults)}`}
                  className="block rounded-l-[2rem] rounded-r-full bg-[#0B2A3F]/95 px-6 py-4 text-white shadow-lg"
                >
                  <span className="block text-sm sm:text-base md:text-lg">{taxiHero.ctaLine}</span>
                  <span className="block text-xl font-semibold sm:text-2xl">{taxiHero.ctaAction}</span>
                </Link>
              </motion.div>

              <div className="w-full lg:max-w-[760px]">
                <TaxiSearchBar defaultValues={defaults} onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </TaxiPageShell>
  );
}
