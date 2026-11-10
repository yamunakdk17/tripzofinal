export const stayHero = {
  title: 'Find Your Favourite',
  highlight: 'Place to Stay',
  description:
    'Discover the perfect accommodation for your next trip. Enjoy a range of facilities to make your stay comfortable and memorable:',
  image: 'https://picsum.photos/seed/stay-hero/1600/900',
};

export const emptyStaySearch = {
  destination: '',
  checkIn: '',
  checkOut: '',
  rooms: 1,
};

function dateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export const staySearchDefaults = {
  destination: 'Galle Town, Sri Lanka',
  checkIn: dateOffset(7),
  checkOut: dateOffset(10),
  rooms: 2,
};

export const stayOffers = [
  {
    id: 'lakeview-hotel',
    name: 'Lakeview Hotel',
    location: 'Anuradhapura',
    rating: 3,
    image: 'https://picsum.photos/seed/lakeview/800/500',
    offer: '20% off for a 3-night stay',
    pricePerNight: 6000,
    currency: 'LKR',
  },
  {
    id: 'mountain-inn',
    name: 'Mountain Inn',
    location: 'Hanthana',
    rating: 3,
    image: 'https://picsum.photos/seed/mountaininn/800/500',
    offer: 'Stay 2 nights, get the 3rd night free',
    pricePerNight: 5500,
    currency: 'LKR',
  },
  {
    id: 'city-lodge',
    name: 'City Lodge',
    location: 'Kadawatha',
    rating: 3,
    image: 'https://picsum.photos/seed/citylodge/800/500',
    offer: 'Complimentary breakfast with every booking',
    pricePerNight: 4800,
    currency: 'LKR',
  },
];

export const filterOptions = {
  propertyTypes: [
    { value: 'hotel', label: 'Hotels' },
    { value: 'guest-house', label: 'Guest Houses' },
    { value: 'apartment', label: 'Apartments' },
    { value: 'villa', label: 'Villas' },
  ],
  priceRanges: [
    { value: '2000-5000', label: 'Rs. 2000 - 5000' },
    { value: '5000-8000', label: 'Rs. 5000 - 8000' },
    { value: '8000-12000', label: 'Rs. 8000 - 12000' },
    { value: '12000-15000', label: 'Rs. 12000 - 15000' },
  ],
  facilities: [
    { value: 'parking', label: 'Parking' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'pets', label: 'Pets Allowed' },
  ],
  distances: [{ value: 'under-5', label: 'Less than 5km' }],
};

export const emptyStayFilters = {
  propertyTypes: [],
  priceRanges: [],
  facilities: [],
  distances: [],
};

const sharedDetails = {
  ratingBreakdown: [
    { label: 'Cleanliness', value: 4 },
    { label: 'Location', value: 4.5 },
    { label: 'Service', value: 3 },
  ],
  highlights: [
    {
      title: 'Rooms and ambience',
      tags: 'Sea view, Quiet, Garden, Family friendly',
      quote: '“Spotless rooms and a lovely garden terrace for breakfast.”',
    },
    {
      title: 'Special occasions',
      tags: 'Romantic, Scenic view, Large groups',
      quote: '“A perfect base for a long weekend by the beach.”',
    },
  ],
  contact: {
    address: 'Parangiya Waththe 275, Pillagoda, Galle, Unawatuna 80600 Sri Lanka',
    phone: '+94 123 456 789',
    email: 'hotelsouthern@gmail.com',
  },
  about:
    'Welcome to our beachside stay in Unawatuna. Enjoy comfortable rooms, a garden, a shared lounge and a terrace, with the beach only minutes away. Our restaurant is open from 7.30 a.m. to 9.30 p.m.',
  details: {
    priceRange: 'Rs. 2,000 – Rs. 12,000 per night',
    propertyType: 'Hotel, Guest House',
    specialDiets: 'Vegetarian friendly, Vegan options, Gluten free options',
    amenities: ['Free WiFi', 'Free private parking', 'Restaurant', 'Terrace', 'Garden', 'Shared lounge'],
    checkIn: '13:00 – 23:00',
    checkOut: '13:00 – 23:00',
  },
};

export const stays = [
  {
    id: 'sea-waves',
    name: 'Sea Waves Restaurant',
    area: 'Unawatuna',
    city: 'Galle',
    rating: 4,
    reviewCount: 100,
    rankText: '#8 of 121 Hotels in Galle',
    distanceFromCenterKm: 3,
    propertyType: 'hotel',
    pricePerNight: 4500,
    facilities: ['parking', 'restaurant'],
    description:
      'Situated in Galle, 5.3 km from Main Town, The Sea wave restaurant features accommodation with a garden, free private parking, a shared lounge and a terrace.',
    image: 'https://picsum.photos/seed/seawaves/700/500',
    gallery: [
      'https://picsum.photos/seed/seawaves-1/1100/700',
      'https://picsum.photos/seed/seawaves-2/700/500',
      'https://picsum.photos/seed/seawaves-3/700/500',
    ],
    price: { currency: 'LKR', original: 24000, current: 20500 },
    ...sharedDetails,
  },
  {
    id: 'thabroban-beach-house',
    name: 'Thabroban Beach House',
    area: 'Thalpe',
    city: 'Galle',
    rating: 4.5,
    reviewCount: 86,
    rankText: '#12 of 121 Hotels in Galle',
    distanceFromCenterKm: 6,
    propertyType: 'guest-house',
    pricePerNight: 6500,
    facilities: ['parking', 'pets'],
    description:
      'Set in Galle, 500 metres from Bonavista Beach, Blue Beach Galle offers accommodation with a fitness centre, free private parking, a terrace and a restaurant.',
    image: 'https://picsum.photos/seed/thabroban/700/500',
    gallery: [
      'https://picsum.photos/seed/thabroban-1/1100/700',
      'https://picsum.photos/seed/thabroban-2/700/500',
      'https://picsum.photos/seed/thabroban-3/700/500',
    ],
    price: { currency: 'LKR', original: 31000, current: 27500 },
    ...sharedDetails,
  },
  {
    id: 'light-house-view-inn',
    name: 'Light House View Inn',
    area: 'Galle',
    city: 'Galle',
    rating: 4.5,
    reviewCount: 142,
    rankText: '#3 of 121 Hotels in Galle',
    distanceFromCenterKm: 0.5,
    propertyType: 'villa',
    pricePerNight: 9000,
    facilities: ['restaurant', 'pets'],
    description:
      'Conveniently set in the centre of Galle, Light House View Inn - Galle Fort is a recently renovated holiday home, which provides free WiFi, a private beach area and free private parking for guests who...',
    image: 'https://picsum.photos/seed/lighthouse/700/500',
    gallery: [
      'https://picsum.photos/seed/lighthouse-1/1100/700',
      'https://picsum.photos/seed/lighthouse-2/700/500',
      'https://picsum.photos/seed/lighthouse-3/700/500',
    ],
    price: { currency: 'LKR', original: 36000, current: 32400 },
    ...sharedDetails,
  },
  {
    id: 'galle-fort-residence',
    name: 'Galle Fort Residence',
    area: 'Galle Fort',
    city: 'Galle',
    rating: 4,
    reviewCount: 57,
    rankText: '#19 of 121 Hotels in Galle',
    distanceFromCenterKm: 1,
    propertyType: 'apartment',
    pricePerNight: 7200,
    facilities: ['parking'],
    description:
      'A bright apartment inside the historic Galle Fort walls, a short walk from the lighthouse, cafes and the ramparts.',
    image: 'https://picsum.photos/seed/gallefort/700/500',
    gallery: [
      'https://picsum.photos/seed/gallefort-1/1100/700',
      'https://picsum.photos/seed/gallefort-2/700/500',
      'https://picsum.photos/seed/gallefort-3/700/500',
    ],
    price: { currency: 'LKR', original: 26000, current: 23400 },
    ...sharedDetails,
  },
];

export const countries = [
  { value: 'LK', label: 'Sri Lanka', dial: '+94' },
  { value: 'NP', label: 'Nepal', dial: '+977' },
  { value: 'IN', label: 'India', dial: '+91' },
  { value: 'US', label: 'United States', dial: '+1' },
];

export function formatMoney(amount, currency = 'LKR') {
  return `${currency === 'LKR' ? 'Rs.' : currency} ${Number(amount).toLocaleString('en-US')}`;
}

export function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);
  const difference = (end - start) / 86400000;
  return Number.isFinite(difference) && difference > 0 ? difference : 0;
}

export function formatStayDate(iso) {
  if (!iso) return '';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function readStaySearch(searchParams) {
  return {
    destination: searchParams.get('destination') || '',
    checkIn: searchParams.get('checkIn') || dateOffset(7),
    checkOut: searchParams.get('checkOut') || dateOffset(10),
    rooms: Math.max(1, Math.min(10, Number(searchParams.get('rooms')) || 1)),
  };
}

export function toStayQuery(values) {
  return new URLSearchParams({
    destination: values.destination.trim(),
    checkIn: values.checkIn,
    checkOut: values.checkOut,
    rooms: String(values.rooms),
  }).toString();
}
