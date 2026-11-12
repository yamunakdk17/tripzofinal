import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { formatMoney } from '@/components/features/stays/stayData';
import TaxiPageShell from '@/components/features/taxis/TaxiPageShell';
import {
  formatTripDate,
  getLocationLabel,
  getTripLocations,
  getTaxiSpecs,
  readTaxiParams,
} from '@/components/features/taxis/taxiUtils';
import { Button } from '@/components/ui/button';
import { createBooking, useTaxi } from '@/hooks/useTaxis';

const passengerSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name').max(80),
  lastName: z.string().trim().min(1, 'Enter your last name').max(80),
  dial: z.string().min(1, 'Select a country code'),
  phone: z.string().trim().regex(/^[0-9\s()-]{7,18}$/, 'Enter a valid phone number'),
  email: z.union([z.literal(''), z.string().trim().email('Enter a valid email address')]),
  notes: z.string().trim().max(500, 'Notes must be 500 characters or fewer'),
});

const countries = [
  { dial: '+977', label: 'Nepal (+977)' },
  { dial: '+94', label: 'Sri Lanka (+94)' },
  { dial: '+91', label: 'India (+91)' },
  { dial: '+1', label: 'United States (+1)' },
];

export default function TaxiDetailsPage() {
  const { taxiId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const search = readTaxiParams(searchParams);
  const { data: taxi, loading, error } = useTaxi(taxiId);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(passengerSchema),
    defaultValues: { firstName: '', lastName: '', dial: '+977', phone: '', email: '', notes: '' },
  });

  const locations = getTripLocations(search);

  async function onSubmit(passenger) {
    setSubmitting(true);
    setSubmitError('');
    try {
      const booking = await createBooking({ taxiId, search, passenger });
      navigate(`/airport-taxi/booking/${booking.id}`);
    } catch (bookingError) {
      setSubmitError(bookingError.message || 'Could not create your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <TaxiPageShell>
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-8">
        <Link to={`/airport-taxi/results?${searchParams.toString()}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#124E7B]">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to vehicles
        </Link>
        <h1 className="mb-6 mt-4 text-2xl font-semibold sm:text-3xl">Vehicle and passenger details</h1>

        {loading && <p role="status" className="py-8 text-slate-600">Loading vehicle details…</p>}
        {error && (
          <div role="alert" className="rounded-xl bg-red-50 p-5 text-red-800">
            <p>Could not load this vehicle: {error.message}</p>
            <Link to={`/airport-taxi/results?${searchParams.toString()}`} className="mt-3 inline-block underline">Return to results</Link>
          </div>
        )}

        {taxi && (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
            <section className="rounded-2xl border border-black/15 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <img src={taxi.image} alt={taxi.name} className="h-48 w-full rounded-xl object-contain sm:h-36 sm:w-52" />
                <div>
                  <h2 className="text-2xl font-semibold text-[#044777]">{taxi.name}</h2>
                  <p className="text-sm text-black/60">{taxi.subtitle}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {getTaxiSpecs(taxi).map((spec) => (
                      <li key={spec} className="rounded-full bg-sky-50 px-3 py-1 text-xs">{spec}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-lg font-semibold">{formatMoney(taxi.price, 'NPR')} <span className="text-sm font-normal text-black/60">estimated base fare</span></p>
                </div>
              </div>

              <h2 className="mb-4 text-xl font-semibold">Passenger details</h2>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium">
                    First name
                    <input {...register('firstName')} autoComplete="given-name" className="mt-1 w-full rounded-lg border p-3" />
                    {errors.firstName && <span role="alert" className="mt-1 block text-red-700">{errors.firstName.message}</span>}
                  </label>
                  <label className="block text-sm font-medium">
                    Last name
                    <input {...register('lastName')} autoComplete="family-name" className="mt-1 w-full rounded-lg border p-3" />
                    {errors.lastName && <span role="alert" className="mt-1 block text-red-700">{errors.lastName.message}</span>}
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-[minmax(145px,0.7fr)_1fr]">
                  <label className="block text-sm font-medium">
                    Country code
                    <select {...register('dial')} autoComplete="tel-country-code" className="mt-1 w-full rounded-lg border bg-white p-3">
                      {countries.map((country) => <option key={country.dial} value={country.dial}>{country.label}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-medium">
                    Phone number
                    <input {...register('phone')} type="tel" autoComplete="tel-national" className="mt-1 w-full rounded-lg border p-3" />
                    {errors.phone && <span role="alert" className="mt-1 block text-red-700">{errors.phone.message}</span>}
                  </label>
                </div>

                <label className="block text-sm font-medium">
                  Email (optional)
                  <input {...register('email')} type="email" autoComplete="email" className="mt-1 w-full rounded-lg border p-3" />
                  {errors.email && <span role="alert" className="mt-1 block text-red-700">{errors.email.message}</span>}
                </label>

                <label className="block text-sm font-medium">
                  Notes for the driver (optional)
                  <textarea {...register('notes')} rows={3} maxLength={500} className="mt-1 w-full rounded-lg border p-3" />
                  {errors.notes && <span role="alert" className="mt-1 block text-red-700">{errors.notes.message}</span>}
                </label>

                {submitError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{submitError}</p>}
                <Button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[#044368] text-white hover:bg-[#033250]">
                  {submitting ? <><Loader2 className="mr-2 size-4 animate-spin" /> Creating booking…</> : 'Review booking'}
                </Button>
              </form>
            </section>

            <aside className="h-fit rounded-2xl bg-sky-50 p-5">
              <h2 className="text-lg font-semibold">Your trip</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {search.tripType === 'airport' && <div><dt className="text-black/60">Airport route</dt><dd className="font-medium">{getLocationLabel(search)}</dd></div>}
                <div><dt className="text-black/60">Pick-up</dt><dd className="font-medium">{locations.pickup}</dd></div>
                <div><dt className="text-black/60">Drop-off</dt><dd className="font-medium">{locations.dropoff}</dd></div>
                <div><dt className="text-black/60">Pick-up time</dt><dd className="font-medium">{formatTripDate(search.pickupAt)}</dd></div>
                <div><dt className="text-black/60">Drop-off time</dt><dd className="font-medium">{formatTripDate(search.dropoffAt)}</dd></div>
                <div><dt className="text-black/60">Passengers</dt><dd className="font-medium">{search.passengers}</dd></div>
              </dl>
              <p className="mt-5 border-t border-sky-200 pt-4 text-sm text-black/65">
                This demo uses sample vehicle data and saves booking details only in this browser session.
              </p>
            </aside>
          </div>
        )}
      </main>
    </TaxiPageShell>
  );
}
