import { formatMoney } from '@/components/features/stays/stayData';
import { formatTripDate, getTaxiSpecs } from './taxiUtils';

function Row({ label, children }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-black/60">{label}</dt>
      <dd className="font-medium sm:text-right">{children}</dd>
    </div>
  );
}

export default function TaxiTripSummary({ booking }) {
  const { taxi, trip, passenger, pricing } = booking;

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <img src={taxi.image} alt={taxi.name} className="h-20 w-28 rounded-xl object-contain sm:h-24 sm:w-36" />
        <div>
          <h3 className="text-xl font-medium text-[#044777] sm:text-2xl">{taxi.name}</h3>
          <p className="text-sm text-black/70">{getTaxiSpecs(taxi).slice(0, 3).join(' · ')}</p>
        </div>
      </div>

      <dl className="space-y-3 text-sm sm:text-base">
        <Row label="Route">{trip.locationLabel}</Row>
        <Row label="Pick-up">{trip.pickup}</Row>
        <Row label="Pick-up time">{formatTripDate(trip.pickupAt)}</Row>
        <Row label="Drop-off">{trip.dropoff}</Row>
        <Row label="Drop-off time">{formatTripDate(trip.dropoffAt)}</Row>
        <Row label="Passengers">{trip.passengers}</Row>
        <Row label="Passenger">{passenger.firstName} {passenger.lastName}</Row>
        <Row label="Contact">{passenger.dial} {passenger.phone}</Row>
        {passenger.email && <Row label="Email">{passenger.email}</Row>}
        {passenger.notes && <Row label="Notes">{passenger.notes}</Row>}
      </dl>

      <dl className="space-y-2 border-t border-black/20 pt-4 text-sm sm:text-base">
        <Row label="Base fare">{formatMoney(pricing.baseFare, pricing.currency)}</Row>
        {pricing.extraFee > 0 && <Row label="Airport transfer fee">{formatMoney(pricing.extraFee, pricing.currency)}</Row>}
        <div className="flex justify-between pt-2 text-lg font-semibold sm:text-xl">
          <dt>Total</dt>
          <dd>{formatMoney(pricing.total, pricing.currency)}</dd>
        </div>
      </dl>
    </div>
  );
}
