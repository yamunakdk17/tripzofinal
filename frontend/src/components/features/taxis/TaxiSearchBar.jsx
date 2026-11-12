import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, MapPin, Plane, Search, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { airportRoutes } from './taxiData';

const schema = z
  .object({
    tripType: z.enum(['city', 'airport']),
    pickup: z.string().trim(),
    dropoff: z.string().trim(),
    route: z.string(),
    pickupAt: z.string().min(1, 'Select a pick-up date and time'),
    dropoffAt: z.string().min(1, 'Select a drop-off date and time'),
    passengers: z.coerce.number().int().min(1).max(6),
  })
  .superRefine((values, ctx) => {
    if (values.tripType === 'city' && !values.pickup) {
      ctx.addIssue({ code: 'custom', path: ['pickup'], message: 'Enter a pick-up location' });
    }
    if (values.tripType === 'city' && !values.dropoff) {
      ctx.addIssue({ code: 'custom', path: ['dropoff'], message: 'Enter a drop-off location' });
    }
    if (values.tripType === 'airport' && !airportRoutes.some((route) => route.id === values.route)) {
      ctx.addIssue({ code: 'custom', path: ['route'], message: 'Select an airport route' });
    }
    if (values.pickupAt && values.dropoffAt) {
      const pickupDate = new Date(values.pickupAt);
      const dropoffDate = new Date(values.dropoffAt);
      if (Number.isNaN(pickupDate.getTime()) || Number.isNaN(dropoffDate.getTime())) {
        ctx.addIssue({ code: 'custom', path: ['pickupAt'], message: 'Enter valid pick-up and drop-off times' });
      } else if (dropoffDate <= pickupDate) {
        ctx.addIssue({ code: 'custom', path: ['dropoffAt'], message: 'Drop-off must be after pick-up' });
      }
    }
  });

const inputClass =
  'w-full min-w-0 bg-transparent text-sm font-medium text-[#222123] outline-none placeholder:text-[#222123]/70 sm:text-base';

function SearchField({ icon: Icon, label, className, children }) {
  return (
    <label className={cn('flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 shadow-sm', className)}>
      <Icon className="size-5 shrink-0 text-[#124E7B]" aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="mb-1 block text-xs text-black/60">{label}</span>
        {children}
      </span>
    </label>
  );
}

export default function TaxiSearchBar({ defaultValues, onSearch, variant = 'hero' }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues });

  const compact = variant === 'compact';
  const airport = useWatch({ control, name: 'tripType' }) === 'airport';
  const firstError =
    errors.pickup || errors.dropoff || errors.route || errors.pickupAt || errors.dropoffAt || errors.passengers;

  useEffect(() => {
    if (airport) {
      setValue('pickup', '');
      setValue('dropoff', '');
    }
  }, [airport, setValue]);

  return (
    <form onSubmit={handleSubmit(onSearch)} noValidate className="flex w-full flex-col gap-3">
      <div role="radiogroup" aria-label="Trip type" className="flex w-fit gap-1 rounded-full bg-white/90 p-1 shadow-md">
        {[
          ['city', 'City taxi'],
          ['airport', 'Airport transfer'],
        ].map(([value, label]) => (
          <label key={value} className="cursor-pointer">
            <input type="radio" value={value} {...register('tripType')} className="peer sr-only" />
            <span className="block rounded-full px-3 py-1.5 text-xs font-medium peer-checked:bg-[#0B2A3F] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#0762B5] sm:px-4 sm:text-sm">
              {label}
            </span>
          </label>
        ))}
      </div>

      <div className={cn('grid gap-3 sm:grid-cols-2', compact && 'lg:grid-cols-4')}>
        {airport && (
          <SearchField
            icon={Plane}
            label="Airport route"
            className={cn('col-span-full bg-white/90', compact && 'lg:col-span-2')}
          >
            <select {...register('route')} className={inputClass}>
              <option value="">Select airport route</option>
              {airportRoutes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.label}
                </option>
              ))}
            </select>
          </SearchField>
        )}
        {!airport && (
          <>
            <SearchField icon={MapPin} label="Pick-up location" className="bg-white/90">
              <input {...register('pickup')} placeholder="Pick-up location" className={inputClass} />
            </SearchField>
            <SearchField icon={MapPin} label="Drop-off location" className="bg-white/90">
              <input {...register('dropoff')} placeholder="Drop-off location" className={inputClass} />
            </SearchField>
          </>
        )}
        <SearchField icon={CalendarDays} label="Pick-up date and time" className="bg-white/90">
          <input type="datetime-local" {...register('pickupAt')} className={inputClass} />
        </SearchField>
        <SearchField icon={CalendarDays} label="Drop-off date and time" className="bg-white/90">
          <input type="datetime-local" {...register('dropoffAt')} className={inputClass} />
        </SearchField>
        <SearchField icon={Users} label="Passengers" className="bg-white/90">
          <select {...register('passengers')} className={inputClass}>
            {Array.from({ length: 6 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1} {index === 0 ? 'Passenger' : 'Passengers'}
              </option>
            ))}
          </select>
        </SearchField>
      </div>

      {airport && (
        <div className="grid gap-3 sm:grid-cols-2">
          <SearchField icon={MapPin} label="Exact pick-up address (optional)" className="bg-white/90">
            <input {...register('pickup')} placeholder="Use airport by default" className={inputClass} />
          </SearchField>
          <SearchField icon={MapPin} label="Exact drop-off address (optional)" className="bg-white/90">
            <input {...register('dropoff')} placeholder="Use route destination by default" className={inputClass} />
          </SearchField>
        </div>
      )}

      {firstError && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {firstError.message}
        </p>
      )}
      <Button type="submit" className="h-12 w-full rounded-full bg-[#124E7B] text-base font-semibold text-white hover:bg-[#0e3f64] sm:w-auto sm:self-end">
        <Search className="mr-2 size-4" aria-hidden="true" />
        Search taxis
      </Button>
    </form>
  );
}
