const steps = ['Your Selection', 'Your Details', 'Final Step'];

export default function StayBookingStepper({ current = 1 }) {
  return <ol aria-label="Booking progress" className="mb-8 grid grid-cols-3">{steps.map((label, index) => <li key={label} aria-current={index + 1 === current ? 'step' : undefined} className="text-center"><span className={`mx-auto grid size-9 place-items-center rounded-full font-semibold ${index + 1 <= current ? 'bg-[#66A2DF] text-white' : 'bg-zinc-200'}`}>{index + 1}</span><span className="mt-2 block text-xs sm:text-sm">{label}</span></li>)}</ol>;
}
