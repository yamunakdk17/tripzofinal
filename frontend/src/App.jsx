import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import Flights from '@/pages/Flights';
import FlightResults from '@/pages/FlightResults';
import FlightBooking from '@/pages/FlightBooking';
import StaysPage from '@/pages/StaysPage';
import TaxiPage from '@/pages/taxis/TaxiPage';
import TaxiResultsPage from '@/pages/taxis/TaxiResultsPage';
import TaxiDetailsPage from '@/pages/taxis/TaxiDetailsPage';
import TaxiBookingPage from '@/pages/taxis/TaxiBookingPage';
import TaxiPaymentPage from '@/pages/taxis/TaxiPaymentPage';
import TaxiConfirmationPage from '@/pages/taxis/TaxiConfirmationPage';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels/*" element={<StaysPage />} />
        <Route path="/stays/*" element={<StaysPage />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/flights/results" element={<FlightResults />} />
        <Route path="/flights/booking" element={<FlightBooking />} />
        <Route path="/flights/payment" element={<FlightBooking />} />
        <Route path="/flights/confirmation" element={<FlightBooking />} />
        <Route path="/airport-taxi" element={<TaxiPage />} />
        <Route path="/airport-taxi/results" element={<TaxiResultsPage />} />
        <Route path="/airport-taxi/vehicles/:taxiId" element={<TaxiDetailsPage />} />
        <Route path="/airport-taxi/booking/:bookingId" element={<TaxiBookingPage />} />
        <Route path="/airport-taxi/booking/:bookingId/payment" element={<TaxiPaymentPage />} />
        <Route path="/airport-taxi/booking/:bookingId/confirmation" element={<TaxiConfirmationPage />} />
      </Routes>
    </>
  );
}
