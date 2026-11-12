import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StayBookingStepper from './StayBookingStepper';
import { countries, formatMoney, formatStayDate } from './stayData';
import { createStayBooking } from '@/hooks/useStays';

export default function StayGuestDetails({ stay, search, reservation }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    const country = countries.find((item) => item.value === form.get('country')) || countries[0];
    const guest = { firstName: String(form.get('firstName')).trim(), lastName: String(form.get('lastName')).trim(), email: String(form.get('email')).trim(), phone: `${country.dial} ${String(form.get('phone')).trim()}`, country: country.label, requests: String(form.get('requests') || '').trim() };
    try {
      const booking = await createStayBooking({ stayId: stay.id, stayName: stay.name, stayArea: stay.area, search, reservation, guest, amount: reservation.total, currency: stay.price.currency });
      navigate(`/stays/booking/${booking.reference}`, { state: { booking } });
    } catch (submitError) { setError(submitError.message || 'Could not create your booking. Please try again.'); }
    finally { setLoading(false); }
  }
  return <div className="mx-auto max-w-5xl"><StayBookingStepper current={2}/><h1 className="mb-2 text-3xl font-semibold text-[#08446E]">Guest details</h1><p className="mb-6 text-zinc-600">Who will be checking in?</p><div className="grid gap-6 lg:grid-cols-[1fr_320px]"><form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-6 shadow-md"><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">First name<input name="firstName" required maxLength="70" autoComplete="given-name" className="mt-1 block h-11 w-full rounded-lg border px-3"/></label><label className="text-sm font-medium">Last name<input name="lastName" required maxLength="70" autoComplete="family-name" className="mt-1 block h-11 w-full rounded-lg border px-3"/></label><label className="text-sm font-medium">Email<input name="email" type="email" required maxLength="254" autoComplete="email" className="mt-1 block h-11 w-full rounded-lg border px-3"/></label><label className="text-sm font-medium">Country<select name="country" defaultValue="LK" className="mt-1 block h-11 w-full rounded-lg border bg-white px-3">{countries.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className="text-sm font-medium sm:col-span-2">Phone<input name="phone" type="tel" required minLength="6" maxLength="24" autoComplete="tel-national" className="mt-1 block h-11 w-full rounded-lg border px-3"/></label><label className="text-sm font-medium sm:col-span-2">Special requests (optional)<textarea name="requests" maxLength="500" rows="3" className="mt-1 block w-full rounded-lg border p-3"/></label></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}<button type="submit" disabled={loading} className="rounded-xl bg-[#124E7B] px-6 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Creating booking…' : 'Review booking'}</button></form><aside className="h-fit rounded-2xl bg-white p-5 shadow-md"><h2 className="font-semibold">{stay.name}</h2><p className="mt-2 text-sm">{reservation.room.name}</p><p className="mt-2 text-sm">{formatStayDate(search.checkIn)} – {formatStayDate(search.checkOut)}</p><p className="mt-2 text-sm">{reservation.rooms} room(s) · {reservation.nights} nights</p><p className="mt-4 border-t pt-4 text-xl font-bold">{formatMoney(reservation.total, stay.price.currency)}</p></aside></div></div>;
}
