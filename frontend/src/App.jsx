import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import Flights from '@/pages/Flights';
import FlightResults from '@/pages/FlightResults';
import FlightBooking from '@/pages/FlightBooking';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/results" element={<FlightResults />} />
        <Route path="/flights/booking" element={<FlightBooking />} />
        <Route path="/flights/payment" element={<FlightBooking />} />
        <Route path="/flights/confirmation" element={<FlightBooking />} />
      </Routes>
    </>
  );
}
