import { motion } from 'framer-motion';
import { Banknote, Loader2, Smartphone, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import TaxiPageShell from '@/components/features/taxis/TaxiPageShell';
import TaxiTripSummary from '@/components/features/taxis/TaxiTripSummary';
import { paymentMethods } from '@/components/features/taxis/taxiData';
import { Button } from '@/components/ui/button';
import { payBooking, useBooking } from '@/hooks/useTaxis';
import { cn } from '@/lib/utils';

const methodIcons = { esewa: Wallet, khalti: Smartphone, cash: Banknote };
const methodTones = {
  esewa: 'text-[#4a9a35]',
  khalti: 'text-[#5C2D91]',
  cash: 'text-[#124E7B]',
};

export default function TaxiPaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [method, setMethod] = useState('cash');
  const [paying, setPaying] = useState(false);
  const [failure, setFailure] = useState('');
  const [retryKey, setRetryKey] = useState(0);
  const { data: booking, loading, error } = useBooking(bookingId, retryKey);

  useEffect(() => {
    if (booking?.status === 'confirmed') {
      navigate(`/airport-taxi/booking/${bookingId}/confirmation`, { replace: true });
    }
  }, [booking, bookingId, navigate]);

  async function handlePay() {
    setPaying(true);
    setFailure('');
    try {
      await payBooking(bookingId, { method });
      navigate(`/airport-taxi/booking/${bookingId}/confirmation`);
    } catch (paymentError) {
      setFailure(paymentError.message || 'Payment could not be completed. Please try again.');
    } finally {
      setPaying(false);
    }
  }

  const selected = paymentMethods.find((item) => item.id === method);

  return (
    <TaxiPageShell>
      <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-24 sm:px-8">
        <h1 className="mb-6 text-2xl font-semibold sm:text-3xl xl:text-4xl">Booking summary and payment</h1>

        {loading && <p role="status" className="py-8">Loading booking…</p>}
        {error && (
          <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">
            <p>We couldn’t load this booking: {error.message}</p>
            <Button type="button" variant="outline" className="mt-3" onClick={() => setRetryKey((key) => key + 1)}>
              Try again
            </Button>
          </div>
        )}

        {booking && (
          <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,430px)]">
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[20px] border border-black/20 bg-white p-5 shadow-md sm:p-8"
            >
              <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Choose a payment method</h2>
              <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                Online wallet payments are unavailable because no Taxi payment backend was provided. Cash payment on pick-up is available in this demo.
              </p>

              <div role="radiogroup" aria-label="Payment method" className="space-y-3">
                {paymentMethods.map((item) => {
                  const Icon = methodIcons[item.id];
                  return (
                    <label key={item.id} className={cn('block', item.enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60')}>
                      <input
                        type="radio"
                        name="payment-method"
                        value={item.id}
                        checked={method === item.id}
                        onChange={() => item.enabled && setMethod(item.id)}
                        disabled={!item.enabled || paying}
                        className="peer sr-only"
                      />
                      <span className="flex items-center gap-4 rounded-2xl border-2 border-black/15 p-4 transition peer-checked:border-[#0762B5] peer-checked:bg-sky-50 peer-focus-visible:ring-2 peer-focus-visible:ring-[#0762B5]">
                        <Icon className={cn('size-8 shrink-0', methodTones[item.id])} aria-hidden="true" />
                        <span>
                          <span className="block text-lg font-semibold">{item.label}{!item.enabled ? ' (unavailable)' : ''}</span>
                          <span className="block text-sm text-black/70 sm:text-base">{item.description}</span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {failure && (
                <p role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 sm:text-base">
                  {failure} You can retry or choose another method.
                </p>
              )}

              <Button
                type="button"
                onClick={handlePay}
                disabled={paying || booking.status === 'confirmed' || !selected?.enabled}
                className="mt-6 h-14 w-full rounded-full bg-[#044368] text-base font-bold text-white shadow-md hover:bg-[#033250] sm:text-lg xl:text-xl"
              >
                {paying ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" aria-hidden="true" />
                    Confirming booking…
                  </>
                ) : booking.status === 'confirmed' ? 'Booking confirmed' : 'Confirm booking (pay driver)'}
              </Button>
              <Link to={`/airport-taxi/booking/${bookingId}`} className="mt-4 block text-center text-sm text-[#124E7B] underline">
                Back to booking summary
              </Link>
            </motion.section>

            <aside className="h-fit rounded-[20px] border border-black/20 bg-white p-5 shadow-md sm:p-6">
              <TaxiTripSummary booking={booking} />
            </aside>
          </div>
        )}
      </main>
    </TaxiPageShell>
  );
}
