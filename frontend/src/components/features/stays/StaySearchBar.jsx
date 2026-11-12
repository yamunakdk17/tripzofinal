import { useState } from 'react';
import { BedDouble, CalendarDays, MapPin, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { emptyStaySearch, toStayQuery } from './stayData';

export default function StaySearchBar({ defaultValues = emptyStaySearch, compact = false, onSearch }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm({ defaultValues });

  function submit(values) {
    const normalized = { ...values, destination: values.destination.trim(), rooms: Number(values.rooms) || 1 };
    if (!normalized.destination) return setError('Enter a destination.');
    if (!normalized.checkIn || !normalized.checkOut || normalized.checkOut <= normalized.checkIn) {
      return setError('Choose valid check-in and check-out dates.');
    }
    setError('');
    if (onSearch) onSearch(normalized);
    else navigate(`/stays/search?${toStayQuery(normalized)}`);
  }

  return (
    <form onSubmit={handleSubmit(submit)} className={`grid gap-3 rounded-3xl bg-white/90 p-4 shadow-lg sm:grid-cols-2 ${compact ? 'lg:grid-cols-[2fr_1fr_1fr_150px_auto]' : 'lg:grid-cols-[2fr_1fr_1fr_150px_auto]'}`}>
      <label className="flex items-center gap-2 rounded-full bg-[#EADBC8]/80 px-4 py-3"><MapPin className="size-5 shrink-0" /><span className="sr-only">Destination</span><input {...register('destination')} placeholder="Where are you going?" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
      <label className="flex items-center gap-2 rounded-full bg-[#EADBC8]/80 px-4 py-3"><CalendarDays className="size-5 shrink-0" /><span className="sr-only">Check-in</span><input {...register('checkIn')} type="date" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
      <label className="flex items-center gap-2 rounded-full bg-[#EADBC8]/80 px-4 py-3"><CalendarDays className="size-5 shrink-0" /><span className="sr-only">Check-out</span><input {...register('checkOut')} type="date" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
      <label className="flex items-center gap-2 rounded-full bg-[#EADBC8]/80 px-4 py-3"><BedDouble className="size-5 shrink-0" /><span className="sr-only">Rooms</span><select {...register('rooms')} className="flex-1 bg-transparent text-sm outline-none">{Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} {i ? 'Rooms' : 'Room'}</option>)}</select></label>
      <Button type="submit" className="rounded-full bg-[#124E7B] px-5 text-white"><Search className="mr-2 size-4" />Search</Button>
      {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2 lg:col-span-5">{error}</p>}
    </form>
  );
}
