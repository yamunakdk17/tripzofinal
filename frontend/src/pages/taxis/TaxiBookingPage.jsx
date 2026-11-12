import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import TaxiPageShell from '@/components/features/taxis/TaxiPageShell';
import TaxiTripSummary from '@/components/features/taxis/TaxiTripSummary';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/hooks/useTaxis';

export default function TaxiBookingPage() {
  const { bookingId } = useParams();
  const { data: booking, loading, error } = useBooking(bookingId);

  return (
    <TaxiPageShell>
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-24 sm:px-8">
        <Link to="/airport-taxi" className="inline-flex items-center gap-2 text-sm font-medium text-[#124E7B]">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to taxis
        </Link>
        <h1 className="mb-6 mt-4 text-2xl font-semibold sm:text-3xl">Review your booking</h1>
        {loading && <p role="status" className="flex items-center gap-2 py-8"><Loader2 className="size-4 animate-spin" /> Loading booking…</p>}
        {error && (
          <div role="alert" className="rounded-xl bg-red-50 p-5 text-red-800">
            <p>Could not load this booking: {error.message}</p>
            <Link to="/airport-taxi" className="mt-3 inline-block underline">Start a new search</Link>
          </div>
        )}
        {booking && (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="rounded-2xl border border-black/15 bg-white p-5 shadow-sm sm:p-7">
              <TaxiTripSummary booking={booking} />
              <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                This is a demo booking using sample inventory. The booking is stored in this browser session.
              </p>
              <Button
                render={<Link to={`/airport-taxi/booking/${bookingId}/payment`} />}
                nativeButton={false}
                className="mt-6 h-12 w-full rounded-full bg-[#044368] text-white hover:bg-[#033250]"
                disabled={booking.status === 'confirmed'}
              >
                {booking.status === 'confirmed' ? 'Booking already confirmed' : 'Continue to payment'}
              </Button>
              {booking.status === 'confirmed' && (
                <Link to={`/airport-taxi/booking/${bookingId}/confirmation`} className="mt-4 block text-center text-sm underline">
                  View booking confirmation
                </Link>
              )}
            </section>
            <aside className="h-fit rounded-2xl bg-sky-50 p-5">
              <p className="text-sm text-black/60">Booking reference</p>
              <p className="mt-1 break-all text-xl font-bold tracking-wide">{booking.reference}</p>
              <p className="mt-4 text-sm text-black/60">Booking status</p>
              <p className="font-semibold">{booking.status === 'confirmed' ? 'Confirmed' : 'Awaiting payment method'}</p>
            </aside>
          </div>
        )}
      </main>
    </TaxiPageShell>
  );
}
