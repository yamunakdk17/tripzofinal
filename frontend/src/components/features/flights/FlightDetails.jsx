import { Plane, Clock, CalendarDays  } from 'lucide-react';

export default function FlightDetails({ flight, onContinue }) {
  if (!flight) return null;

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Flight Details</h2>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          Selected Flight
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">Departure</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">
            {flight.departureTime}
          </h3>
          <p className="font-semibold">{flight.from}</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-slate-500">{flight.duration}</p>
          <div className="my-2 flex w-full items-center gap-2">
            <div className="h-px flex-1 bg-slate-300" />
            <Plane className="text-blue-600" size={20} />
            <div className="h-px flex-1 bg-slate-300" />
          </div>
          <p className="text-xs text-slate-500">{flight.stops || 'Direct flight'}</p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-sm text-slate-500">Arrival</p>
          <h3 className="mt-1 text-2xl font-bold text-slate-900">{flight.arrivalTime}</h3>
          <p className="font-semibold">{flight.to}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays size={18} />
          {flight.date}
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Clock size={18} />
          {flight.duration}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <div>
          <p className="text-sm text-slate-500">Total Fare</p>
          <h3 className="text-2xl font-bold text-blue-700">
            NPR {Number(flight.price || 0).toLocaleString()}
          </h3>
        </div>

        <button
          onClick={onContinue}
          className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800">
          Continue Booking
        </button>
      </div>
    </section>
  );
}
