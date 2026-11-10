import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeftRight,
  ChevronDown,
  Minus,
  PlaneLanding,
  PlaneTakeoff,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import {
  airports,
  cabinOptions,
  flightSearchDefaults,
  maxTravellers,
  tripTypes,
} from './flightData';

const flightSearchSchema = z
  .object({
    tripType: z.enum(tripTypes.map((item) => item.value)),
    from: z.string().min(1, 'Select a departure city'),
    to: z.string().min(1, 'Select an arrival city'),
    departureDate: z.string().min(1, 'Choose a departure date'),
    returnDate: z.string().optional(),
    travellers: z.number().int().min(1, 'At least 1 traveller').max(maxTravellers),
    cabin: z.enum(cabinOptions),
  })
  .superRefine((values, ctx) => {
    if (values.from && values.from === values.to) {
      ctx.addIssue({
        code: 'custom',
        path: ['to'],
        message: 'Departure and arrival cities must be different',
      });
    }

    if (values.tripType !== 'oneWay') {
      if (!values.returnDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['returnDate'],
          message: 'Choose a return date',
        });
      } else if (values.departureDate && values.returnDate < values.departureDate) {
        ctx.addIssue({
          code: 'custom',
          path: ['returnDate'],
          message: 'Return date cannot be before departure',
        });
      }
    }
  });

function getAirport(code) {
  return airports.find((airport) => airport.code === code);
}

function getDateParts(iso) {
  if (!iso) {
    return { day: '--', weekday: 'Select date', month: '' };
  }

  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return {
    day: String(day),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    month: `${date.toLocaleDateString('en-US', { month: 'short' })}'${String(year).slice(-2)}`,
  };
}

function Field({ label, error, dimmed = false, className = '', children }) {
  return (
    <div
      className={cn(
        'relative h-[59px] rounded-[11px] border bg-white transition-colors',
        error ? 'border-red-400' : 'border-[#E5E5E5] focus-within:border-[#F76641]',
        dimmed && 'pointer-events-none opacity-50',
        className,
      )}>
      <span className="absolute -top-[9px] left-3 bg-white px-1 text-[11px] font-normal uppercase leading-[15px] tracking-[0.02em] text-[#F76641]">
        {label}
      </span>
      {children}
    </div>
  );
}

function FieldBody({ icon: Icon, big, title, subtitle }) {
  return (
    <div className="pointer-events-none flex h-full items-center gap-2.5 pl-3 pr-2 sm:pl-[14px]">
      {Icon && (
        <Icon className="size-[18px] shrink-0 text-[#D4D4D4]" aria-hidden="true" />
      )}
      <span className="shrink-0 text-lg font-semibold leading-[26px] text-[#1F2937] sm:text-[18.6px]">
        {big}
      </span>
      <span
        aria-hidden="true"
        className="h-[30px] shrink-0 border-l border-dashed border-[#E5E5E5]"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-[22px] text-[#1F2937] sm:text-[14.9px]">
          {title}
        </span>
        <span className="block truncate text-[11px] leading-[15px] text-[#737373]">
          {subtitle}
        </span>
      </span>
      <ChevronDown className="size-[22px] shrink-0 text-[#D4D4D4]" aria-hidden="true" />
    </div>
  );
}

function CityField({ label, icon, registration, code, error }) {
  const airport = getAirport(code);

  return (
    <Field label={label} error={error}>
      <FieldBody
        icon={icon}
        big={airport?.code ?? '---'}
        title={airport?.city ?? 'Select city'}
        subtitle={airport?.name ?? ''}
      />
      <select
        {...registration}
        aria-label={label}
        className="absolute inset-0 size-full cursor-pointer appearance-none rounded-[11px] opacity-0">
        {airports.map((item) => (
          <option key={item.code} value={item.code}>
            {item.city} ({item.code})
          </option>
        ))}
      </select>
    </Field>
  );
}

function DateField({ label, registration, value, min, error, dimmed }) {
  const parts = getDateParts(value);

  function openPicker(event) {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Picker already open or not supported: the native input still works.
    }
  }

  return (
    <Field label={label} error={error} dimmed={dimmed}>
      <FieldBody big={parts.day} title={parts.weekday} subtitle={parts.month} />
      <input
        {...registration}
        type="date"
        min={min}
        aria-label={label}
        tabIndex={dimmed ? -1 : 0}
        onClick={openPicker}
        className="absolute inset-0 size-full cursor-pointer rounded-[11px] opacity-0"
      />
    </Field>
  );
}

function TravellersField({ travellers, cabin, error, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative sm:col-span-2 lg:col-span-1">
      <Field label="Traveler & Class" error={error}>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label="Travellers and cabin class"
          onClick={() => setOpen((current) => !current)}
          className="absolute inset-0 size-full cursor-pointer rounded-[11px]">
          <FieldBody
            icon={Users}
            big={travellers}
            title={cabin}
            subtitle={`${travellers} ${travellers === 1 ? 'Traveller' : 'Travellers'}`}
          />
        </button>
      </Field>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Travellers and cabin class"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 z-30 mb-3 w-full min-w-[260px] rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#1F2937]">Travellers</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Remove a traveller"
                  disabled={travellers <= 1}
                  onClick={() => onChange({ travellers: travellers - 1 })}
                  className="flex size-8 items-center justify-center rounded-full border border-[#F76641] text-[#F76641] transition-colors hover:bg-[#F76641]/10 disabled:cursor-not-allowed disabled:opacity-40">
                  <Minus className="size-4" />
                </button>
                <span className="w-4 text-center text-sm font-semibold text-[#1F2937]">
                  {travellers}
                </span>
                <button
                  type="button"
                  aria-label="Add a traveller"
                  disabled={travellers >= maxTravellers}
                  onClick={() => onChange({ travellers: travellers + 1 })}
                  className="flex size-8 items-center justify-center rounded-full border border-[#F76641] text-[#F76641] transition-colors hover:bg-[#F76641]/10 disabled:cursor-not-allowed disabled:opacity-40">
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div
              role="radiogroup"
              aria-label="Cabin class"
              className="mt-4 grid grid-cols-2 gap-2">
              {cabinOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={cabin === option}
                  onClick={() => onChange({ cabin: option })}
                  className={cn(
                    'rounded-lg border px-2 py-2 text-xs font-semibold transition-colors',
                    cabin === option
                      ? 'border-[#F76641] bg-[#F76641] text-white'
                      : 'border-[#E5E5E5] text-[#1F2937] hover:border-[#F76641]',
                  )}>
                  {option}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-lg bg-[#1F2937] py-2 text-xs font-semibold text-white">
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FlightSearch({ onSearch }) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: flightSearchDefaults,
  });

  const { tripType, from, to, departureDate, returnDate, travellers, cabin } = watch();
  const isOneWay = tripType === 'oneWay';

  const messages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean);

  function handleSwap() {
    const values = getValues();
    const options = { shouldDirty: true, shouldValidate: isSubmitted };

    setValue('from', values.to, options);
    setValue('to', values.from, options);
  }

  function handleTravellerChange(changes) {
    const options = { shouldDirty: true, shouldValidate: isSubmitted };

    if (changes.travellers !== undefined)
      setValue('travellers', changes.travellers, options);
    if (changes.cabin !== undefined) setValue('cabin', changes.cabin, options);
  }

  function submit(values) {
    if (onSearch) {
      onSearch(values);
      return;
    }

    console.info('Flight search', values);
  }

  return (
    <motion.form
      noValidate
      onSubmit={handleSubmit(submit)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      aria-label="Search flights"
      className="mx-auto w-full max-w-[1011px] font-['Manrope',sans-serif] drop-shadow-[0_0_111px_rgba(0,0,0,0.06)]">
      {/* Trip type tabs */}
      <div
        role="tablist"
        aria-label="Trip type"
        className="mx-auto flex h-[44px] max-w-[752px] items-end overflow-hidden rounded-t-[26px] bg-[#F76641] sm:h-[52px]">
        {tripTypes.map((item) => {
          const isActive = tripType === item.value;

          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setValue('tripType', item.value, { shouldDirty: true })}
              className={cn(
                'h-full flex-1 rounded-t-[26px] text-xs transition-colors sm:text-[14.9px]',
                isActive
                  ? 'bg-white font-semibold text-[#F76641]'
                  : 'font-medium text-white hover:bg-white/10',
              )}>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Fields */}
      <div className="relative rounded-[26px] bg-white p-5 pb-10 pt-7 sm:p-6 sm:pb-10 sm:pt-8 lg:px-[22px]">
        <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-[215fr_215fr_154fr_154fr_182fr]">
          <div className="relative grid gap-6 sm:col-span-2 sm:grid-cols-2 sm:gap-x-4 lg:col-span-2">
            <CityField
              label="Departure City"
              icon={PlaneTakeoff}
              registration={register('from')}
              code={from}
              error={errors.from}
            />
            <CityField
              label="Arrival City"
              icon={PlaneLanding}
              registration={register('to')}
              code={to}
              error={errors.to}
            />
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap departure and arrival cities"
              className="absolute right-6 top-1/2 z-10 flex size-[30px] -translate-y-1/2 items-center justify-center rounded-full border border-[#F76641] bg-white text-[#F76641] transition-transform hover:scale-110 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
              <ArrowLeftRight className="size-4 rotate-90 sm:rotate-0" />
            </button>
          </div>

          <DateField
            label="Departure Date"
            registration={register('departureDate')}
            value={departureDate}
            error={errors.departureDate}
          />
          <DateField
            label="Return Date"
            registration={register('returnDate')}
            value={returnDate}
            min={departureDate}
            error={errors.returnDate}
            dimmed={isOneWay}
          />
          <TravellersField
            travellers={travellers}
            cabin={cabin}
            error={errors.travellers || errors.cabin}
            onChange={handleTravellerChange}
          />
        </div>

        {messages.length > 0 && (
          <p role="alert" className="mt-4 text-center text-xs font-medium text-red-500">
            {messages.join(' · ')}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="relative z-10 -mt-[30px] flex justify-center">
        <motion.div whileTap={{ scale: 0.97 }}>
          <Button
            type="submit"
            className="h-[59px] w-[208px] justify-between gap-3 rounded-[11px] border border-[#F76641] bg-[#F76641] py-[7px] pl-[30px] pr-[7px] text-base font-semibold text-white shadow-[0_15px_30px_rgba(247,102,65,0.16)] hover:bg-[#F76641]/90">
            Search Flights
            <span className="flex size-[44px] items-center justify-center rounded-[7px] bg-[#FF8161]">
              <Search className="size-[22px]" aria-hidden="true" />
            </span>
          </Button>
        </motion.div>
      </div>
    </motion.form>
  );
}
