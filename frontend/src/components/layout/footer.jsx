import { motion } from 'framer-motion';
import { ArrowRight, ArrowUp, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { FOOTER_LINKS } from './navLinks';

const ACCOUNT_LINKS = [
  {
    label: 'My Trips',
    to: '/account',
  },
  {
    label: 'Login',
    to: '/login',
  },
  {
    label: 'Sign Up',
    to: '/login?mode=register',
  },
];

const linkClass = 'text-ink transition-colors duration-200 hover:text-link';

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="border-t border-line bg-sand text-ink">
      <motion.div
        initial={{
          opacity: 0,
          y: 24,
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
          ease: 'easeOut',
        }}
        className="
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          px-5
          py-12
          sm:px-8
          md:py-14
          lg:min-h-[437px]
          lg:px-10
          lg:py-16
          xl:px-12
        ">
        {/* Main Footer Content */}
        <div className="grid flex-1 gap-10 sm:grid-cols-2 md:grid-cols-12 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-6 lg:col-span-5">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
              aria-label="Tripzo home">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-white">
                <Plane className="size-5 -rotate-45" aria-hidden="true" />
              </span>

              <span className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Tripzo<span className="text-accent-dark">.</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-lg font-medium leading-snug text-ink sm:text-xl">
              Go somewhere worth remembering.
            </p>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Hotels, flights and airport taxis across Nepal, all in one place with
              Tripzo.
            </p>

            <Button
              render={<Link to="/hotels" />}
              size="lg"
              className="mt-7 rounded-full bg-primary px-6 text-white hover:bg-primary-dark">
              Explore stays
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Travel Links */}
          <nav aria-label="Travel" className="md:col-span-3 lg:col-span-3 lg:col-start-7">
            <p className="mb-4 text-sm font-semibold text-muted">Travel</p>

            <ul className="space-y-3 text-base">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account Links */}
          <nav aria-label="Your trips" className="md:col-span-3 lg:col-span-3">
            <p className="mb-4 text-sm font-semibold text-muted">Your Trips</p>

            <ul className="space-y-3 text-base">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Tripzo Nepal. All rights reserved.</p>

          <button
            type="button"
            onClick={handleBackToTop}
            className="
              inline-flex
              items-center
              gap-2
              self-start
              font-medium
              text-ink
              transition-colors
              hover:text-link
              sm:self-auto
            ">
            Back to top
            <ArrowUp className="size-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </footer>
  );
}
