import { emptyStayFilters, stayOffers, stays } from '@/components/features/stays/stayData';

function wait(milliseconds = 180) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const BOOKINGS_KEY = 'tripzo.stayBookings';

function readBookings() {
  try {
    return JSON.parse(window.localStorage.getItem(BOOKINGS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveBooking(booking) {
  const bookings = readBookings();
  bookings[booking.reference] = booking;
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  return booking;
}

export async function getStayBooking(reference) {
  await wait();
  const booking = readBookings()[reference];
  if (!booking) throw new Error('Booking not found');
  return booking;
}

export async function getStayOffers() {
  await wait();
  return stayOffers;
}

export async function searchStays(params, filters = emptyStayFilters, sortBy = 'recommended') {
  await wait();
  const destination = params.destination.trim().toLowerCase();
  const matches = stays.filter((stay) => {
    if (
      destination &&
      !`${stay.city} ${stay.area} ${stay.name}`.toLowerCase().includes(destination.split(/[,\s]+/)[0])
    ) return false;
    if (filters.propertyTypes.length && !filters.propertyTypes.includes(stay.propertyType)) return false;
    if (
      filters.priceRanges.length &&
      !filters.priceRanges.some((range) => {
        const [minimum, maximum] = range.split('-').map(Number);
        return stay.pricePerNight >= minimum && stay.pricePerNight <= maximum;
      })
    ) return false;
    if (filters.facilities.length && !filters.facilities.every((facility) => stay.facilities.includes(facility))) return false;
    if (filters.distances.includes('under-5') && stay.distanceFromCenterKm >= 5) return false;
    return true;
  });

  const sorters = {
    recommended: (first, second) => second.rating - first.rating || first.pricePerNight - second.pricePerNight,
    priceLow: (first, second) => first.pricePerNight - second.pricePerNight,
    priceHigh: (first, second) => second.pricePerNight - first.pricePerNight,
    rating: (first, second) => second.rating - first.rating,
  };
  matches.sort(sorters[sortBy] || sorters.recommended);
  return {
    locationLabel: params.destination || 'All destinations',
    total: matches.length,
    items: matches,
  };
}

export async function getStayById(id) {
  await wait();
  const stay = stays.find((item) => item.id === id);
  if (!stay) throw new Error('Stay not found');
  return stay;
}

export async function createStayBooking(payload) {
  await wait(400);
  const reference = `TZ-${Date.now().toString(36).toUpperCase()}`;
  return saveBooking({
    id: reference,
    reference,
    status: 'pending',
    createdAt: new Date().toISOString(),
    ...payload,
  });
}

export async function simulateStayPayment(booking, outcome, provider) {
  await wait(700);
  if (!booking?.reference) throw new Error('Booking information is missing.');
  if (!['success', 'failure'].includes(outcome)) throw new Error('Choose a valid demo payment result.');

  if (outcome === 'failure') {
    return saveBooking({
      ...booking,
      status: 'payment_failed',
      paymentProvider: provider,
      paymentMessage: 'Demo payment failed. No payment was taken.',
    });
  }

  return saveBooking({
    ...booking,
    status: 'confirmed',
    paymentProvider: provider,
    paidAt: new Date().toISOString(),
    paymentMessage: 'Demo payment completed successfully.',
  });
}
