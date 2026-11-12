import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import StayBookingStepper from './StayBookingStepper';
import { formatMoney, formatStayDate, getNights, toStayQuery } from './stayData';

const roomTypes = [
  { id: 'standard', name: 'Standard Double Room', multiplier: 1, description: 'Comfortable double bed and private bathroom.' },
  { id: 'deluxe', name: 'Deluxe Sea View Room', multiplier: 1.45, description: 'More space, a scenic view and breakfast included.' },
  { id: 'family', name: 'Family Room', multiplier: 1.8, description: 'Extra space and flexible bedding for families.' },
];

export default function RoomSelection({ stay, search }) {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState('standard');
  const [rooms, setRooms] = useState(search.rooms);
  const nights = getNights(search.checkIn, search.checkOut);
  const selected = roomTypes.find((room) => room.id === roomType);
  const amount = Math.round(stay.pricePerNight * selected.multiplier * rooms * nights);

  function next() {
    if (!nights) return;
    const reservation = { room: selected, rooms, nights, unitPrice: Math.round(stay.pricePerNight * selected.multiplier), total: amount };
    const staySearch = { ...search, rooms };
    navigate(`/stays/${stay.id}/guest?${toStayQuery(staySearch)}`, { state: { reservation } });
  }

  return <div className="mx-auto max-w-5xl"><StayBookingStepper current={1}/><h1 className="mb-2 text-3xl font-semibold text-[#08446E]">Select your room</h1><p className="mb-6 text-zinc-600">{stay.name} · {formatStayDate(search.checkIn)} – {formatStayDate(search.checkOut)} · {nights} nights</p><div className="grid gap-6 lg:grid-cols-[1fr_300px]"><fieldset className="space-y-3"><legend className="sr-only">Room type</legend>{roomTypes.map((room) => <label key={room.id} className={`flex cursor-pointer gap-4 rounded-2xl border bg-white p-4 shadow-sm ${roomType === room.id ? 'border-blue-500 ring-2 ring-sky-100' : 'border-zinc-200'}`}><input type="radio" name="roomType" checked={roomType === room.id} onChange={() => setRoomType(room.id)} className="mt-1 size-4 accent-[#124E7B]"/><span><strong className="block text-[#044777]">{room.name}</strong><span className="mt-1 block text-sm text-zinc-600">{room.description}</span><span className="mt-2 block font-semibold">{formatMoney(Math.round(stay.pricePerNight * room.multiplier), stay.price.currency)} per room/night</span></span></label>)}<label className="flex items-center justify-between rounded-xl bg-white p-4"><span>Rooms</span><select value={rooms} onChange={(event) => setRooms(Number(event.target.value))} className="rounded border p-2">{Array.from({ length: 10 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}</select></label></fieldset><aside className="h-fit rounded-2xl bg-white p-5 shadow-md"><h2 className="font-semibold">Your stay</h2><p className="mt-2">{stay.name}</p><p className="mt-2 text-sm">{formatStayDate(search.checkIn)} – {formatStayDate(search.checkOut)}</p><p className="mt-2 text-sm">{rooms} room(s) · {nights} nights</p><p className="mt-4 border-t pt-4 text-xl font-bold">{formatMoney(amount, stay.price.currency)}</p><button type="button" disabled={!nights} onClick={next} className="mt-4 w-full rounded-xl bg-[#124E7B] px-4 py-3 font-semibold text-white disabled:opacity-50">Continue to guest details</button>{!nights && <p role="alert" className="mt-2 text-sm text-red-700">Choose valid dates in your search.</p>}</aside></div></div>;
}
