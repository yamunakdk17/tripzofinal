import { airportRoutes, taxiSearchDefaults } from './taxiData';

function validDateTime(value, fallback) {
  return value && !Number.isNaN(new Date(value).getTime()) ? value : fallback;
}

export function readTaxiParams(searchParams) {
  const parsedPassengers = Number(searchParams.get('passengers'));
  const tripType = searchParams.get('tripType') === 'airport' ? 'airport' : 'city';

  return {
    tripType,
    pickup: searchParams.get('pickup') ?? (tripType === 'city' ? taxiSearchDefaults.pickup : ''),
    dropoff: searchParams.get('dropoff') ?? (tripType === 'city' ? taxiSearchDefaults.dropoff : ''),
    route: searchParams.get('route') ?? '',
    pickupAt: validDateTime(searchParams.get('pickupAt'), taxiSearchDefaults.pickupAt),
    dropoffAt: validDateTime(searchParams.get('dropoffAt'), taxiSearchDefaults.dropoffAt),
    passengers:
      Number.isInteger(parsedPassengers) && parsedPassengers >= 1 && parsedPassengers <= 6
        ? parsedPassengers
        : taxiSearchDefaults.passengers,
  };
}

export function toTaxiQuery(values) {
  const query = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value));
  });
  return query.toString();
}

export function getTripLocations(params) {
  if (params.tripType === 'airport') {
    const [routePickup, routeDropoff] = (airportRoutes.find((route) => route.id === params.route)?.label ?? '')
      .split('→')
      .map((place) => place.trim());

    return {
      pickup: params.pickup?.trim() || routePickup || 'Airport pickup',
      dropoff: params.dropoff?.trim() || routeDropoff || 'Airport transfer',
    };
  }

  return {
    pickup: params.pickup?.trim() || '',
    dropoff: params.dropoff?.trim() || '',
  };
}

export function getLocationLabel(params) {
  if (params.tripType === 'airport') {
    return airportRoutes.find((route) => route.id === params.route)?.label ?? 'Airport transfer';
  }
  return params.pickup || 'Your area';
}

export function formatTripDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const day = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${day} - ${time}`;
}

export function getTaxiSpecs(taxi) {
  return [
    `${taxi.seats} Seats`,
    taxi.transmission,
    taxi.largeBags > 0 && `${taxi.largeBags} Large bag`,
    taxi.smallBags > 0 && `${taxi.smallBags} Small bag`,
    `${taxi.mileageLimit} miles per rental`,
  ].filter(Boolean);
}
