import { useState } from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import StayPageFrame from '@/components/features/stays/StayPageFrame';
import { formatMoney, formatStayDate } from '@/components/features/stays/stayData';
import { useStayBooking, simulateStayPayment } from '@/hooks/useStays';

export default function StayPaymentPage() {
  const { bookingRef } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading: fetching } = useStayBooking(bookingRef);
  const booking = location.state?.booking || data;
  const [method, setMethod] = useState(booking?.paymentProvider || 'eSewa');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function pay(outcome) {
    setLoading(true); setError('');
    try {
      const result = await simulateStayPayment(booking, outcome, method);
      navigate(`/stays/booking/confirmed/${booking.reference}`, { state: { booking: result } });
    } catch (paymentError) { setError(paymentError.message || 'Payment could not be completed.'); }
    finally { setLoading(false); }
  }
  if (!booking && fetching) return <StayPageFrame><p role="status">Loading payment details…</p></StayPageFrame>;
  if (!booking) return <StayPageFrame><div className="rounded-2xl bg-white p-6">Booking not found. <Link to="/stays">Search stays</Link></div></StayPageFrame>;
  if (booking.status === 'confirmed') return <StayPageFrame className="mx-auto max-w-3xl"><div className="rounded-2xl bg-white p-6"><h1 className="text-2xl font-semibold">This booking is already confirmed.</h1><Link to={`/stays/booking/confirmed/${booking.reference}`} state={{ booking }} className="mt-4 inline-block underline">View confirmation</Link></div></StayPageFrame>;
  return <StayPageFrame className="mx-auto max-w-3xl"><h1 className="mb-2 text-3xl font-semibold text-[#08446E]">Payment</h1><p className="mb-6 text-zinc-600">Choose a payment method for your stay.</p><section className="space-y-5 rounded-2xl bg-white p-6 shadow-md"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold">{booking.stayName}</h2><p className="text-sm text-zinc-600">{booking.reservation.room.name}</p><p className="text-sm text-zinc-600">{formatStayDate(booking.search.checkIn)} – {formatStayDate(booking.search.checkOut)}</p></div><strong className="text-xl">{formatMoney(booking.amount, booking.currency)}</strong></div><fieldset className="space-y-3"><legend className="mb-2 font-semibold">Payment method</legend>{['eSewa', 'Khalti'].map((value) => <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${method === value ? 'border-blue-500 bg-sky-50' : 'border-zinc-200'}`}><input type="radio" name="paymentMethod" value={value} checked={method === value} onChange={() => setMethod(value)} className="accent-[#124E7B]"/><span className="font-semibold">{value}</span><span className="ml-auto text-xs text-zinc-500">Demo</span></label>)}</fieldset><div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"><strong>Demo payment only.</strong> No money is charged. Connect the payment provider before using this flow for real payments.</div>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}<div className="flex flex-col gap-3 sm:flex-row"><button type="button" disabled={loading} onClick={() => pay('success')} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 font-semibold text-white disabled:opacity-60">{loading ? <LoaderCircle className="size-4 animate-spin"/> : <Check className="size-4"/>}Simulate successful payment</button><button type="button" disabled={loading} onClick={() => pay('failure')} className="h-12 rounded-xl border px-5 font-semibold disabled:opacity-60">Simulate payment failure</button></div><Link to={`/stays/booking/${booking.reference}`} state={{ booking }} className="inline-block text-sm underline">Back to booking summary</Link></section></StayPageFrame>;
}
