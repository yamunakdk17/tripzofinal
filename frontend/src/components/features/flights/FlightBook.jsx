import { useState } from 'react';
import { User, Mail, Phone, ArrowLeft } from 'lucide-react';

export default function FlightBook({ flight, onBack, onSubmit }) {
  const [passenger, setPassenger] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setPassenger({
      ...passenger,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !passenger.fullName.trim() ||
      !passenger.email.trim() ||
      !passenger.phone.trim()
    ) {
      setError('Please fill in all passenger details.');
      return;
    }

    setError('');
    onSubmit?.({
      flight,
      passenger,
    });
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700">
        <ArrowLeft size={18} />
        Back to Flight Details
      </button>

      <h2 className="text-2xl font-bold text-slate-900">Passenger Details</h2>

      <p className="mb-6 mt-2 text-sm text-slate-500">
        Enter the passenger information for your booking.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold">Full Name</label>
          <div className="flex items-center rounded-xl border border-slate-200 px-4">
            <User size={18} className="text-slate-400" />
            <input
              type="text"
              name="fullName"
              value={passenger.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full p-3 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Email Address</label>
          <div className="flex items-center rounded-xl border border-slate-200 px-4">
            <Mail size={18} className="text-slate-400" />
            <input
              type="email"
              name="email"
              value={passenger.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full p-3 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">Phone Number</label>
          <div className="flex items-center rounded-xl border border-slate-200 px-4">
            <Phone size={18} className="text-slate-400" />
            <input
              type="tel"
              name="phone"
              value={passenger.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full p-3 outline-none"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between border-t pt-5">
          <div>
            <p className="text-sm text-slate-500">Total Fare</p>
            <p className="text-xl font-bold text-blue-700">
              NPR {Number(flight?.price || 0).toLocaleString()}
            </p>
          </div>

          <button
            type="submit"
            className="rounded-xl bg-blue-700 px-7 py-3 font-semibold text-white hover:bg-blue-800">
            Continue
          </button>
        </div>
      </form>
    </section>
  );
}
