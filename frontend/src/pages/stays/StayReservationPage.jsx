import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';

import StayGuestDetails from '@/components/features/stays/StayGuestDetails';
import StayPageFrame from '@/components/features/stays/StayPageFrame';
import RoomSelection from '@/components/features/stays/RoomSelection';
import { readStaySearch } from '@/components/features/stays/stayData';
import { useStay } from '@/hooks/useStays';

export default function StayReservationPage() {
  const { stayId } = useParams();
  const location = useLocation();
  const [query] = useSearchParams();
  const search = readStaySearch(query);
  const { data: stay, loading, error } = useStay(stayId);
  const guestStep = location.pathname.endsWith('/guest');
  const reservation = location.state?.reservation;
  if (loading) return <StayPageFrame><p role="status">Loading stay…</p></StayPageFrame>;
  if (error || !stay) return <StayPageFrame><p role="alert">Stay not found. <Link to="/stays">Back to stays</Link></p></StayPageFrame>;
  if (guestStep && !reservation) return <StayPageFrame><div className="rounded-2xl bg-white p-6"><p>Your room selection has expired. Select a room to continue.</p><Link className="mt-3 inline-block underline" to={`/stays/${stayId}/reserve${location.search}`}>Select a room</Link></div></StayPageFrame>;
  return <StayPageFrame>{guestStep ? <StayGuestDetails stay={stay} search={search} reservation={reservation}/> : <RoomSelection stay={stay} search={search}/>}</StayPageFrame>;
}
