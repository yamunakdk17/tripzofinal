import FlightHero from '@/components/features/flights/FlightHero';
import { useNavigate } from 'react-router-dom';

export default function Flights() {
  const navigate = useNavigate();

  function handleSearch(search) {
    const params = new URLSearchParams(search);
    navigate(`/flights/results?${params}`, { state: { search } });
  }

  return (
    <main>
      <FlightHero onSearch={handleSearch} />
    </main>
  );
}
