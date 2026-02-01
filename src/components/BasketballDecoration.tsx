/**
 * Basketball court decoration component
 * Displays a minimalist SVG of a basketball court (top-down view)
 * for visual enhancement at the bottom of the scoreboard
 */
export function BasketballDecoration() {
  return (
    <div
      className="relative h-12 sm:h-16 md:h-20 lg:h-24 overflow-hidden
                 pointer-events-none select-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 100"
        className="w-full h-full opacity-10 sm:opacity-15"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Court outline */}
        <rect
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          x="50"
          y="10"
          width="1100"
          height="80"
          rx="4"
        />

        {/* Center line */}
        <line
          stroke="var(--color-accent)"
          strokeWidth="2"
          x1="600"
          y1="10"
          x2="600"
          y2="90"
        />

        {/* Center circle */}
        <circle
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          cx="600"
          cy="50"
          r="25"
        />

        {/* Three-point arc (left) */}
        <path
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          d="M50 25 L150 25 Q220 50 150 75 L50 75"
        />

        {/* Three-point arc (right) */}
        <path
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          d="M1150 25 L1050 25 Q980 50 1050 75 L1150 75"
        />

        {/* Paint area (left) */}
        <rect
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          x="50"
          y="30"
          width="120"
          height="40"
        />

        {/* Free throw circle (left) - dashed */}
        <circle
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          cx="170"
          cy="50"
          r="20"
          strokeDasharray="4,4"
        />

        {/* Paint area (right) */}
        <rect
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          x="1030"
          y="30"
          width="120"
          height="40"
        />

        {/* Free throw circle (right) - dashed */}
        <circle
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          cx="1030"
          cy="50"
          r="20"
          strokeDasharray="4,4"
        />

        {/* Basket (left) */}
        <circle
          fill="var(--color-accent)"
          cx="70"
          cy="50"
          r="5"
          opacity="0.5"
        />

        {/* Basket (right) */}
        <circle
          fill="var(--color-accent)"
          cx="1130"
          cy="50"
          r="5"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
