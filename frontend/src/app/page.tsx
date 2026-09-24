import Footer from '@/components/shared/Footer';
import AIAssistant from '@/components/shared/AIAssistant';
import HeroSection from '@/components/home/HeroSection';
import MetricCards from '@/components/home/MetricCards';
import NeighborhoodExplorer from '@/components/home/NeighborhoodExplorer';
import CommunityDispatches from '@/components/home/CommunityDispatches';

export default function Home() {
  return (
    <main className="w-full pt-16 flex-grow flex flex-col">
      <HeroSection />
      <MetricCards />
      <NeighborhoodExplorer />
      <CommunityDispatches />
      <Footer />
      <AIAssistant />
    </main>
  );
}
