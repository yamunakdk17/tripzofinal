import { airportRoutes, paymentMethods, taxis } from '@/components/features/taxis/taxiData';
import { getLocationLabel, getTripLocations } from '@/components/features/taxis/taxiUtils';

const STORAGE_KEY = 'tripzo.taxiBookings';
const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

function readBookings() {
  let raw;
  try {
    raw = window.sessionStorage.getItem(STORAGE_KEY);
  } catch (error) {
    throw new Error('Taxi demo bookings are unavailable because session storage could not be read.', {
      cause: error,
    });
  }

  if (!raw) return {};
  try {
    const bookings = JSON.parse(raw);
    if (!bookings || typeof bookings !== 'object' || Array.isArray(bookings)) {
      throw new Error('Stored taxi bookings must be an object.');
    }
    return bookings;
  } catch (error) {
    throw new Error('Stored taxi booking data is invalid. Clear this tab’s site data and try again.', {
      cause: error,
    });
  }
}

function saveBookings(bookings) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    throw new Error('Taxi demo booking could not be saved in this browser.', { cause: error });
  }
}

export async function searchTaxis(params, filters, limit = 3) {
  await wait();
  const matches = taxis.filter((taxi) => {
    if (taxi.seats < params.passengers) return false;
    if (filters.categories.length && !filters.categories.includes(taxi.category)) return false;
    if (filters.fuels.length && !filters.fuels.includes(taxi.fuel)) return false;
    if (
      filters.deposits.length &&
      !filters.deposits.some((range) => {
        const [min, max] = range.split('-').map(Number);
        return taxi.deposit >= min && taxi.deposit <= max;
      })
    ) {
      return false;
    }
    return true;
  });

  return {
    locationLabel:
      params.tripType === 'airport'
        ? 'Airport transfer'
        : params.pickup.split(/[ ,]/)[0] || 'Your area',
    total: matches.length,
    items: matches.slice(0, limit),
    hasMore: matches.length > limit,
  };
}

export async function getTaxiById(id) {
  await wait();
  const taxi = taxis.find((item) => item.id === id);
  if (!taxi) throw new Error('Vehicle not found.');
  return taxi;
}

export async function createBooking({ taxiId, search, passenger }) {
  await wait(300);
  const taxi = taxis.find((item) => item.id === taxiId);
  if (!taxi) throw new Error('Vehicle not found.');
  if (taxi.seats < search.passengers) {
    throw new Error('This vehicle does not have enough seats for the selected passengers.');
  }

  const route = airportRoutes.find((item) => item.id === search.route);
  if (search.tripType === 'airport' && !route) throw new Error('Select a valid airport route.');

  const locations = getTripLocations(search);
  const extraFee = search.tripType === 'airport' ? route.extraFee : 0;
  const id = `bk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const booking = {
    id,
    reference: `TZ-${Date.now().toString(36).toUpperCase()}`,
    status: 'pending_payment',
    taxi,
    trip: {
      ...search,
      ...locations,
      locationLabel: getLocationLabel(search),
    },
    passenger,
    pricing: { baseFare: taxi.price, extraFee, total: taxi.price + extraFee, currency: 'NPR' },
    payment: null,
    createdAt: new Date().toISOString(),
  };

  const bookings = readBookings();
  saveBookings({ ...bookings, [booking.id]: booking });
  return booking;
}

export async function getBooking(id) {
  await wait(150);
  const booking = readBookings()[id];
  if (!booking) throw new Error('Booking not found.');
  return booking;
}

export async function payBooking(id, { method }) {
  await wait(300);
  const methodInfo = paymentMethods.find((item) => item.id === method);
  if (!methodInfo) throw new Error('Choose a valid payment method.');
  if (!methodInfo.enabled) {
    throw new Error(`${methodInfo.label} payments are unavailable until a Taxi payment backend is configured.`);
  }

  const bookings = readBookings();
  const booking = bookings[id];
  if (!booking) throw new Error('Booking not found.');
  if (booking.status === 'confirmed') return booking;
  if (booking.status !== 'pending_payment') throw new Error('This booking cannot be paid in its current state.');
  if (method !== 'cash') throw new Error('This payment method is not configured.');

  const updated = {
    ...booking,
    status: 'confirmed',
    payment: {
      method,
      status: 'pay_on_pickup',
      transactionId: null,
      paidAt: null,
    },
  };
  saveBookings({ ...bookings, [id]: updated });
  return updated;
}
