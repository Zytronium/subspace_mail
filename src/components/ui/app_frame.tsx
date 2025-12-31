import { twMerge } from "tailwind-merge";

function App_frame({
  className,
  ...props
}: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      className={twMerge(["absolute inset-0 size-full pointer-events-none", className])}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
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
        d="M 100%,0 L calc(100% - 200px),0 L calc(100% - 220px),20 L calc(100% - 220px),100"
        stroke="rgba(139, 92, 246, 0.4)"
        strokeWidth="2"
        fill="none"
      />

      {/* Corner accents - bottom left */}
      <path
        d="M 0,100% L 0,calc(100% - 200px) L 20,calc(100% - 220px) L 100,calc(100% - 220px)"
        stroke="rgba(59, 130, 246, 0.4)"
        strokeWidth="2"
        fill="none"
      />

      {/* Corner accents - bottom right */}
      <path
        d="M 100%,100% L 100%,calc(100% - 200px) L calc(100% - 20px),calc(100% - 220px) L calc(100% - 100px),calc(100% - 220px)"
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
  );
}

export { App_frame };
