export const TIME_SLOTS = [
  { id: 'before-6', label: 'Before 6AM', test: (hour) => hour < 6 },
  { id: '6-12', label: '6AM - 12PM', test: (hour) => hour >= 6 && hour < 12 },
  { id: '12-18', label: '12PM - 6PM', test: (hour) => hour >= 12 && hour < 18 },
  { id: 'after-18', label: 'After 6PM', test: (hour) => hour >= 18 },
];

export const FARE_LABEL = 'Standard, Basic';

const demoFlights = [
  {
    id: 'f1',
    airline: 'LOT Polish Airlines',
    price: 190,
    nights: 7,
    bags: { cabin: 1, checked: 0 },
    outbound: { depart: '6:00 am', arrive: '8:30 am', departHour: 6, arriveHour: 8, stops: 0, durationMinutes: 150 },
    inbound: { depart: '2:20 pm', arrive: '8:45 pm', departHour: 14, arriveHour: 20, stops: 1, durationMinutes: 385 },
  },
  {
    id: 'f2',
    airline: 'Ryanair',
    price: 159,
    nights: 5,
    bags: { cabin: 1, checked: 0 },
    outbound: { depart: '11:10 am', arrive: '8:10 pm', departHour: 11, arriveHour: 20, stops: 1, durationMinutes: 540 },
    inbound: { depart: '7:45 am', arrive: '12:05 pm', departHour: 7, arriveHour: 12, stops: 1, durationMinutes: 260 },
  },
  {
    id: 'f3',
    airline: 'Air France',
    price: 279,
    nights: 3,
    bags: { cabin: 1, checked: 1 },
    outbound: { depart: '7:30 am', arrive: '10:00 am', departHour: 7, arriveHour: 10, stops: 0, durationMinutes: 150 },
    inbound: { depart: '8:15 pm', arrive: '10:45 pm', departHour: 20, arriveHour: 22, stops: 0, durationMinutes: 150 },
  },
  {
    id: 'f4',
    airline: 'Wizz Air',
    price: 140,
    nights: 7,
    bags: { cabin: 0, checked: 0 },
    outbound: { depart: '5:30 am', arrive: '2:00 pm', departHour: 5, arriveHour: 14, stops: 2, durationMinutes: 510 },
    inbound: { depart: '6:40 pm', arrive: '11:55 pm', departHour: 18, arriveHour: 23, stops: 1, durationMinutes: 315 },
  },
  {
    id: 'f5',
    airline: 'LOT Polish Airlines',
    price: 366,
    nights: 7,
    bags: { cabin: 1, checked: 1 },
    outbound: { depart: '6:45 am', arrive: '9:05 am', departHour: 6, arriveHour: 9, stops: 0, durationMinutes: 140 },
    inbound: { depart: '6:10 pm', arrive: '8:30 pm', departHour: 18, arriveHour: 20, stops: 0, durationMinutes: 140 },
  },
  {
    id: 'f6',
    airline: 'Air France',
    price: 205,
    nights: 4,
    bags: { cabin: 1, checked: 0 },
    outbound: { depart: '1:20 pm', arrive: '5:00 pm', departHour: 13, arriveHour: 17, stops: 1, durationMinutes: 220 },
    inbound: { depart: '11:05 am', arrive: '2:30 pm', departHour: 11, arriveHour: 14, stops: 1, durationMinutes: 205 },
  },
  {
    id: 'f7',
    airline: 'LOT Polish Airlines',
    price: 233,
    nights: 6,
    bags: { cabin: 1, checked: 1 },
    outbound: { depart: '9:15 pm', arrive: '11:45 pm', departHour: 21, arriveHour: 23, stops: 0, durationMinutes: 150 },
    inbound: { depart: '6:30 am', arrive: '9:00 am', departHour: 6, arriveHour: 9, stops: 0, durationMinutes: 150 },
  },
];

function formatLegDate(value, fallback) {
  const date = value ? new Date(`${value}T12:00:00`) : fallback;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getFlightSearch(values, airports) {
  const from = airports.find((airport) => airport.code === values?.from) ?? airports[0];
  const to =
    airports.find((airport) => airport.code === values?.to) ??
    airports.find((airport) => airport.code !== from.code) ??
    airports[0];
  const departureDate = values?.departureDate;
  const returnDate = values?.returnDate;
  const tripType = values?.tripType ?? 'roundTrip';
  const travelerCount = values?.travellers ?? 1;

  return {
    tripType: tripType === 'oneWay' ? 'One-way' : tripType === 'multiCity' ? 'Multi-city' : 'Round-trip',
    from: { city: from.city, code: from.code, label: `${from.city} (${from.code})` },
    to: { city: to.city, code: to.code, label: `${to.city} (${to.code})` },
    dates: departureDate
      ? `${formatLegDate(departureDate, new Date())}${returnDate ? ` – ${formatLegDate(returnDate, new Date())}` : ''}`
      : 'Flexible dates',
    travelers: `${travelerCount} ${travelerCount === 1 ? 'Adult' : 'Adults'}${values?.cabin ? ` · ${values.cabin}` : ''}`,
    departureDate: departureDate ?? '',
    returnDate: returnDate ?? '',
  };
}

export function getFlightResults(origin, destination, departureDate, returnDate) {
  const outboundDate = formatLegDate(departureDate, new Date('2027-02-02T12:00:00'));
  const inboundDate = formatLegDate(returnDate, new Date('2027-02-09T12:00:00'));

  return demoFlights.map((flight) => ({
    ...flight,
    bags: { ...flight.bags },
    outbound: {
      ...flight.outbound,
      from: origin.code,
      to: destination.code,
      dateLabel: `${outboundDate}, Outbound`,
    },
    inbound: {
      ...flight.inbound,
      from: destination.code,
      to: origin.code,
      dateLabel: `${inboundDate}, Inbound`,
    },
  }));
}

export function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!hours) return `${minutes}m`;
  if (!minutes) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function getStopsLabel(stops) {
  if (stops === 0) return 'Direct';
  if (stops === 1) return '1 stop';
  return `${stops} stops`;
}

function getStopCategory(stops) {
  if (stops === 0) return 'direct';
  if (stops === 1) return 'one';
  return 'twoPlus';
}

export function getTotalDuration(flight) {
  return flight.outbound.durationMinutes + flight.inbound.durationMinutes;
}

export function getFilterBounds(flights) {
  const maxPrice = Math.max(...flights.map((flight) => flight.price));
  const maxDuration = Math.max(...flights.map(getTotalDuration));

  return { maxPrice: Math.ceil(maxPrice / 10) * 10, maxDuration };
}

export function getFilterOptions(flights) {
  return {
    airlines: [...new Set(flights.map((flight) => flight.airline))].sort(),
    airports: [...new Set(flights.map((flight) => flight.outbound.to))].sort(),
  };
}

export function createDefaultFilters(bounds) {
  return {
    cabinBags: 0,
    checkedBags: 0,
    stops: { direct: true, one: true, twoPlus: true },
    timeMode: 'takeoff',
    times: {
      takeoff: { outbound: [], inbound: [] },
      landing: { outbound: [], inbound: [] },
    },
    price: [0, bounds.maxPrice],
    maxDuration: bounds.maxDuration,
    airlines: [],
    airports: [],
  };
}

export function applyFilters(flights, filters) {
  return flights.filter((flight) => {
    const { outbound, inbound } = flight;

    if (flight.bags.cabin < filters.cabinBags || flight.bags.checked < filters.checkedBags) return false;
    if (!filters.stops[getStopCategory(outbound.stops)] || !filters.stops[getStopCategory(inbound.stops)]) return false;
    if (flight.price < filters.price[0] || flight.price > filters.price[1]) return false;
    if (getTotalDuration(flight) > filters.maxDuration) return false;
    if (filters.airlines.length && !filters.airlines.includes(flight.airline)) return false;
    if (filters.airports.length && !filters.airports.includes(outbound.to)) return false;

    const modes = [
      { mode: 'takeoff', hourKey: 'departHour' },
      { mode: 'landing', hourKey: 'arriveHour' },
    ];

    for (const { mode, hourKey } of modes) {
      for (const leg of ['outbound', 'inbound']) {
        const selected = filters.times[mode][leg];
        if (!selected.length) continue;
        const hour = flight[leg][hourKey];
        if (!TIME_SLOTS.some((slot) => selected.includes(slot.id) && slot.test(hour))) return false;
      }
    }

    return true;
  });
}

function getBestScore(flight) {
  return flight.price + getTotalDuration(flight) * 0.4;
}

const SORTERS = {
  best: (a, b) => getBestScore(a) - getBestScore(b),
  cheapest: (a, b) => a.price - b.price,
  fastest: (a, b) => getTotalDuration(a) - getTotalDuration(b),
};

export function sortFlights(flights, mode = 'best') {
  return [...flights].sort(SORTERS[mode] ?? SORTERS.best);
}

export function getTabSummary(flights, mode) {
  const [top] = sortFlights(flights, mode);
  return top ? { price: top.price, duration: getTotalDuration(top) } : null;
}
