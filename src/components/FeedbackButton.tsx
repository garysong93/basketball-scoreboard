import { useGameStore } from '../stores/gameStore';

export function FeedbackButton() {
  const { language } = useGameStore();

  const label = language === 'zh' ? '反馈' : 'Feedback';

  return (
    <button
      data-tally-open="D4zPNR"
      data-tally-emoji-text="👋"
      data-tally-emoji-animation="wave"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
