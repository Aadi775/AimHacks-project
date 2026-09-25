import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import HeroSection from '@/components/home/HeroSection';
import WhatsHappeningCard from '@/components/shared/WhatsHappeningCard';
import MetricCards from '@/components/home/MetricCards';
import NeighborhoodExplorer from '@/components/home/NeighborhoodExplorer';
import CommunityDispatches from '@/components/home/CommunityDispatches';

export default function Home() {
  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <HeroSection />
      <section className="w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter xl:px-margin -mt-2 mb-4">
        <WhatsHappeningCard />
      </section>
      <MetricCards />
      <NeighborhoodExplorer />
      <CommunityDispatches />
      <Footer />
      <AIAssistant />
    </main>
  );
}
