import { Routes, Route } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Home from '@/pages/Home';
import Flights from '@/pages/Flights';
import FlightResults from '@/pages/FlightResults';
import FlightBooking from '@/pages/FlightBooking';
import StaysPage from '@/pages/stays/StaysPage';
import StayResultsPage from '@/pages/stays/StayResultsPage';
import StayDetailsPage from '@/pages/stays/StayDetailsPage';
import StayReservationPage from '@/pages/stays/StayReservationPage';
import StayBookingPage from '@/pages/stays/StayBookingPage';
import StayPaymentPage from '@/pages/stays/StayPaymentPage';
import StayConfirmationPage from '@/pages/stays/StayConfirmationPage';
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
        <Route path="/stays" element={<StaysPage />} />
        <Route path="/stays/search" element={<StayResultsPage />} />
        <Route path="/stays/booking/confirmed/:bookingRef?" element={<StayConfirmationPage />} />
        <Route path="/stays/booking/:bookingRef" element={<StayBookingPage />} />
        <Route path="/stays/payment/:bookingRef" element={<StayPaymentPage />} />
        <Route path="/stays/:stayId/reserve" element={<StayReservationPage />} />
        <Route path="/stays/:stayId/guest" element={<StayReservationPage />} />
        <Route path="/stays/:stayId" element={<StayDetailsPage />} />
        <Route path="/hotels" element={<StaysPage />} />
        <Route path="/hotels/search" element={<StayResultsPage />} />
        <Route path="/hotels/booking/confirmed/:bookingRef?" element={<StayConfirmationPage />} />
        <Route path="/hotels/booking/:bookingRef" element={<StayBookingPage />} />
        <Route path="/hotels/payment/:bookingRef" element={<StayPaymentPage />} />
        <Route path="/hotels/:stayId/reserve" element={<StayReservationPage />} />
        <Route path="/hotels/:stayId/guest" element={<StayReservationPage />} />
        <Route path="/hotels/:stayId" element={<StayDetailsPage />} />
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
