import Footer from '@/components/layout/footer';
import { taxiAssets } from './taxiData';

export default function TaxiPageShell({ children, backdrop = true }) {
  return (
    <div className="relative min-h-screen bg-white">
      {backdrop && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-44 overflow-hidden bg-slate-300 sm:h-52 lg:h-[247px]"
        >
          <img src={taxiAssets.road} alt="" className="size-full object-cover opacity-40" />
        </div>
      )}
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
