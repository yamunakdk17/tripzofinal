import HomeHero from '@/components/features/home/HomeHero';
import HomeDestinations from '@/components/features/home/HomeDestinations';
import Footer from '@/components/layout/footer';
import ExplorePackages from '@/components/features/home/ExplorePackages';

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeDestinations />
      <ExplorePackages />
      <Footer />
    </>
  );
}
