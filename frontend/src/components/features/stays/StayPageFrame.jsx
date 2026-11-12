import Footer from '@/components/layout/footer';

export default function StayPageFrame({ children, className = '' }) {
  return <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-white"><main className={`mx-auto min-h-[65vh] max-w-[1500px] px-4 pb-16 pt-8 sm:px-8 ${className}`}>{children}</main><Footer /></div>;
}
