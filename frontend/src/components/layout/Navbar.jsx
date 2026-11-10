import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { navLinks } from './navLinks';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      {/* Desktop / Main Navbar */}
      <div
        className="
          mx-auto
          flex
          h-16
          w-full
          max-w-7xl
          items-center
          justify-between
          px-5
          sm:px-8
          md:h-20
          lg:px-12
          xl:px-16
        ">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="
            text-xl
            font-bold
            tracking-tight
            text-white
            transition-opacity
            hover:opacity-90
            md:text-2xl
          ">
          Tripzo
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-10">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `
                  relative
                  py-2
                  text-sm
                  font-medium
                  transition-colors
                  after:absolute
                  after:inset-x-0
                  after:bottom-0
                  after:h-0.5
                  after:origin-left
                  after:rounded-full
                  after:bg-[#BED6E9]
                  after:transition-transform
                  lg:text-base
                  ${
                    isActive
                      ? 'text-white after:scale-x-100'
                      : 'text-[#BED6E9] after:scale-x-0 hover:text-white hover:after:scale-x-100'
                  }
                `
              }>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Login */}
          <Link
            to="/login"
            className="
              hidden
              h-10
              items-center
              justify-center
              rounded-full
              bg-white
              px-5
              text-sm
              font-semibold
              text-[#012438]
              transition-colors
              hover:bg-[#BED6E9]
              sm:inline-flex
            ">
            LOG INTO TRAVEL{' '}
          </Link>

          {/* Mobile Menu Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="
              size-10
              rounded-full
              text-white
              hover:bg-white/10
              hover:text-white
              md:hidden
            "
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="
              mx-auto
              w-full
              max-w-7xl
              px-5
              sm:px-8
              md:hidden
              lg:px-12
              xl:px-16
            ">
            <div
              className="
                rounded-2xl
                bg-[#012438]/95
                p-3
                shadow-[0_20px_50px_rgba(2,5,34,0.18)]
                backdrop-blur-xl
              ">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `
                        rounded-xl
                        px-4
                        py-3
                        text-base
                        font-medium
                        transition-colors
                        ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-[#BED6E9] hover:bg-white/10 hover:text-white'
                        }
                      `
                    }>
                    {link.label}
                  </NavLink>
                ))}

                {/* Mobile Login */}
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="
                    mt-2
                    rounded-xl
                    bg-white
                    px-4
                    py-3
                    text-center
                    font-semibold
                    text-[#012438]
                    transition-colors
                    hover:bg-[#BED6E9]
                  ">
                  Login
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
