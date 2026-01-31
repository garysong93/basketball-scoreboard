import { useEffect } from 'react';
import { OBSOverlay, OBSOverlayMinimal } from './pages/OBSOverlay';
import { RulesPage } from './pages/RulesPage';
import { TutorialPage } from './pages/TutorialPage';
import { FAQPage } from './pages/FAQPage';
import { HomePage } from './pages/HomePage';
import { useGameStore } from './stores/gameStore';

function App() {
  const { theme } = useGameStore();

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Simple routing based on URL path
  const path = window.location.pathname;

  // OBS overlays (transparent background)
  if (path === '/obs') {
    return <OBSOverlay />;
  }

  if (path === '/obs-minimal') {
    return <OBSOverlayMinimal />;
  }

  // Content pages
  if (path === '/rules') {
    return <RulesPage />;
  }

  if (path === '/tutorial') {
    return <TutorialPage />;
  }

  if (path === '/faq') {
    return <FAQPage />;
  }

  // Redirect /app to homepage (backwards compatibility)
  if (path === '/app') {
    window.location.replace('/');
    return null;
  }

  // Homepage with integrated scoreboard
  return <HomePage />;
}

export default App;
