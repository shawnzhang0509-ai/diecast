import Hero from '../sections/Hero';
import FeaturedModel from '../sections/FeaturedModel';
import InStockNow from '../sections/InStockNow';
import Brands from '../sections/Brands';
import NewArrivals from '../sections/NewArrivals';
import Craftsmanship from '../sections/Craftsmanship';
import Giving from '../sections/Giving';
import SubscribedNotice from '../components/SubscribedNotice';

export default function HomePage() {
  return (
    <main>
      <SubscribedNotice />
      <Hero />
      <FeaturedModel />
      <InStockNow />
      <Giving />
      <Brands />
      <NewArrivals />
      <Craftsmanship />
    </main>
  );
}
