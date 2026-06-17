// Hero isometric network map — abstract SVG with animated cyan data packets
import { useEffect, useState } from "react";

const NODES = [
  { x: 160, y: 180, label: "PLC-01" },
  { x: 640, y: 170, label: "SCADA" },
  { x: 140, y: 420, label: "EMS" },
  { x: 660, y: 430, label: "IIoT GW" },
  { x: 400, y: 80, label: "HISTORIAN" },
  { x: 400, y: 520, label: "UTILITY" },
  { x: 220, y: 300, label: "RIO" },
  { x: 580, y: 300, label: "DCS" },
];

const PATHS = NODES.map((n, i) => ({
  id: `p${i}`,
  d: `M ${n.x} ${n.y} L 400 300`,
  nodeIdx: i,
  dur: 2.2 + (i % 4) * 0.5,
}));

export default function NetworkMap() {
  // Periodically pick a node to flash to simulate "burst" events
  const [burstIdx, setBurstIdx] = useState(-1);
  useEffect(() => {
    const t = setInterval(() => {
      setBurstIdx(Math.floor(Math.random() * NODES.length));
      // clear after a moment so the same node can re-trigger
      setTimeout(() => setBurstIdx(-1), 600);
    }, 1400);
    return () => clearInterval(t);
  }, []);

  // Drifting background particles (lightweight, deterministic positions)
  const particles = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    cx: 60 + (i * 53) % 680,
    cy: 60 + (i * 71) % 480,
    delay: (i % 7) * 0.4,
    dur: 6 + (i % 5),
  }));

  return (
    <svg
      data-testid="hero-network-map"
      viewBox="0 0 800 600"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="iso" x="0" y="0" width="40" height="23" patternUnits="userSpaceOnUse">
          <path d="M0 11.5 L40 11.5 M20 0 L20 23" stroke="#2B313A" strokeWidth="0.5" opacity="0.35" />
        </pattern>
        {/* Paths used by animateMotion */}
        {PATHS.map((p) => (
          <path key={p.id} id={p.id} d={p.d} fill="none" />
        ))}
      </defs>

      {/* iso ground plane */}
      <g transform="translate(400 320) skewX(-30) scale(1 0.55) translate(-400 -300)">
        <rect x="0" y="0" width="800" height="600" fill="url(#iso)" />
      </g>

      {/* Drifting background particles */}
      {particles.map((p) => (
        <circle key={p.id} r="1" fill="#00C2FF" opacity="0.35">
          <animate
            attributeName="cy"
            from={p.cy - 20}
            to={p.cy + 20}
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.6;0"
            dur={`${p.dur}s`}
            begin={`${p.delay}s`}
            repeatCount="indefinite"
          />
          <animate attributeName="cx" from={p.cx} to={p.cx} dur="1s" />
        </circle>
      ))}

      {/* Outer rings */}
      <circle cx="400" cy="300" r="240" stroke="#2B313A" strokeWidth="1" fill="none" strokeDasharray="2 4" />
      <circle cx="400" cy="300" r="160" stroke="#2B313A" strokeWidth="1" fill="none" strokeDasharray="2 4" />
      <circle cx="400" cy="300" r="240" stroke="#00C2FF" strokeWidth="0.5" fill="none" opacity="0.25">
        <animate attributeName="r" values="240;250;240" dur="6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.05;0.2" dur="6s" repeatCount="indefinite" />
      </circle>

      {/* Connecting paths (visible) + dashed flow */}
      {PATHS.map((p, i) => (
        <g key={p.id + "-vis"}>
          <path d={p.d} stroke="#2B313A" strokeWidth="1" fill="none" />
          <path
            d={p.d}
            stroke="#00C2FF"
            strokeWidth="1.25"
            fill="none"
            className="flow-path"
            style={{ animationDelay: `${i * 0.4}s` }}
            opacity="0.85"
          />
        </g>
      ))}

      {/* Animated data packets traveling along each path toward the TASC core */}
      {PATHS.map((p, i) => (
        <g key={p.id + "-pkt"}>
          <circle r="2.5" fill="#00C2FF" filter="url(#glow)">
            <animateMotion dur={`${p.dur}s`} repeatCount="indefinite" begin={`${(i * 0.3) % 2}s`}>
              <mpath href={`#${p.id}`} />
            </animateMotion>
          </circle>
          {/* Occasional larger burst packet */}
          <circle r="4" fill="#00C2FF" filter="url(#strongGlow)" opacity="0.9">
            <animateMotion dur={`${p.dur * 1.6}s`} repeatCount="indefinite" begin={`${(i * 0.7) % 3}s`}>
              <mpath href={`#${p.id}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;0.9;0.9;0"
              dur={`${p.dur * 1.6}s`}
              begin={`${(i * 0.7) % 3}s`}
              repeatCount="indefinite"
            />
          </circle>
        </g>
      ))}

      {/* Peripheral nodes */}
      {NODES.map((n, i) => {
        const isBursting = burstIdx === i;
        return (
          <g key={n.label}>
            <rect
              x={n.x - 18}
              y={n.y - 10}
              width="36"
              height="20"
              stroke="#2B313A"
              strokeWidth="1"
              fill="#0D1117"
            />
            <rect
              x={n.x - 18}
              y={n.y - 10}
              width="36"
              height="20"
              stroke="#00C2FF"
              strokeWidth="1"
              fill="none"
              opacity={isBursting ? 0.95 : 0.35}
              style={{
                transition: "opacity 0.2s ease",
                animation: `nodepulse 3s ${i * 0.25}s ease-in-out infinite`,
              }}
            />
            {/* Burst ring */}
            {isBursting && (
              <circle cx={n.x} cy={n.y} r="6" fill="none" stroke="#00C2FF" strokeWidth="1.2" opacity="0.9">
                <animate attributeName="r" from="6" to="26" dur="0.6s" />
                <animate attributeName="opacity" from="0.9" to="0" dur="0.6s" />
              </circle>
            )}
            <circle cx={n.x} cy={n.y} r={isBursting ? "3" : "2"} fill="#00C2FF" filter="url(#glow)" />
            <text
              x={n.x}
              y={n.y + 28}
              fontSize="8"
              fill="#E6EDF3"
              opacity="0.5"
              textAnchor="middle"
              fontFamily="Orbitron, sans-serif"
              letterSpacing="2"
            >
              {n.label}
            </text>
          </g>
        );
      })}

      {/* Central TASC node */}
      <g>
        <rect x="350" y="280" width="100" height="40" stroke="#00C2FF" strokeWidth="1.25" fill="#0D1117" />
        <rect x="346" y="276" width="108" height="48" stroke="#00C2FF" strokeWidth="0.5" fill="none" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
        </rect>
        <text x="400" y="298" textAnchor="middle" fontSize="10" fill="#00C2FF" fontFamily="Orbitron, sans-serif" letterSpacing="3">
          TASC
        </text>
        <text x="400" y="312" textAnchor="middle" fontSize="6" fill="#E6EDF3" opacity="0.6" fontFamily="Orbitron, sans-serif" letterSpacing="2">
          CORE //
        </text>
      </g>

      <style>{`
        @keyframes nodepulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </svg>
  );
}
