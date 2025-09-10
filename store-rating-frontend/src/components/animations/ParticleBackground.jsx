import React, { useMemo } from "react";

const random = (min, max) => Math.random() * (max - min) + min;

export default function ParticleBackground({
  variant = "floating",
  particleCount = 40,
  colors = ["#667eea", "#764ba2", "#f093fb"],
  interactive = false,
  style,
  className
}) {
  const particles = useMemo(() => new Array(particleCount).fill(0).map(() => ({
    left: `${random(0,100)}%`,
    top: `${random(0,100)}%`,
    size: `${Math.round(random(6,18))}px`,
    opacity: (random(0.12,0.9)).toFixed(2),
    color: colors[Math.floor(Math.random()*colors.length)],
    duration: `${Math.round(random(8,24))}s`,
    delay: `${Math.round(random(0,6))}s`
  })), [particleCount, colors.join(",")]);

  return (
    <div aria-hidden className={className} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: interactive ? "auto" : "none", ...style }}>
      {particles.map((p,i) => (
        <div key={i} style={{
          position: "absolute",
          left: p.left,
          top: p.top,
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          background: p.color,
          opacity: p.opacity,
          transform: "translate(-50%,-50%)",
          filter: "blur(6px)",
          animation: `sr-particle-float ${p.duration} linear infinite`,
          animationDelay: p.delay
        }} />
      ))}

      <style>{`
        @keyframes sr-particle-float {
          0% { transform: translate(-50%,-50%) translateY(0) scale(1); }
          50% { transform: translate(-50%,-50%) translateY(-18px) scale(1.02); }
          100% { transform: translate(-50%,-50%) translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
