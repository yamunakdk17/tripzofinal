export const taxiAssets = {
  hero: 'https://picsum.photos/seed/taxi-hero/1800/1000',
  road: 'https://picsum.photos/seed/road-mountains/1800/400',
};

export const taxiHero = {
  title: 'Smooth Travels',
  highlight: 'Start Here',
  description:
    'Rent your perfect car and enjoy a smooth ride to your destination. Choose from our wide selection of vehicles.',
  ctaLine: 'Need a Ride for Your Weekend Trip?',
  ctaAction: 'Hire Us!',
};

export const emptyTaxiSearch = {
  tripType: 'city',
  pickup: '',
  dropoff: '',
  route: '',
  pickupAt: '',
  dropoffAt: '',
  passengers: 1,
};

export const taxiSearchDefaults = {
  tripType: 'city',
  pickup: 'Kurunegala Town, Sri Lanka',
  dropoff: 'Colombo, Sri Lanka',
  route: '',
  pickupAt: '2026-12-20T08:00',
  dropoffAt: '2026-12-20T10:00',
  passengers: 2,
};

export const airportRoutes = [
  { id: 'tia-ktm', label: 'Tribhuvan Airport → Kathmandu city', extraFee: 500 },
  { id: 'pkr-lakeside', label: 'Pokhara Airport → Lakeside', extraFee: 400 },
  { id: 'bwa-lumbini', label: 'Gautam Buddha Airport → Lumbini', extraFee: 600 },
];

export const taxiFilterOptions = {
  categories: [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'estate', label: 'Estate' },
  ],
  deposits: [
    { value: '200-500', label: 'Rs. 200 - 500' },
    { value: '500-1000', label: 'Rs. 500 - 1000' },
    { value: '1000-1200', label: 'Rs. 1000 - 1200' },
    { value: '1200-1500', label: 'Rs. 1200 - 1500' },
  ],
  fuels: [
    { value: 'fully-electric', label: 'Fully Electric' },
    { value: 'hybrid', label: 'Hybrid' },
  ],
};

export const emptyTaxiFilters = { categories: [], deposits: [], fuels: [] };

const driver = {
  name: 'Mr. ABC Dissanayaka',
  regNo: 'Taxi98745',
  phones: ['+94 123 456 1234', '+94 123 789 101'],
};

export const taxis = [
  {
    id: 'vauxhall-corsa',
    name: 'Vauxhall Corsa',
    subtitle: 'or similar small car',
    category: 'small',
    fuel: 'petrol',
    rating: 4,
    distanceFromCenterKm: 2,
    seats: 5,
    transmission: 'Manual',
    largeBags: 1,
    smallBags: 1,
    mileageLimit: 600,
    price: 800,
    deposit: 700,
    plate: 'WP CAB 1204',
    image: 'https://picsum.photos/seed/corsa/700/450',
    driver,
  },
  {
    id: 'bajaj-auto-rickshaw',
    name: 'Bajaj Auto Rickshaw',
    subtitle: 'or similar three-wheeler',
    category: 'small',
    fuel: 'petrol',
    rating: 4.5,
    distanceFromCenterKm: 6,
    seats: 3,
    transmission: 'Auto',
    largeBags: 0,
    smallBags: 3,
    mileageLimit: 600,
    price: 300,
    deposit: 400,
    plate: 'NW 5987',
    image: 'https://picsum.photos/seed/bajaj/700/450',
    driver,
  },
  {
    id: 'fiat-500',
    name: 'Fiat 500',
    subtitle: 'or similar small car',
    category: 'small',
    fuel: 'petrol',
    rating: 4.5,
    distanceFromCenterKm: 0.5,
    seats: 4,
    transmission: 'Manual',
    largeBags: 1,
    smallBags: 1,
    mileageLimit: 300,
    price: 600,
    deposit: 900,
    plate: 'WP CAD 7781',
    image: 'https://picsum.photos/seed/fiat500/700/450',
    driver,
  },
  {
    id: 'toyota-prius',
    name: 'Toyota Prius',
    subtitle: 'or similar hybrid car',
    category: 'medium',
    fuel: 'hybrid',
    rating: 4,
    distanceFromCenterKm: 1,
    seats: 5,
    transmission: 'Auto',
    largeBags: 2,
    smallBags: 2,
    mileageLimit: 500,
    price: 1100,
    deposit: 1100,
    plate: 'WP CBK 3310',
    image: 'https://picsum.photos/seed/prius/700/450',
    driver,
  },
];

export const paymentMethods = [
  {
    id: 'esewa',
    label: 'eSewa',
    description: 'Online payment requires a configured Taxi payment backend.',
    enabled: false,
  },
  {
    id: 'khalti',
    label: 'Khalti',
    description: 'Online payment requires a configured Taxi payment backend.',
    enabled: false,
  },
  {
    id: 'cash',
    label: 'Cash',
    description: 'Pay your driver directly at pick-up.',
    enabled: true,
  },
];
