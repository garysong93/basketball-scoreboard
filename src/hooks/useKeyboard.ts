import { useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { usePermissions } from './usePermissions';

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

  const permissions = usePermissions();

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

      // Home team scoring (1, 2, 3) - requires canScore permission
      if (key === '1' && permissions.canScore) {
        event.preventDefault();
        if (shiftKey) {
          subtractScore('home', 1);
        } else {
          addScore('home', 1);
        }
        return;
      }

      if (key === '2' && permissions.canScore) {
        event.preventDefault();
        addScore('home', 2);
        return;
      }

      if (key === '3' && permissions.canScore) {
        event.preventDefault();
        addScore('home', 3);
        return;
      }

      // Away team scoring (7, 8, 9) - requires canScore permission
      if (key === '7' && permissions.canScore) {
        event.preventDefault();
        if (shiftKey) {
          subtractScore('away', 1);
        } else {
          addScore('away', 1);
        }
        return;
      }

      if (key === '8' && permissions.canScore) {
        event.preventDefault();
        addScore('away', 2);
        return;
      }

      if (key === '9' && permissions.canScore) {
        event.preventDefault();
        addScore('away', 3);
        return;
      }

      // Timer control (Space) - requires canTimer permission
      if (key === ' ' && permissions.canTimer) {
        event.preventDefault();
        if (isRunning) {
          pauseTimer();
        } else {
          startTimer();
        }
        return;
      }

      // Shot clock reset (R) - requires canTimer permission
      if (key.toLowerCase() === 'r' && permissions.canTimer) {
        event.preventDefault();
        if (shiftKey) {
          resetShotClock(false); // 14 seconds
        } else {
          resetShotClock(true); // 24 seconds
        }
        return;
      }

      // Fouls (F) - requires canFoul permission
      if (key.toLowerCase() === 'f' && permissions.canFoul) {
        event.preventDefault();
        if (shiftKey) {
          addFoul('away');
        } else {
          addFoul('home');
        }
        return;
      }

      // Timeouts (T) - requires canTimeout permission
      if (key.toLowerCase() === 't' && permissions.canTimeout) {
        event.preventDefault();
        if (shiftKey) {
          callTimeout('away');
        } else {
          callTimeout('home');
        }
        return;
      }

      // Possession (Q, W, P) - requires canPossession permission
      if (key.toLowerCase() === 'q' && permissions.canPossession) {
        event.preventDefault();
        setPossession('home');
        return;
      }

      if (key.toLowerCase() === 'w' && permissions.canPossession) {
        event.preventDefault();
        setPossession('away');
        return;
      }

      if (key.toLowerCase() === 'p' && permissions.canPossession) {
        event.preventDefault();
        togglePossession();
        return;
      }

      // Next period (N) - requires canPeriod permission
      if (key.toLowerCase() === 'n' && permissions.canPeriod) {
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
      permissions,
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
