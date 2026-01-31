import { useEffect } from 'react';
import { Scoreboard } from '../components/Scoreboard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { QuickHelp } from '../components/QuickHelp';
import { HeroBanner } from '../components/HeroBanner';
import { FeaturesSection } from '../components/FeaturesSection';
import { WhyChooseSection } from '../components/WhyChooseSection';
import { SEOContentSection } from '../components/SEOContentSection';
import { useGameStore } from '../stores/gameStore';

export function HomePage() {
  const { isFullscreen } = useGameStore();

  // Control body overflow based on fullscreen state
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      {/* Header - hidden in fullscreen */}
      {!isFullscreen && <Header />}

      {/* Hero Banner - hidden in fullscreen, can be dismissed */}
      {!isFullscreen && <HeroBanner />}

      {/* Quick Help - hidden in fullscreen */}
      {!isFullscreen && <QuickHelp />}

      {/* Main scoreboard area */}
      <main className="flex-1 flex flex-col">
        <Scoreboard />
      </main>

      {/* SEO content sections - hidden in fullscreen */}
      {!isFullscreen && <FeaturesSection />}
      {!isFullscreen && <WhyChooseSection />}
      {!isFullscreen && <SEOContentSection />}

      {/* Footer - hidden in fullscreen */}
      {!isFullscreen && <Footer />}
    </div>
  );
}
