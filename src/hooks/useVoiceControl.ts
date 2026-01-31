import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameStore } from '../stores/gameStore';

// Web Speech API type declarations
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface VoiceCommand {
  patterns: RegExp[];
  action: () => void;
  feedback: { en: string; zh: string };
}

export function useVoiceControl() {
  const {
    language,
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
  } = useGameStore();

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isListeningRef = useRef(isListening);

  // Keep ref in sync with state
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Define voice commands
  const getCommands = useCallback((): VoiceCommand[] => [
    // Home team scoring
    {
      patterns: [
        /home\s*(team)?\s*(plus|add|\+)?\s*(one|1)\s*(point)?/i,
        /主队.*加.*一.*分/,
        /主队.*一.*分/,
      ],
      action: () => addScore('home', 1),
      feedback: { en: 'Home +1', zh: '主队+1分' },
    },
    {
      patterns: [
        /home\s*(team)?\s*(plus|add|\+)?\s*(two|2)\s*(points)?/i,
        /主队.*加.*[两二2].*分/,
        /主队.*[两二2].*分/,
      ],
      action: () => addScore('home', 2),
      feedback: { en: 'Home +2', zh: '主队+2分' },
    },
    {
      patterns: [
        /home\s*(team)?\s*(plus|add|\+)?\s*(three|3)\s*(points)?/i,
        /home\s*(team)?\s*three\s*(pointer)?/i,
        /主队.*加.*三.*分/,
        /主队.*三.*分/,
      ],
      action: () => addScore('home', 3),
      feedback: { en: 'Home +3', zh: '主队+3分' },
    },

    // Away team scoring
    {
      patterns: [
        /away\s*(team)?\s*(plus|add|\+)?\s*(one|1)\s*(point)?/i,
        /(visitor|guest)\s*(team)?\s*(plus|add|\+)?\s*(one|1)/i,
        /客队.*加.*一.*分/,
        /客队.*一.*分/,
      ],
      action: () => addScore('away', 1),
      feedback: { en: 'Away +1', zh: '客队+1分' },
    },
    {
      patterns: [
        /away\s*(team)?\s*(plus|add|\+)?\s*(two|2)\s*(points)?/i,
        /(visitor|guest)\s*(team)?\s*(plus|add|\+)?\s*(two|2)/i,
        /客队.*加.*[两二2].*分/,
        /客队.*[两二2].*分/,
      ],
      action: () => addScore('away', 2),
      feedback: { en: 'Away +2', zh: '客队+2分' },
    },
    {
      patterns: [
        /away\s*(team)?\s*(plus|add|\+)?\s*(three|3)\s*(points)?/i,
        /away\s*(team)?\s*three\s*(pointer)?/i,
        /(visitor|guest)\s*(team)?\s*three/i,
        /客队.*加.*三.*分/,
        /客队.*三.*分/,
      ],
      action: () => addScore('away', 3),
      feedback: { en: 'Away +3', zh: '客队+3分' },
    },

    // Subtract points
    {
      patterns: [
        /home\s*(team)?\s*(minus|subtract|-)\s*(one|1)/i,
        /主队.*减.*一/,
      ],
      action: () => subtractScore('home', 1),
      feedback: { en: 'Home -1', zh: '主队-1分' },
    },
    {
      patterns: [
        /away\s*(team)?\s*(minus|subtract|-)\s*(one|1)/i,
        /客队.*减.*一/,
      ],
      action: () => subtractScore('away', 1),
      feedback: { en: 'Away -1', zh: '客队-1分' },
    },

    // Timer controls
    {
      patterns: [
        /^start$/i,
        /start\s*(the)?\s*(game|timer|clock)/i,
        /开始/,
        /计时/,
      ],
      action: () => startTimer(),
      feedback: { en: 'Timer started', zh: '计时开始' },
    },
    {
      patterns: [
        /^stop$/i,
        /^pause$/i,
        /stop\s*(the)?\s*(game|timer|clock)/i,
        /pause\s*(the)?\s*(game|timer|clock)/i,
        /暂停.*计时/,
        /停止/,
      ],
      action: () => pauseTimer(),
      feedback: { en: 'Timer paused', zh: '计时暂停' },
    },

    // Shot clock
    {
      patterns: [
        /reset\s*(shot)?\s*clock/i,
        /(shot)?\s*clock\s*reset/i,
        /24\s*(seconds?)?/i,
        /twenty\s*four/i,
        /重置.*进攻/,
        /进攻.*重置/,
        /24秒/,
      ],
      action: () => resetShotClock(true),
      feedback: { en: 'Shot clock 24', zh: '进攻时间24秒' },
    },
    {
      patterns: [
        /14\s*(seconds?)?/i,
        /fourteen/i,
        /14秒/,
      ],
      action: () => resetShotClock(false),
      feedback: { en: 'Shot clock 14', zh: '进攻时间14秒' },
    },

    // Fouls
    {
      patterns: [
        /home\s*(team)?\s*foul/i,
        /foul\s*(on)?\s*home/i,
        /主队.*犯规/,
      ],
      action: () => addFoul('home'),
      feedback: { en: 'Home foul', zh: '主队犯规' },
    },
    {
      patterns: [
        /away\s*(team)?\s*foul/i,
        /(visitor|guest)\s*(team)?\s*foul/i,
        /foul\s*(on)?\s*(away|visitor|guest)/i,
        /客队.*犯规/,
      ],
      action: () => addFoul('away'),
      feedback: { en: 'Away foul', zh: '客队犯规' },
    },

    // Timeouts
    {
      patterns: [
        /home\s*(team)?\s*time\s*out/i,
        /time\s*out\s*home/i,
        /主队.*暂停/,
      ],
      action: () => callTimeout('home'),
      feedback: { en: 'Home timeout', zh: '主队暂停' },
    },
    {
      patterns: [
        /away\s*(team)?\s*time\s*out/i,
        /(visitor|guest)\s*(team)?\s*time\s*out/i,
        /time\s*out\s*(away|visitor|guest)/i,
        /客队.*暂停/,
      ],
      action: () => callTimeout('away'),
      feedback: { en: 'Away timeout', zh: '客队暂停' },
    },

    // Possession
    {
      patterns: [
        /home\s*(team)?\s*(ball|possession)/i,
        /(ball|possession)\s*(to)?\s*home/i,
        /主队.*球权/,
      ],
      action: () => setPossession('home'),
      feedback: { en: 'Home ball', zh: '主队球权' },
    },
    {
      patterns: [
        /away\s*(team)?\s*(ball|possession)/i,
        /(visitor|guest)\s*(team)?\s*(ball|possession)/i,
        /(ball|possession)\s*(to)?\s*(away|visitor|guest)/i,
        /客队.*球权/,
      ],
      action: () => setPossession('away'),
      feedback: { en: 'Away ball', zh: '客队球权' },
    },
    {
      patterns: [
        /switch\s*(possession)?/i,
        /change\s*(possession)?/i,
        /toggle/i,
        /切换.*球权/,
      ],
      action: () => togglePossession(),
      feedback: { en: 'Possession switched', zh: '球权切换' },
    },

    // Period
    {
      patterns: [
        /next\s*(period|quarter)/i,
        /end\s*(of)?\s*(period|quarter)/i,
        /下一节/,
        /结束.*这.*节/,
      ],
      action: () => nextPeriod(),
      feedback: { en: 'Next period', zh: '下一节' },
    },
  ], [addScore, subtractScore, startTimer, pauseTimer, resetShotClock, addFoul, callTimeout, setPossession, togglePossession, nextPeriod]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = language === 'zh' ? 'zh-CN' : 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const transcript = event.results[last][0].transcript.trim().toLowerCase();

      console.log('Voice input:', transcript);

      const commands = getCommands();
      for (const command of commands) {
        for (const pattern of command.patterns) {
          if (pattern.test(transcript)) {
            command.action();
            setLastCommand(command.feedback[language]);
            setTimeout(() => setLastCommand(''), 2000);
            return;
          }
        }
      }

      // No command matched
      setLastCommand(language === 'en' ? `Unknown: "${transcript}"` : `未识别: "${transcript}"`);
      setTimeout(() => setLastCommand(''), 2000);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError(language === 'en' ? 'Microphone access denied' : '麦克风访问被拒绝');
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // Already started
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, getCommands]);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'zh' ? 'zh-CN' : 'en-US';
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    setError(null);
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      console.error('Failed to start recognition');
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    recognitionRef.current.stop();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    lastCommand,
    error,
    startListening,
    stopListening,
    toggleListening,
  };
}
