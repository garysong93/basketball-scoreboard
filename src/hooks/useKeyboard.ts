import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';

export function useKeyboard() {
  const {
    isRunning,
    addScore,
    subtractScore,
    startTimer,
    pauseTimer,
    resetShotClock,
    addFoul,
    callTimeout,
    setPossession,
    togglePossession,
    nextPeriod,
    undo,
    redo,
    setFullscreen,
    isFullscreen,
  } = useGameStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const { key, shiftKey, ctrlKey, metaKey } = event;

      // Undo/Redo
      if ((ctrlKey || metaKey) && key.toLowerCase() === 'z') {
        event.preventDefault();
        if (shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if ((ctrlKey || metaKey) && key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }

      // Home team scoring (1, 2, 3)
      if (key === '1') {
        event.preventDefault();
        if (shiftKey) {
          subtractScore('home', 1);
        } else {
          addScore('home', 1);
        }
        return;
      }

      if (key === '2') {
        event.preventDefault();
        addScore('home', 2);
        return;
      }

      if (key === '3') {
        event.preventDefault();
        addScore('home', 3);
        return;
      }

      // Away team scoring (7, 8, 9)
      if (key === '7') {
        event.preventDefault();
        if (shiftKey) {
          subtractScore('away', 1);
        } else {
          addScore('away', 1);
        }
        return;
      }

      if (key === '8') {
        event.preventDefault();
        addScore('away', 2);
        return;
      }

      if (key === '9') {
        event.preventDefault();
        addScore('away', 3);
        return;
      }

      // Timer control (Space)
      if (key === ' ') {
        event.preventDefault();
        if (isRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
        return;
      }

      // Shot clock reset (R)
      if (key.toLowerCase() === 'r') {
        event.preventDefault();
        if (shiftKey) {
          resetShotClock(false); // 14 seconds
        } else {
          resetShotClock(true); // 24 seconds
        }
        return;
      }

      // Fouls (F)
      if (key.toLowerCase() === 'f') {
        event.preventDefault();
        if (shiftKey) {
          addFoul('away');
        } else {
          addFoul('home');
        }
        return;
      }

      // Timeouts (T)
      if (key.toLowerCase() === 't') {
        event.preventDefault();
        if (shiftKey) {
          callTimeout('away');
        } else {
          callTimeout('home');
        }
        return;
      }

      // Possession (Q, W, P)
      if (key.toLowerCase() === 'q') {
        event.preventDefault();
        setPossession('home');
        return;
      }

      if (key.toLowerCase() === 'w') {
        event.preventDefault();
        setPossession('away');
        return;
      }

      if (key.toLowerCase() === 'p') {
        event.preventDefault();
        togglePossession();
        return;
      }

      // Next period (N)
      if (key.toLowerCase() === 'n') {
        event.preventDefault();
        nextPeriod();
        return;
      }

      // Fullscreen (Escape)
      if (key === 'Escape') {
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setFullscreen(false);
        } else {
          document.documentElement.requestFullscreen();
          setFullscreen(true);
        }
        return;
      }
    },
    [
      isRunning,
      addScore,
      subtractScore,
      startTimer,
      pauseTimer,
      resetShotClock,
      addFoul,
      callTimeout,
      setPossession,
      togglePossession,
      nextPeriod,
      undo,
      redo,
      setFullscreen,
      isFullscreen,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [setFullscreen]);
}
