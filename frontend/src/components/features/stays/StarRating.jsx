import { Star } from 'lucide-react';

export default function StarRating({ value = 0, size = 16 }) {
  return <span role="img" aria-label={`${value} out of 5 stars`} className="inline-flex">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={size} className={i < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-amber-400'} />)}</span>;
}
