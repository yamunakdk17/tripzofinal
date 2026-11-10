import { motion } from 'framer-motion';

import { destinations } from './homeData';

const PANELS = [
  {
    id: 'nature',
    title: 'Explore Nature',
    image: destinations.find((place) => place.city === 'Pokhara')?.image,
  },
  {
    id: 'cities',
    title: 'Explore Cities',
    image: destinations.find((place) => place.city === 'Kathmandu')?.image,
  },
];

function Swash() {
  return (
    <svg
      viewBox="0 0 190 22"
      aria-hidden="true"
      className="absolute -bottom-2 right-0 h-3 w-[58%] translate-x-[8%] text-white sm:-bottom-3 sm:h-4">
      <motion.path
        d="M2 15 C 44 6, 110 4, 187 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          ease: 'easeOut',
        }}
      />

      <motion.path
        d="M30 19 C 80 10, 130 12, 172 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: 0.6,
          ease: 'easeOut',
        }}
      />
    </svg>
  );
}

/**
 * @param {{
 *   panel: {
 *     id: string,
 *     title: string,
 *     image?: string
 *   },
 *   index: number
 * }} props
 */
function Panel({ panel, index }) {
  return (
    <article
      className="
        group
        relative
        isolate
        flex
        min-h-[220px]
        items-center
        justify-center
        overflow-hidden
        bg-[#020522]
        px-4
        py-10
        sm:min-h-[250px]
        sm:px-5
        sm:py-12
        lg:min-h-[280px]
      ">
      {panel.image && (
        <img
          src={panel.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 -z-10 bg-[#020522]/50" />

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          margin: '-60px',
        }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: 'easeOut',
        }}
        className="flex flex-col items-center text-center">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#c8deea] sm:text-[10px] lg:text-xs">
          Promotion
        </p>

        <h2 className="relative mt-1.5 text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl lg:text-3xl">
          {panel.title}

          <Swash />
        </h2>
      </motion.div>
    </article>
  );
}

export default function ExplorePackages() {
  return (
    <section aria-label="Explore packages" className="grid md:grid-cols-2">
      {PANELS.map((panel, index) => (
        <Panel key={panel.id} panel={panel} index={index} />
      ))}
    </section>
  );
}
