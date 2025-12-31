import { twMerge } from "tailwind-merge";

function App_frame({
  className,
  children,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div className={twMerge(["relative h-screen w-screen flex flex-col overflow-hidden bg-slate-950", className])} {...props}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg
          className="size-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1000 1000"
        >
      <defs>
        {/* Gradients */}
        <linearGradient id="blueGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
          <stop offset="50%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
        </linearGradient>

        <linearGradient id="purpleGlow" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
          <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
        </linearGradient>

        {/* Pattern for grid */}
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5"/>
        </pattern>
      </defs>

      {/* Base grid pattern */}
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

      {/* Corner accents - top left */}
      <path
        d="M 0,0 L 200,0 L 220,20 L 220,100"
        stroke="rgba(59, 130, 246, 0.4)"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="220" cy="20" r="4" fill="rgba(59, 130, 246, 0.8)" />

      {/* Corner accents - top right */}
      <path
        d="M 1000,0 L 800,0 L 780,20 L 780,100"
        stroke="rgba(139, 92, 246, 0.4)"
        strokeWidth="2"
        fill="none"
      />

      {/* Corner accents - bottom left */}
      <path
        d="M 0,1000 L 0,800 L 20,780 L 100,780"
        stroke="rgba(59, 130, 246, 0.4)"
        strokeWidth="2"
        fill="none"
      />

      {/* Corner accents - bottom right */}
      <path
        d="M 1000,1000 L 1000,800 L 980,780 L 900,780"
        stroke="rgba(139, 92, 246, 0.4)"
        strokeWidth="2"
        fill="none"
      />

      {/* Diagonal tech lines */}
      <line
        x1="0"
        y1="30%"
        x2="20%"
        y2="30%"
        stroke="rgba(59, 130, 246, 0.3)"
        strokeWidth="1"
        strokeDasharray="10 5"
      />

      <line
        x1="80%"
        y1="70%"
        x2="100%"
        y2="70%"
        stroke="rgba(139, 92, 246, 0.3)"
        strokeWidth="1"
        strokeDasharray="10 5"
      />

      {/* Center focal points */}
      <circle cx="50%" cy="30%" r="3" fill="rgba(59, 130, 246, 0.6)">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="50%" cy="70%" r="3" fill="rgba(139, 92, 246, 0.6)">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="3s"
          begin="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Vertical scanning lines */}
      <line x1="25%" y1="0" x2="25%" y2="100%" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1">
        <animate
          attributeName="opacity"
          values="0.1;0.3;0.1"
          dur="4s"
          repeatCount="indefinite"
        />
      </line>

      <line x1="75%" y1="0" x2="75%" y2="100%" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1">
        <animate
          attributeName="opacity"
          values="0.1;0.3;0.1"
          dur="4s"
          begin="2s"
          repeatCount="indefinite"
        />
      </line>

      {/* Horizontal scanning lines */}
      <line x1="0" y1="33%" x2="100%" y2="33%" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="1">
        <animate
          attributeName="opacity"
          values="0.1;0.3;0.1"
          dur="5s"
          repeatCount="indefinite"
        />
      </line>

      <line x1="0" y1="66%" x2="100%" y2="66%" stroke="rgba(139, 92, 246, 0.15)" strokeWidth="1">
        <animate
          attributeName="opacity"
          values="0.1;0.3;0.1"
          dur="5s"
          begin="2.5s"
          repeatCount="indefinite"
        />
      </line>
      </svg>
      </div>
      <div className="relative z-10 size-full overflow-hidden flex flex-col bg-transparent">
        {children}
      </div>
    </div>
  );
}

export { App_frame };
