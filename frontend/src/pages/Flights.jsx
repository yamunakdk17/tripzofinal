import FlightHero from '@/components/features/flights/FlightHero';
import { useNavigate } from 'react-router-dom';

export default function Flights() {
  const navigate = useNavigate();

  return (
    <main>
      <FlightHero onSearch={(search) => navigate('/flights/results', { state: { search } })} />
    </main>
  );
}
