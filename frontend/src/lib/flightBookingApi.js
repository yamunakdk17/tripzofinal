const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '');

export const isFlightApiConfigured = Boolean(API_BASE_URL);

function getApiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error(
      'Flight booking is unavailable: configure VITE_API_BASE_URL to connect the flight and payment services.',
    );
  }

  return `${API_BASE_URL}${path}`;
}

async function request(path, options = {}) {
  const response = await fetch(getApiUrl(path), {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || `Request failed (${response.status}). Please try again.`);
  }

  return body;
}

export async function searchFlights(search) {
  const params = new URLSearchParams({
    origin: search.from.code,
    destination: search.to.code,
    tripType: search.tripTypeCode,
    departureDate: search.departureDate,
    travelers: String(search.travellerCount),
    cabin: search.cabin,
  });

  if (search.returnDate) params.set('returnDate', search.returnDate);

  const result = await request(`/flights/search?${params}`);
  if (!Array.isArray(result?.flights)) {
    throw new Error('Flight search returned an invalid response. Expected a flights list.');
  }

  return result.flights;
}

export async function createFlightBooking(details) {
  const booking = await request('/bookings', {
    method: 'POST',
    body: JSON.stringify(details),
  });

  if (!booking?.id || !Number.isFinite(Number(booking.amount))) {
    throw new Error('Booking service returned an invalid booking or price.');
  }

  return booking;
}

export async function initiateFlightPayment(provider, details) {
  const payment = await request(`/payments/${provider}/initiate`, {
    method: 'POST',
    body: JSON.stringify(details),
  });

  if (!payment?.redirectUrl) {
    throw new Error(`${provider} did not return a payment URL.`);
  }

  const redirectUrl = new URL(payment.redirectUrl, window.location.origin);
  if (
    redirectUrl.protocol !== 'https:' &&
    !(redirectUrl.protocol === 'http:' && redirectUrl.origin === window.location.origin)
  ) {
    throw new Error(`${provider} returned an invalid payment URL.`);
  }

  return { ...payment, redirectUrl: redirectUrl.href };
}

export async function verifyFlightPayment(provider, details) {
  const result = await request(`/payments/${provider}/verify`, {
    method: 'POST',
    body: JSON.stringify(details),
  });

  if (!['paid', 'failed', 'pending'].includes(result?.status)) {
    throw new Error('Payment service returned an invalid verification status.');
  }

  return result;
}

export async function getFlightBooking(bookingId) {
  return request(`/bookings/${encodeURIComponent(bookingId)}`);
}
