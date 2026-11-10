import {
  CalendarDays,
  CarTaxiFront,
  Hotel,
  MapPin,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Users,
} from 'lucide-react';

import pokharaImage from '@/assets/pokhara.jpg';
import pachpokhariImage from '@/assets/pachpokhari.jpg';
import dolakhaImage from '@/assets/dolakha.jpg';
import mustangImage from '@/assets/mustang.jpg';
import kathmanduImage from '@/assets/kathmandu.jpg';

/* ------------------------------------------------------------------
   HERO
------------------------------------------------------------------- */

export const heroContent = {
  eyebrow: 'Explore Nepal',
  title: 'Your Journey Begins Here.',
  description: 'Trek higher. Travel farther. Explore the beauty of Nepal with Tripzo.',
  image: pokharaImage,
  imageAlt: 'Beautiful landscape of Pokhara, Nepal',
  searchButtonLabel: 'Search',
};

/* ------------------------------------------------------------------
   SEARCH TABS
------------------------------------------------------------------- */

export const searchTabs = [
  {
    id: 'hotels',
    label: 'Hotels',
    icon: Hotel,
    to: '/hotels',
    fields: [
      {
        id: 'destination',
        label: 'Destination',
        icon: MapPin,
        type: 'text',
        placeholder: 'Pokhara, Nepal',
      },
      {
        id: 'checkin',
        label: 'Check-in',
        icon: CalendarDays,
        type: 'date',
      },
      {
        id: 'checkout',
        label: 'Check-out',
        icon: CalendarDays,
        type: 'date',
      },
      {
        id: 'guests',
        label: 'Guests',
        icon: Users,
        type: 'number',
        placeholder: '2',
      },
    ],
  },

  {
    id: 'taxis',
    label: 'Airport Taxi',
    icon: CarTaxiFront,
    to: '/airport-taxi',
    fields: [
      {
        id: 'pickup',
        label: 'Pickup',
        icon: MapPin,
        type: 'text',
        placeholder: 'Airport',
      },
      {
        id: 'dropoff',
        label: 'Drop-off',
        icon: MapPin,
        type: 'text',
        placeholder: 'Hotel or address',
      },
      {
        id: 'date',
        label: 'Date',
        icon: CalendarDays,
        type: 'date',
      },
      {
        id: 'passengers',
        label: 'Passengers',
        icon: Users,
        type: 'number',
        placeholder: '2',
      },
    ],
  },

  {
    id: 'flights',
    label: 'Flights',
    icon: Plane,
    to: '/flights',
    fields: [
      {
        id: 'from',
        label: 'From',
        icon: PlaneTakeoff,
        type: 'text',
        placeholder: 'Kathmandu (KTM)',
      },
      {
        id: 'to',
        label: 'To',
        icon: PlaneLanding,
        type: 'text',
        placeholder: 'Pokhara (PKR)',
      },
      {
        id: 'depart',
        label: 'Depart',
        icon: CalendarDays,
        type: 'date',
      },
      {
        id: 'travellers',
        label: 'Travellers',
        icon: Users,
        type: 'number',
        placeholder: '1',
      },
    ],
  },
];

/* ------------------------------------------------------------------
   QUICK ACTION CARDS
------------------------------------------------------------------- */

export const actionCards = [
  {
    title: 'Hotels',
    description: 'Stays for every budget',
    icon: Hotel,
    to: '/hotels',
  },
  {
    title: 'Airport Taxi',
    description: 'On-time pickups, fixed fares',
    icon: CarTaxiFront,
    to: '/airport-taxi',
  },
  {
    title: 'Flights',
    description: 'Compare and book fares',
    icon: Plane,
    to: '/flights',
  },
];

/* ------------------------------------------------------------------
   DESTINATIONS
------------------------------------------------------------------- */

export const destinationsContent = {
  title: 'Explore Nepal',
  backgroundImage: pachpokhariImage,
  mustVisitLabel: 'Must-Visit:',
  staysLabel: 'Nearby Stays',
  staysTo: '/hotels',
  maxRating: 5,
};

export const destinations = [
  {
    id: 'pokhara',
    city: 'Pokhara',
    tagline: 'Gateway to the Himalayas',
    rating: 5,
    image: pokharaImage,
    imageAlt: 'Beautiful landscape of Pokhara, Nepal',
    mustVisit: ['Phewa Lake', 'Sarangkot', 'World Peace Pagoda'],
  },

  {
    id: 'pachpokhari',
    city: 'Pach Pokhari',
    tagline: 'A Hidden Himalayan Paradise',
    rating: 4.5,
    image: pachpokhariImage,
    imageAlt: 'Pach Pokhari landscape in Nepal',
    mustVisit: ['Pach Pokhari Lake', 'Himalayan Trails', 'Mountain Views'],
  },

  {
    id: 'dolakha',
    city: 'Dolakha',
    tagline: 'Adventure in the Himalayas',
    rating: 4.5,
    image: dolakhaImage,
    imageAlt: 'Beautiful landscape of Dolakha, Nepal',
    mustVisit: ['Dolakha Bhimsen Temple', 'Kalinchowk', 'Himalayan Views'],
  },

  {
    id: 'mustang',
    city: 'Mustang',
    tagline: 'The Hidden Kingdom of Nepal',
    rating: 5,
    image: mustangImage,
    imageAlt: 'Mountain landscape of Mustang, Nepal',
    mustVisit: ['Muktinath', 'Marpha Village', 'Upper Mustang'],
  },

  {
    id: 'kathmandu',
    city: 'Kathmandu',
    tagline: 'The Cultural Heart of Nepal',
    rating: 5,
    image: kathmanduImage,
    imageAlt: 'Cultural and historic Kathmandu, Nepal',
    mustVisit: ['Swayambhunath', 'Pashupatinath Temple', 'Kathmandu Durbar Square'],
  },
];
