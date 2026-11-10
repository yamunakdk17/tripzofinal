import { motion } from 'framer-motion';

import { heroContent } from './homeData';

export default function HomeHero() {
  return (
    <section className="relative isolate flex min-h-[78vh] items-center overflow-hidden bg-[#012438] sm:min-h-[82vh] lg:min-h-screen">
      {/* Background image */}
      <img
        src={heroContent.image}
        alt={heroContent.imageAlt}
        className="absolute inset-0 -z-20 size-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#020522]/65 via-[#012438]/35 to-[#021B2B]/90" />

      {/* Hero content */}
      <div className="mx-auto flex w-full max-w-6xl px-5 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24 lg:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-2xl text-white">
          {/* Eyebrow */}
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#BED6E9] sm:text-sm">
            {heroContent.eyebrow}
          </p>

          {/* Main heading */}
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {heroContent.title}
          </h1>

          {/* Description */}
          <p className="mt-5 max-w-xl text-sm leading-6 text-[#BED6E9] sm:text-base sm:leading-7 lg:text-lg">
            {heroContent.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
