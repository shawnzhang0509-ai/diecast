import Hero from '../sections/Hero';
import FeaturedModel from '../sections/FeaturedModel';
import InStockNow from '../sections/InStockNow';
import Brands from '../sections/Brands';
import NewArrivals from '../sections/NewArrivals';
import Craftsmanship from '../sections/Craftsmanship';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedModel />
      <InStockNow />
      <Brands />
      <NewArrivals />
      <Craftsmanship />
    </main>
  );
}
