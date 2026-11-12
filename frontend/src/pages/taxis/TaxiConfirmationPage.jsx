import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Phone } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { formatMoney } from '@/components/features/stays/stayData';
import TaxiPageShell from '@/components/features/taxis/TaxiPageShell';
import TaxiTripSummary from '@/components/features/taxis/TaxiTripSummary';
import { paymentMethods } from '@/components/features/taxis/taxiData';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/hooks/useTaxis';

export default function TaxiConfirmationPage() {
  const { bookingId } = useParams();
  const { data: booking, loading, error } = useBooking(bookingId);
  const confirmed = booking?.status === 'confirmed';
  const methodLabel = paymentMethods.find((method) => method.id === booking?.payment?.method)?.label;

  return (
    <TaxiPageShell>
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-8">
        {loading && <p role="status" className="flex items-center gap-2 py-8"><Loader2 className="size-4 animate-spin" /> Loading confirmation…</p>}
        {error && (
          <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">
            <p>We couldn’t find this booking: {error.message}</p>
            <Link to="/airport-taxi" className="mt-3 inline-block underline">Start a new search</Link>
          </div>
        )}

        {booking && !confirmed && (
          <p className="rounded-xl bg-amber-50 p-4">
            This booking is awaiting payment confirmation.{' '}
            <Link to={`/airport-taxi/booking/${bookingId}/payment`} className="font-semibold underline">Continue to payment</Link>
          </p>
        )}

        {confirmed && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-[24px] bg-white shadow-lg"
          >
            <div className="bg-gradient-to-b from-[#82C0EE]/90 to-[#ACD1EC]/90 p-6 text-center sm:p-8">
              <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
                <CheckCircle2 className="mx-auto size-14 text-emerald-700 sm:size-16" aria-hidden="true" />
              </motion.div>
              <h1 className="mt-3 text-2xl font-semibold text-[#08446E] sm:text-3xl xl:text-4xl">Booking confirmed</h1>
              <p className="mt-1 text-sm sm:text-base">
                {booking.payment.status === 'paid' ? `Payment received via ${methodLabel}.` : 'Pay your driver directly at pick-up.'}
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-black/60">Booking reference</p>
              <p className="break-all text-3xl font-bold tracking-widest sm:text-4xl">{booking.reference}</p>
              <p className="mt-3 text-sm font-medium">Booking status: {booking.status}</p>
            </div>

            <div className="space-y-6 border-t-2 border-dashed border-black/20 p-5 sm:p-8">
              <TaxiTripSummary booking={booking} />

              <div className="rounded-2xl bg-sky-50 p-4 text-sm sm:text-base">
                <p className="font-semibold">Your driver: {booking.taxi.driver.name}</p>
                <p className="text-black/70">Reg No: {booking.taxi.driver.regNo}</p>
                <ul className="mt-2 space-y-1">
                  {booking.taxi.driver.phones.map((phone) => (
                    <li key={phone} className="flex items-center gap-2">
                      <Phone className="size-4 opacity-60" aria-hidden="true" />
                      <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="underline">{phone}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <dl className="space-y-1 text-sm sm:text-base">
                <div className="flex justify-between"><dt className="text-black/60">Payment method</dt><dd className="font-medium">{methodLabel}</dd></div>
                <div className="flex justify-between"><dt className="text-black/60">Payment status</dt><dd className="font-medium">{booking.payment.status === 'paid' ? 'Paid' : 'Pay on pick-up'}</dd></div>
                {booking.payment.transactionId && (
                  <div className="flex justify-between"><dt className="text-black/60">Transaction ID</dt><dd className="font-medium">{booking.payment.transactionId}</dd></div>
                )}
                <div className="flex justify-between text-lg font-semibold">
                  <dt>Total</dt><dd>{formatMoney(booking.pricing.total, booking.pricing.currency)}</dd>
                </div>
              </dl>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="outline" onClick={() => window.print()} className="h-12 flex-1 rounded-full">
                  Print ticket
                </Button>
                <Button render={<Link to="/airport-taxi" />} nativeButton={false} className="h-12 flex-1 rounded-full bg-[#044368] text-white hover:bg-[#033250]">
                  Back to Taxis
                </Button>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </TaxiPageShell>
  );
}
