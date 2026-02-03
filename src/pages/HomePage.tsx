import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
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
  const { isFullscreen, language } = useGameStore();

  const seoContent = {
    en: {
      title: 'Free Basketball Scoreboard Online - FIBA, NBA, NCAA Timer & Stats',
      description: 'Free online basketball scoreboard with game timer, shot clock, player stats, and OBS streaming. Works offline. Supports FIBA, NBA, NCAA, and 3x3 rules.',
    },
    zh: {
      title: '免费在线篮球计分板 - FIBA、NBA、NCAA 计时器与统计',
      description: '免费在线篮球计分板，带比赛计时器、进攻时间、球员统计和OBS直播功能。支持离线使用。支持FIBA、NBA、NCAA和3x3规则。',
    },
  };

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
      <Helmet>
        <title>{seoContent[language].title}</title>
        <meta name="title" content={seoContent[language].title} />
        <meta name="description" content={seoContent[language].description} />
        <link rel="canonical" href="https://www.basketballscoreboardonline.com/" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.basketballscoreboardonline.com/" />
        <meta property="og:title" content={seoContent[language].title} />
        <meta property="og:description" content={seoContent[language].description} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.basketballscoreboardonline.com/" />
        <meta name="twitter:title" content={seoContent[language].title} />
        <meta name="twitter:description" content={seoContent[language].description} />
      </Helmet>
      {/* Header - hidden in fullscreen */}
      {!isFullscreen && <Header />}

      {/* Hero Banner - hidden in fullscreen, can be dismissed */}
      {!isFullscreen && <HeroBanner />}

      {/* Quick Help - hidden in fullscreen and on mobile */}
      {!isFullscreen && (
        <div className="hidden md:block">
          <QuickHelp />
        </div>
      )}

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
