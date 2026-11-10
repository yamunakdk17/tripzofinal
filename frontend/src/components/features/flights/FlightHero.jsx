import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';

import FlightSearch from './FlightSearch';

const heroContent = {
  headingLineOne: 'It’s A Big World Out',
  headingLineTwo: 'There,',
  highlight: 'Go Explore!',
  description:
    'We’re here to make your travel dreams a reality. Our intuitive search engine scours thousands of flights to bring you the best deals tailored to your preferences and budget.',
  rating: {
    score: '5.00 Ratings',
    note: 'from 100+ reviews',
  },
  reviewers: [
    { id: 'reviewer-1', initials: 'A', color: '#F76641' },
    { id: 'reviewer-2', initials: 'B', color: '#C92535' },
    { id: 'reviewer-3', initials: 'C', color: '#172C43' },
    { id: 'reviewer-4', initials: 'D', color: '#E5A45B' },
  ],
};

function Bird({ className = '' }) {
  return (
    <svg viewBox="0 0 60 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 15 Q14 0 30 12 Q46 0 58 15"
        stroke="#F0833A"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AirplaneIllustration() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.2 }}
      className="pointer-events-none relative z-[1] mx-auto w-[300px] sm:w-[400px] lg:w-[540px] xl:w-[600px]"
      aria-hidden="true">
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <svg
          viewBox="0 0 600 190"
          className="h-auto w-full"
          xmlns="http://www.w3.org/2000/svg">
          <g fill="#C92535">
            {/* Rear horizontal stabilizers */}
            <path d="M284 62 L240 82 L284 80 Z" />
            <path d="M316 62 L360 82 L316 80 Z" />

            {/* Wings */}
            <path d="M292 92 L14 62 Q0 60 4 72 L18 84 L270 128 L290 126 Z" />
            <path d="M308 92 L586 62 Q600 60 596 72 L582 84 L330 128 L310 126 Z" />

            {/* Winglets */}
            <path d="M8 68 L3 46 L22 62 Z" />
            <path d="M592 68 L597 46 L578 62 Z" />

            {/* Fuselage */}
            <path d="M300 30 C284 60 280 92 282 122 C284 150 292 166 300 174 C308 166 316 150 318 122 C320 92 316 60 300 30 Z" />

            {/* Vertical stabilizer */}
            <path d="M293 42 L300 2 L307 42 Z" />

            {/* Engines */}
            <circle cx="150" cy="120" r="15" />
            <circle cx="450" cy="120" r="15" />
          </g>

          {/* Engine intakes */}
          <circle cx="150" cy="120" r="7" fill="#8F1624" />
          <circle cx="450" cy="120" r="7" fill="#8F1624" />

          {/* Cockpit windows */}
          <path
            d="M289 134 Q300 126 311 134 L308 144 Q300 140 292 144 Z"
            fill="#FFF4C0"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default function FlightHero({ onSearch }) {
  return (
    <section
      aria-label="Flight search"
      className="relative bg-white font-['Manrope',sans-serif]">
      {/* Colored hero area */}
      <div
        className="
          relative isolate overflow-hidden
          bg-gradient-to-b from-[#FFC93F] via-[#FFB33F] to-[#FF9A3D]
          pb-16 pt-24
          sm:pb-[72px] sm:pt-28
          lg:pt-32
        ">
        {/* Birds */}
        <Bird className="absolute left-[14%] top-[47%] w-8 sm:w-10" />
        <Bird className="absolute right-[10%] top-[40%] w-8 sm:w-10" />
        <Bird className="absolute bottom-[18%] left-[3%] w-7 sm:w-9" />
        <Bird className="absolute bottom-[28%] right-[2%] w-8 sm:w-11" />

        {/* Hills behind the tab strip */}
        <div className="pointer-events-none absolute -left-16 bottom-0 h-12 w-72 rounded-t-full bg-[#FF8F3A] sm:h-14 lg:w-[22rem]" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-12 w-72 rounded-t-full bg-[#FF8F3A] sm:h-14 lg:w-[22rem]" />

        {/* Heading + description */}
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
          <div className="grid items-start gap-5 md:grid-cols-2 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}>
              <h1
                className="
                  text-[32px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#172C43]
                  sm:text-[40px] md:text-[40px] lg:text-[52px] xl:text-[58px]
                ">
                {heroContent.headingLineOne}
                <br className="hidden sm:block" /> {heroContent.headingLineTwo}{' '}
                <span className="relative inline-block whitespace-nowrap">
                  {heroContent.highlight}
                  <svg
                    viewBox="0 0 240 14"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 h-2.5 w-full sm:h-3">
                    <path
                      d="M3 9 C50 2 120 2 237 8"
                      stroke="#F76641"
                      strokeWidth="4"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-md md:ml-auto md:justify-self-end lg:pt-2">
              <p className="text-[13px] leading-[1.7] text-[#4B5563] sm:text-sm lg:text-[15px]">
                {heroContent.description}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {heroContent.reviewers.map((reviewer) => (
                    <span
                      key={reviewer.id}
                      style={{ backgroundColor: reviewer.color }}
                      className="flex size-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white sm:size-8">
                      {reviewer.initials}
                    </span>
                  ))}
                </div>

                <p className="flex flex-wrap items-center gap-1 text-[11px] text-[#26384A] sm:text-xs">
                  <Star
                    className="size-3.5 fill-[#F5A623] text-[#F5A623]"
                    aria-hidden="true"
                  />
                  <span className="font-bold">{heroContent.rating.score}</span>
                  <span>{heroContent.rating.note}</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sun + airplane */}
        <div className="relative mt-6 sm:mt-2 lg:-mt-4">
          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute left-1/2 top-1/2 z-0
              size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFF3C4]
              sm:size-[500px] lg:size-[680px] xl:size-[760px]
            "
          />
          <AirplaneIllustration />
        </div>
      </div>

      {/* Search area: tabs overlap the colored hero, the card sits on white */}
      <div className="relative z-10 bg-white px-3 pb-14 sm:px-6 sm:pb-16">
        <div className="-mt-11 sm:-mt-[52px]">
          <FlightSearch onSearch={onSearch} />
        </div>
      </div>
    </section>
  );
}
