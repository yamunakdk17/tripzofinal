import { CheckCircle2 } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

import StayPageFrame from '@/components/features/stays/StayPageFrame';
import { formatMoney, formatStayDate } from '@/components/features/stays/stayData';
import { useStayBooking } from '@/hooks/useStays';

export default function StayConfirmationPage() {
  const { bookingRef } = useParams();
  const location = useLocation();
  const { data, loading, error } = useStayBooking(bookingRef);
  const booking = location.state?.booking || data;
  if (!booking && loading) return <StayPageFrame><p role="status">Loading confirmation…</p></StayPageFrame>;
  if (!booking || error) return <StayPageFrame><div role="alert" className="rounded-2xl bg-white p-6">Booking not found. <Link to="/stays">Back to stays</Link></div></StayPageFrame>;
  const confirmed = booking.status === 'confirmed';
  return <StayPageFrame className="mx-auto max-w-3xl"><section className="rounded-2xl bg-white p-6 text-center shadow-md sm:p-8">{confirmed ? <CheckCircle2 className="mx-auto size-16 text-emerald-600"/> : <span className="mx-auto grid size-16 place-items-center rounded-full bg-red-100 text-3xl font-bold text-red-700">!</span>}<h1 className={`mt-4 text-3xl font-semibold ${confirmed ? 'text-[#08446E]' : 'text-red-800'}`}>{confirmed ? 'Booking confirmed' : 'Payment not completed'}</h1><p className="mt-3 text-sm leading-7">Reference <strong>{booking.reference}</strong><br/>{booking.stayName}, {booking.stayArea}<br/>{formatStayDate(booking.search.checkIn)} – {formatStayDate(booking.search.checkOut)}<br/>{confirmed ? `Confirmation details for ${booking.guest.email}` : booking.paymentMessage}</p>{confirmed && <><dl className="mt-6 grid gap-4 rounded-xl bg-sky-50 p-4 text-left sm:grid-cols-2"><div><dt className="text-xs uppercase text-zinc-500">Room</dt><dd>{booking.reservation.room.name} · {booking.reservation.rooms} room(s)</dd></div><div><dt className="text-xs uppercase text-zinc-500">Guest</dt><dd>{booking.guest.firstName} {booking.guest.lastName}</dd></div><div><dt className="text-xs uppercase text-zinc-500">Phone</dt><dd>{booking.guest.phone}</dd></div><div><dt className="text-xs uppercase text-zinc-500">Booking status</dt><dd>{booking.status}</dd></div><div><dt className="text-xs uppercase text-zinc-500">Payment method</dt><dd>{booking.paymentProvider}</dd></div></dl><p className="mt-4 text-lg font-bold">{formatMoney(booking.amount, booking.currency)} paid with {booking.paymentProvider}</p><p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-sm">This is a demo booking and simulated payment, not a real reservation or charge.</p></>}{!confirmed && <Link to={`/stays/payment/${booking.reference}`} state={{ booking: { ...booking, status: 'pending' } }} className="mt-5 inline-block rounded-xl bg-[#124E7B] px-5 py-3 font-semibold text-white">Try payment again</Link>}<Link to="/stays" className="mt-6 inline-block rounded-xl bg-[#044368] px-8 py-3 font-bold text-white">Back to stays</Link></section></StayPageFrame>;
}
