export const tripTypes = [
  { value: 'oneWay', label: 'One Way' },
  { value: 'roundTrip', label: 'Round Trip' },
  { value: 'multiCity', label: 'Multi City' },
];

export const airports = [
  { code: 'DAC', city: 'Dhaka', name: 'Hazrat Shahjalal Intl.' },
  { code: 'CXB', city: "Cox's Bazar", name: "Cox's Bazar Airport" },
  { code: 'CGP', city: 'Chattogram', name: 'Shah Amanat Intl.' },
  { code: 'ZYL', city: 'Sylhet', name: 'Osmani Intl.' },
  { code: 'KTM', city: 'Kathmandu', name: 'Tribhuvan Intl.' },
  { code: 'PKR', city: 'Pokhara', name: 'Pokhara Regional' },
];

export const cabinOptions = ['Economy', 'Premium Economy', 'Business', 'First'];

export const maxTravellers = 9;

function pad(value) {
  return String(value).padStart(2, '0');
}

function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function daysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export const flightSearchDefaults = {
  tripType: 'roundTrip',
  from: 'DAC',
  to: 'CXB',
  departureDate: daysFromToday(7),
  returnDate: daysFromToday(10),
  travellers: 2,
  cabin: 'Economy',
};
