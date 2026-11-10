import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BedDouble, MapPin, Star, StarHalf } from 'lucide-react';

import { destinations, destinationsContent } from './homeData';

const { title, backgroundImage, mustVisitLabel, staysLabel, staysTo, maxRating } =
  destinationsContent;

export default function HomeDestinations() {
  return (
    <section
      aria-labelledby="destinations-heading"
      className="relative isolate overflow-hidden bg-[#C8DEEA] font-['Roboto',sans-serif]">
      {/* Background */}
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full object-cover"
      />

      <div className="absolute inset-0 -z-10 bg-[#C8DEEA]/85" />

      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-5 sm:py-12 lg:px-6 lg:py-16">
        {/* Heading */}
        <motion.h2
          id="destinations-heading"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-semibold leading-tight tracking-tight text-[#020522] sm:text-3xl lg:text-4xl">
          {title}
        </motion.h2>

        {/* Swipe Container */}
        <div
          className="
            mt-6
            -mx-4
            overflow-x-auto
            px-4
            pb-3
            sm:-mx-5
            sm:px-5
            md:mt-8
            lg:mx-0
            lg:px-0
            [scrollbar-width:none]
            [-ms-overflow-style:none]
            [&::-webkit-scrollbar]:hidden
          ">
          <div className="flex snap-x snap-mandatory gap-4 lg:gap-5">
            {destinations.map(
              ({ id, city, tagline, rating, image, imageAlt, mustVisit }, index) => (
                <motion.article
                  key={id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                  }}
                  className="
                    flex
                    min-w-full
                    snap-start
                    flex-col
                    overflow-hidden
                    rounded-[18px]
                    bg-white
                    shadow-[0_3px_8px_rgba(0,0,0,0.14)]
                    sm:min-w-[calc((100%-1rem)/2)]
                    lg:min-w-[calc((100%-2.5rem)/3)]
                    sm:rounded-[20px]
                  ">
                  {/* Destination Image */}
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={image}
                      alt={imageAlt}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    {/* City + Rating */}
                    <div className="flex items-start justify-between gap-2">
                      {/* Location */}
                      <div className="flex min-w-0 items-start gap-1.5">
                        <MapPin
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0 fill-[#6B6B6B] text-[#6B6B6B] sm:size-5"
                        />

                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold leading-tight text-[#012438] sm:text-xl">
                            {city}
                          </h3>

                          <p className="mt-1 text-xs font-medium leading-5 text-[#020522] sm:text-sm">
                            {tagline}
                          </p>
                        </div>
                      </div>

                      {/* Rating + Nearby Stays */}
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        {/* Rating */}
                        <div
                          role="img"
                          aria-label={`${rating} out of ${maxRating} stars`}
                          className="flex gap-px">
                          {Array.from({ length: maxRating }, (_, starIndex) => {
                            const isFull = rating >= starIndex + 1;

                            const isHalf = !isFull && rating >= starIndex + 0.5;

                            return (
                              <span
                                key={starIndex}
                                className="relative size-3 sm:size-3.5">
                                <Star
                                  aria-hidden="true"
                                  className={`size-full ${
                                    isFull
                                      ? 'fill-[#FFB400] text-[#FFB400]'
                                      : 'fill-[#D9D9D9] text-[#D9D9D9]'
                                  }`}
                                />

                                {isHalf && (
                                  <StarHalf
                                    aria-hidden="true"
                                    className="absolute inset-0 size-full fill-[#FFB400] text-[#FFB400]"
                                  />
                                )}
                              </span>
                            );
                          })}
                        </div>

                        {/* Nearby Stays */}
                        <Link
                          to={staysTo}
                          className="flex items-center gap-1 text-[10px] font-medium text-[#020522] transition-colors hover:text-[#044777] sm:text-[11px]">
                          <BedDouble aria-hidden="true" className="size-3 sm:size-3.5" />

                          {staysLabel}
                        </Link>
                      </div>
                    </div>

                    {/* Must Visit */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-[#020522] sm:text-base">
                        {mustVisitLabel}
                      </h4>

                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs leading-5 text-[#020522] sm:text-sm">
                        {mustVisit.map((place) => (
                          <li key={place}>{place}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.article>
              ),
            )}
          </div>
        </div>

        {/* Swipe Indicators */}
        {destinations.length > 1 && (
          <div className="mt-4 flex justify-center gap-1.5 lg:mt-6">
            {destinations.map(({ id }, index) => (
              <span
                key={id}
                aria-hidden="true"
                className={`size-2 rounded-full ${
                  index === 0 ? 'bg-[#0A93B0]' : 'bg-[#0A93B0]/35'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
