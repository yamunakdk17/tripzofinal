import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Download, LoaderCircle, Plane, Printer } from 'lucide-react';

import Footer from '@/components/layout/footer';
import {
  createFlightBooking,
  getFlightBooking,
  initiateFlightPayment,
  isFlightApiConfigured,
  verifyFlightPayment,
} from '@/lib/flightBookingApi';

const PAYMENT_METHODS = [
  { id: 'esewa', label: 'eSewa', description: 'Pay securely with your eSewa wallet.' },
  { id: 'khalti', label: 'Khalti', description: 'Pay securely with your Khalti wallet.' },
];

function formatPrice(amount, currency = 'USD') {
  const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: safeCurrency,
  }).format(Number(amount) || 0);
}

function formatDate(value) {
  if (!value) return 'Date to be confirmed';
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function getStage(pathname) {
  if (pathname === '/flights/payment') return 'payment';
  if (pathname === '/flights/confirmation') return 'confirmation';
  return 'passengers';
}

function FlightSummary({ flight, search, amount, currency, passengerCount }) {
  const outbound = flight?.outbound;
  const inbound = flight?.inbound;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm" aria-label="Selected flight">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{flight?.airline || 'Selected flight'}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {search?.from?.city} ({search?.from?.code}) to {search?.to?.city} ({search?.to?.code})
          </p>
        </div>
        <Plane className="size-5 rotate-45 text-blue-600" aria-hidden />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Outbound</p>
          <p className="mt-1 text-sm font-semibold text-zinc-900">{outbound?.depart || '—'} <span className="font-normal text-zinc-500">to</span> {outbound?.arrive || '—'}</p>
          <p className="mt-1 text-xs text-zinc-500">{outbound?.dateLabel || formatDate(search?.departureDate)}</p>
        </div>
        {inbound && (
          <div className="rounded-xl bg-zinc-50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Return</p>
            <p className="mt-1 text-sm font-semibold text-zinc-900">{inbound.depart || '—'} <span className="font-normal text-zinc-500">to</span> {inbound.arrive || '—'}</p>
            <p className="mt-1 text-xs text-zinc-500">{inbound.dateLabel || formatDate(search?.returnDate)}</p>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm">
        <span className="text-zinc-600">{passengerCount} {passengerCount === 1 ? 'passenger' : 'passengers'}</span>
        <span className="font-semibold text-zinc-900">{formatPrice(amount, currency)}</span>
      </div>
    </section>
  );
}

function Progress({ stage }) {
  const steps = ['Passengers', 'Payment', 'Confirmation'];
  const current = stage === 'passengers' ? 0 : stage === 'payment' ? 1 : 2;

  return (
    <ol aria-label="Booking progress" className="mb-8 grid grid-cols-3">
      {steps.map((step, index) => (
        <li key={step} className="relative flex flex-col items-center text-center">
          <span className={`z-10 grid size-8 place-items-center rounded-full text-sm font-semibold ${index <= current ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-600'}`}>
            {index < current ? <Check className="size-4" aria-hidden /> : index + 1}
          </span>
          <span className={`mt-2 text-xs font-medium sm:text-sm ${index <= current ? 'text-blue-700' : 'text-zinc-500'}`}>{step}</span>
          {index < steps.length - 1 && <span aria-hidden className={`absolute left-1/2 top-4 h-0.5 w-full ${index < current ? 'bg-blue-600' : 'bg-zinc-200'}`} />}
        </li>
      ))}
    </ol>
  );
}

function PageShell({ stage, title, description, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-24 sm:px-6 md:pt-28">
        <Link to="/flights" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-blue-700">
          <ArrowLeft className="size-4" aria-hidden /> Back to flight search
        </Link>
        <div className="mx-auto max-w-3xl">
          <Progress stage={stage} />
          <header className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-[#172C43] sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>
          </header>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function MissingBooking() {
  return (
    <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
      <p className="font-semibold">Booking details are unavailable.</p>
      <p className="mt-1">Please choose a flight from the results page to continue.</p>
      <Link to="/flights" className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">Search flights</Link>
    </div>
  );
}

function PassengerStep({ search, flight }) {
  const navigate = useNavigate();
  const passengerCount = Math.max(1, Math.min(9, Number(search?.travellerCount) || 1));
  const estimate = (Number(flight?.price) || 0) * passengerCount;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const passengers = Array.from({ length: passengerCount }, (_, index) => ({
      firstName: String(formData.get(`passenger-${index}-firstName`) || '').trim(),
      lastName: String(formData.get(`passenger-${index}-lastName`) || '').trim(),
      dateOfBirth: formData.get(`passenger-${index}-dateOfBirth`),
      gender: formData.get(`passenger-${index}-gender`),
      nationality: String(formData.get(`passenger-${index}-nationality`) || '').trim(),
      identificationNumber: String(formData.get(`passenger-${index}-identificationNumber`) || '').trim(),
    }));

    if (passengers.some((passenger) => !passenger.firstName || !passenger.lastName)) {
      setError('Enter each passenger’s first and last name.');
      return;
    }

    setSubmitting(true);
    try {
      const contact = {
        email: String(formData.get('contact-email') || '').trim(),
        phone: String(formData.get('contact-phone') || '').trim(),
      };
      const created = await createFlightBooking({
        flightId: flight.id,
        search,
        passengers,
        contact,
      });
      const booking = {
        ...created,
        flight,
        search,
        passengers,
        contact,
        currency: created.currency || flight.currency || 'USD',
      };
      navigate('/flights/payment', { state: { booking } });
    } catch (submitError) {
      setError(submitError.message || 'We could not create your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell
      stage="passengers"
      title="Passenger details"
      description="Enter each traveller’s details exactly as they appear on their travel identification.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form onSubmit={handleSubmit} className="space-y-5">
          {Array.from({ length: passengerCount }, (_, index) => (
            <fieldset key={index} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <legend className="px-1 text-base font-semibold text-zinc-900">Passenger {index + 1}</legend>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-zinc-700">First name
                  <input name={`passenger-${index}-firstName`} autoComplete="given-name" required maxLength={70} className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 px-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="text-sm font-medium text-zinc-700">Last name
                  <input name={`passenger-${index}-lastName`} autoComplete="family-name" required maxLength={70} className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 px-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="text-sm font-medium text-zinc-700">Date of birth
                  <input name={`passenger-${index}-dateOfBirth`} type="date" required max={new Date().toISOString().slice(0, 10)} className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 px-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="text-sm font-medium text-zinc-700">Gender
                  <select name={`passenger-${index}-gender`} required defaultValue="" className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                    <option value="" disabled>Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="unspecified">Prefer not to say</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-zinc-700">Nationality
                  <input name={`passenger-${index}-nationality`} autoComplete="country-name" required maxLength={60} className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 px-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
                <label className="text-sm font-medium text-zinc-700">Passport / ID number <span className="font-normal text-zinc-500">(optional)</span>
                  <input name={`passenger-${index}-identificationNumber`} autoComplete="off" maxLength={40} className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 px-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </label>
              </div>
            </fieldset>
          ))}
          <fieldset className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <legend className="px-1 text-base font-semibold text-zinc-900">Booking contact</legend>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-zinc-700">Email address
                <input name="contact-email" type="email" autoComplete="email" required maxLength={254} className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 px-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
              <label className="text-sm font-medium text-zinc-700">Phone number
                <input name="contact-phone" type="tel" autoComplete="tel" required minLength={7} maxLength={24} className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 px-3 text-zinc-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              </label>
            </div>
          </fieldset>
          {!isFlightApiConfigured && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Booking creation is not enabled. Passenger details will only be submitted after Tripzo connects its booking API.
            </p>
          )}
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <button type="submit" disabled={submitting} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F76641] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#e95633] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {submitting && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
            {submitting ? 'Creating booking…' : 'Continue to payment'}
          </button>
        </form>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <FlightSummary flight={flight} search={search} amount={estimate} currency={flight.currency || 'USD'} passengerCount={passengerCount} />
          <p className="mt-3 text-xs leading-relaxed text-zinc-500">Estimated fare only. The booking service confirms the final price before payment.</p>
        </div>
      </div>
    </PageShell>
  );
}

function PaymentStep({ booking: initialBooking }) {
  const location = useLocation();
  const bookingId = new URLSearchParams(location.search).get('bookingId');
  const [booking, setBooking] = useState(initialBooking);
  const [provider, setProvider] = useState('esewa');
  const [loading, setLoading] = useState(!initialBooking && Boolean(bookingId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (booking) return;
    if (!bookingId) return;

    let active = true;
    getFlightBooking(bookingId)
      .then((record) => { if (active) setBooking(record); })
      .catch((loadError) => { if (active) setError(loadError.message || 'Unable to load this booking.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [booking, bookingId]);

  async function handlePayment(event) {
    event.preventDefault();
    if (!booking?.id) {
      setError('Booking details are missing. Return to passenger details and create the booking again.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const callbackUrl = new URL('/flights/confirmation', window.location.origin);
      callbackUrl.searchParams.set('bookingId', booking.id);
      callbackUrl.searchParams.set('provider', provider);
      const payment = await initiateFlightPayment(provider, {
        bookingId: booking.id,
        amount: booking.amount,
        currency: booking.currency || 'USD',
        returnUrl: callbackUrl.href,
      });
      window.location.assign(payment.redirectUrl);
    } catch (paymentError) {
      setError(paymentError.message || 'Could not start payment. No payment has been taken.');
      setLoading(false);
    }
  }

  if (!booking && loading) {
    return <PageShell stage="payment" title="Loading booking" description="Retrieving your booking details."><div role="status" className="rounded-2xl bg-white p-8 text-center shadow-sm"><LoaderCircle className="mx-auto size-6 animate-spin text-blue-600" aria-hidden /><p className="mt-3 text-sm text-zinc-600">Please wait…</p></div></PageShell>;
  }

  if (!booking) return <PageShell stage="payment" title="Booking unavailable" description="We couldn’t retrieve the booking for payment."><MissingBooking />{error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}</PageShell>;

  const flight = booking.flight;
  const search = booking.search || {};
  const passengerCount = booking.passengers?.length || search.travellerCount || 1;

  return (
    <PageShell stage="payment" title="Choose payment" description="Review the confirmed booking amount and continue to your selected payment provider.">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <form onSubmit={handlePayment} className="space-y-5">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-zinc-900">Payment method</h2>
            <div className="mt-4 space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label key={method.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${provider === method.id ? 'border-blue-500 bg-blue-50/50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                  <input type="radio" name="paymentProvider" value={method.id} checked={provider === method.id} onChange={() => setProvider(method.id)} className="mt-1 size-4 accent-blue-600" />
                  <span><span className="block text-sm font-semibold text-zinc-900">{method.label}</span><span className="mt-1 block text-xs text-zinc-600">{method.description}</span></span>
                </label>
              ))}
            </div>
          </section>
          {!isFlightApiConfigured && (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Payment is disabled until Tripzo connects the eSewa/Khalti server integrations. No simulated payment or confirmation is offered.
            </p>
          )}
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}
          <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#F76641] px-5 text-sm font-semibold text-white hover:bg-[#e95633] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
            {loading ? 'Connecting to payment…' : `Continue with ${PAYMENT_METHODS.find((method) => method.id === provider)?.label}`}
          </button>
        </form>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <FlightSummary flight={flight} search={search} amount={booking.amount} currency={booking.currency} passengerCount={passengerCount} />
          <p className="mt-3 text-xs leading-relaxed text-zinc-500">Payments are confirmed by the Tripzo server after the provider verifies the transaction.</p>
        </div>
      </div>
    </PageShell>
  );
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function downloadTicket(booking) {
  const flight = booking.flight || {};
  const passengers = booking.passengers || [];
  const reference = booking.pnr || booking.bookingReference || booking.reference;
  const passengerRows = passengers.map((passenger) => (
    `<tr><td>${escapeHtml(`${passenger.firstName} ${passenger.lastName}`)}</td><td>${escapeHtml(passenger.dateOfBirth)}</td></tr>`
  )).join('');
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tripzo flight ticket ${escapeHtml(reference)}</title>
<style>body{font:16px Arial,sans-serif;color:#172c43;background:#f4f6f8;margin:0;padding:24px}.ticket{max-width:760px;margin:0 auto;background:white;border:1px solid #dfe4ea;border-radius:18px;padding:32px}.brand{color:#f76641;font-size:24px;font-weight:bold}.ref{background:#eff6ff;padding:14px;border-radius:10px;font-size:20px;font-weight:bold}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.box{padding:14px;background:#f8fafc;border-radius:10px;margin-top:12px}table{width:100%;border-collapse:collapse;margin-top:12px}td,th{text-align:left;padding:10px;border-bottom:1px solid #e5e7eb}@media print{body{background:white;padding:0}.ticket{border:0}}</style></head>
<body><main class="ticket"><div class="brand">Tripzo</div><h1>Flight booking confirmation</h1><p class="ref">Booking reference / PNR: ${escapeHtml(reference)}</p>
<div class="grid"><div class="box"><strong>Airline</strong><br>${escapeHtml(flight.airline)}</div><div class="box"><strong>Booking status</strong><br>Confirmed</div>
<div class="box"><strong>Outbound</strong><br>${escapeHtml(flight.outbound?.from)} → ${escapeHtml(flight.outbound?.to)}<br>${escapeHtml(flight.outbound?.dateLabel)}<br>${escapeHtml(flight.outbound?.depart)} – ${escapeHtml(flight.outbound?.arrive)}</div>
${flight.inbound ? `<div class="box"><strong>Return</strong><br>${escapeHtml(flight.inbound.from)} → ${escapeHtml(flight.inbound.to)}<br>${escapeHtml(flight.inbound.dateLabel)}<br>${escapeHtml(flight.inbound.depart)} – ${escapeHtml(flight.inbound.arrive)}</div>` : ''}</div>
<h2>Passengers</h2><table><thead><tr><th>Name</th><th>Date of birth</th></tr></thead><tbody>${passengerRows}</tbody></table>
<p><strong>Total paid:</strong> ${escapeHtml(formatPrice(booking.amount, booking.currency))}</p><p>Keep this ticket and your travel identification available for check-in.</p></main></body></html>`;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tripzo-ticket-${String(reference).replace(/[^a-z0-9-]/gi, '-')}.html`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function ConfirmationStep() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const bookingId = params.get('bookingId');
  const provider = params.get('provider');
  const callbackDetails = useMemo(() => Object.fromEntries(params.entries()), [params]);
  const invalidReturn = !bookingId || !PAYMENT_METHODS.some((method) => method.id === provider);
  const [status, setStatus] = useState('loading');
  const [booking, setBooking] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    if (invalidReturn) return () => { active = false; };
    verifyFlightPayment(provider, callbackDetails)
      .then(async (verification) => {
        if (!active) return;
        if (verification.status === 'failed') {
          setStatus('failed');
          setMessage(verification.message || 'The payment was not completed. No ticket has been issued.');
          if (verification.booking) setBooking(verification.booking);
          return;
        }
        if (verification.status === 'pending') {
          setStatus('pending');
          setMessage(verification.message || 'Payment is still being verified. Check again in a moment.');
          return;
        }

        const confirmedBooking = verification.booking || await getFlightBooking(bookingId);
        if (!active) return;
        if (confirmedBooking.status !== 'confirmed' || !(confirmedBooking.pnr || confirmedBooking.bookingReference || confirmedBooking.reference)) {
          setStatus('pending');
          setMessage('Payment was received, but the booking is not confirmed yet. Please check again shortly.');
          return;
        }
        setBooking(confirmedBooking);
        setStatus('success');
      })
      .catch((verificationError) => {
        if (!active) return;
        setStatus('error');
        setMessage(verificationError.message || 'We couldn’t verify the payment. Do not retry the payment until you check its status.');
      });

    return () => { active = false; };
  }, [bookingId, provider, callbackDetails, invalidReturn]);

  const reference = booking?.pnr || booking?.bookingReference || booking?.reference;

  if (!invalidReturn && status === 'loading') {
    return <PageShell stage="confirmation" title="Verifying payment" description="We’re checking your payment securely with the provider.">
      <div role="status" className="rounded-2xl bg-white p-10 text-center shadow-sm"><LoaderCircle className="mx-auto size-7 animate-spin text-blue-600" aria-hidden /><p className="mt-3 text-sm text-zinc-600">Please don’t close this page.</p></div>
    </PageShell>;
  }

  if (invalidReturn || status !== 'success') {
    const currentStatus = invalidReturn ? 'error' : status;
    const currentMessage = invalidReturn
      ? 'The payment return is missing a booking reference or payment provider.'
      : message;
    const failed = currentStatus === 'failed';
    return <PageShell stage="payment" title={failed ? 'Payment not completed' : currentStatus === 'pending' ? 'Payment pending' : 'Could not verify payment'} description={currentMessage}>
      <div role={failed || currentStatus === 'error' ? 'alert' : 'status'} className={`rounded-2xl border p-6 ${failed || currentStatus === 'error' ? 'border-red-200 bg-red-50 text-red-900' : 'border-amber-200 bg-amber-50 text-amber-950'}`}>
        <p className="text-sm">{currentMessage}</p>
        {reference && <p className="mt-3 text-sm font-semibold">Booking reference: {reference}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => navigate(0)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Check payment status</button>
          {failed && <Link to={`/flights/payment?bookingId=${encodeURIComponent(bookingId)}`} state={{ booking }} className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">Try another payment method</Link>}
        </div>
      </div>
    </PageShell>;
  }

  return (
    <PageShell stage="confirmation" title="Your flight is confirmed!" description="Payment has been verified and your booking is confirmed.">
      <div className="space-y-5">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-950">
          <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-green-600 text-white"><Check className="size-5" aria-hidden /></span><div><p className="font-semibold">Booking confirmed</p><p className="mt-1 text-sm">PNR / Booking reference: <strong>{reference}</strong></p></div></div>
        </div>
        <FlightSummary flight={booking.flight} search={booking.search} amount={booking.amount} currency={booking.currency} passengerCount={booking.passengers?.length || 1} />
        {booking.passengers?.length > 0 && (
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold">Passengers</h2>
            <ul className="mt-3 space-y-2 text-sm text-zinc-700">
              {booking.passengers.map((passenger, index) => <li key={`${passenger.firstName}-${passenger.lastName}-${index}`}>{passenger.firstName} {passenger.lastName}</li>)}
            </ul>
          </section>
        )}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => downloadTicket(booking)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#F76641] px-5 text-sm font-semibold text-white hover:bg-[#e95633]"><Download className="size-4" aria-hidden />Download ticket</button>
          <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"><Printer className="size-4" aria-hidden />Print / Save PDF</button>
        </div>
      </div>
    </PageShell>
  );
}

export default function FlightBooking() {
  const location = useLocation();
  const stage = getStage(location.pathname);
  const selectedFlight = location.state?.flight;
  const search = location.state?.search;
  const booking = location.state?.booking;

  if (stage === 'confirmation') return <ConfirmationStep />;
  if (stage === 'payment') return <PaymentStep booking={booking} />;
  if (!selectedFlight || !search) {
    return <PageShell stage="passengers" title="Select a flight" description="Choose a flight before adding passenger details."><MissingBooking /></PageShell>;
  }

  return <PassengerStep search={search} flight={selectedFlight} />;
}
