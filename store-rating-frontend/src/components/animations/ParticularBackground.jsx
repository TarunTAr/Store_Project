import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = ({
  particleCount = 50,
  particleColor = '#667eea',
  particleSize = 2,
  speed = 0.5,
  connectionDistance = 150,
  connectionOpacity = 0.3,
  interactive = true,
  mouseRadius = 200,
  className = '',
  style = {},
  variant = 'default', // default, stars, bubbles, network, floating, matrix
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
  density = 'medium', // low, medium, high
  animation = 'continuous', // continuous, pulse, wave
  responsive = true,
  ...props
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Density settings
  const densitySettings = {
    low: { count: Math.floor(particleCount * 0.5), connections: false },
    medium: { count: particleCount, connections: true },
    high: { count: Math.floor(particleCount * 1.5), connections: true }
  };

  const currentSettings = densitySettings[density];

  // Particle class
  class Particle {
    constructor(canvas, variant = 'default') {
      this.canvas = canvas;
      this.variant = variant;
      this.reset();
      this.vx = (Math.random() - 0.5) * speed;
      this.vy = (Math.random() - 0.5) * speed;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.originalSize = particleSize + Math.random() * 2;
      this.size = this.originalSize;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.02;
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
    }

    update() {
      switch (this.variant) {
        case 'floating':
          this.updateFloating();
          break;
        case 'bubbles':
          this.updateBubbles();
          break;
        case 'stars':
          this.updateStars();
          break;
        case 'matrix':
          this.updateMatrix();
          break;
        default:
          this.updateDefault();
      }

      // Boundary checks
      this.handleBoundaries();

      // Mouse interaction
      if (interactive) {
        this.handleMouseInteraction();
      }
    }

    updateDefault() {
      this.x += this.vx;
      this.y += this.vy;
    }

    updateFloating() {
      this.angle += this.angleSpeed;
      this.x += Math.cos(this.angle) * 0.5;
      this.y += Math.sin(this.angle) * 0.3;
      this.size = this.originalSize + Math.sin(this.angle * 2) * 0.5;
    }

    updateBubbles() {
      this.y -= Math.abs(this.vy);
      this.x += this.vx * 0.5;
      this.size += 0.01;
      this.opacity -= 0.001;
      
      if (this.y < -10 || this.opacity <= 0) {
        this.y = this.canvas.height + 10;
        this.size = this.originalSize;
        this.opacity = Math.random() * 0.8 + 0.2;
      }
    }

    updateStars() {
      this.angle += 0.01;
      this.opacity = 0.5 + Math.sin(this.angle) * 0.5;
      this.size = this.originalSize + Math.sin(this.angle * 2) * 1;
    }

    updateMatrix() {
      this.y += this.vy * 2;
      this.opacity = Math.max(0, this.opacity - 0.005);
      
      if (this.y > this.canvas.height || this.opacity <= 0) {
        this.y = -10;
        this.opacity = 1;
      }
    }

    handleBoundaries() {
      if (this.variant === 'bubbles' || this.variant === 'matrix') return;

      if (this.x < 0 || this.x > this.canvas.width) {
        this.vx *= -1;
        this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      }
      if (this.y < 0 || this.y > this.canvas.height) {
        this.vy *= -1;
        this.y = Math.max(0, Math.min(this.canvas.height, this.y));
      }
    }

    handleMouseInteraction() {
      const dx = mouseRef.current.x - this.x;
      const dy = mouseRef.current.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouseRadius) {
        const force = (mouseRadius - distance) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        
        this.vx -= Math.cos(angle) * force * 0.1;
        this.vy -= Math.sin(angle) * force * 0.1;
        this.size = this.originalSize * (1 + force * 0.5);
        this.opacity = Math.min(1, this.opacity + force * 0.3);
      } else {
        this.size += (this.originalSize - this.size) * 0.1;
        this.opacity += (0.6 - this.opacity) * 0.05;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      switch (this.variant) {
        case 'stars':
          this.drawStar(ctx);
          break;
        case 'bubbles':
          this.drawBubble(ctx);
          break;
        case 'matrix':
          this.drawMatrix(ctx);
          break;
        default:
          this.drawDefault(ctx);
      }
      
      ctx.restore();
    }

    drawDefault(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    drawStar(ctx) {
      const spikes = 5;
      const outerRadius = this.size * 2;
      const innerRadius = outerRadius * 0.4;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.closePath();
      ctx.fill();
    }

    drawBubble(ctx) {
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size
      );
      gradient.addColorStop(0, this.color + '80');
      gradient.addColorStop(0.7, this.color + '40');
      gradient.addColorStop(1, this.color + '00');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = '#ffffff40';
      ctx.beginPath();
      ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    drawMatrix(ctx) {
      ctx.fillStyle = this.color;
      ctx.font = `${this.size * 6}px monospace`;
      ctx.textAlign = 'center';
      const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZあいうえおかきくけこ';
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, this.x, this.y);
    }
  }

  // Initialize particles
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = [];
    for (let i = 0; i < currentSettings.count; i++) {
      particlesRef.current.push(new Particle(canvas, variant));
    }
  };

  // Draw connections between particles
  const drawConnections = (ctx, particles) => {
    if (!currentSettings.connections) return;

    ctx.strokeStyle = particleColor + Math.floor(connectionOpacity * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * connectionOpacity;
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update();
      particle.draw(ctx);
    });

    // Draw connections
    drawConnections(ctx, particlesRef.current);

    animationRef.current = requestAnimationFrame(animate);
  };

  // Handle mouse movement
  const handleMouseMove = (event) => {
    if (!interactive) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  // Handle resize
  const handleResize = () => {
    if (!responsive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setDimensions({
      width: rect.width,
      height: rect.height
    });

    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  // Initialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();
    initParticles();
    animate();

    // Event listeners
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }
    
    if (responsive) {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
      
      if (responsive) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [variant, particleCount, density]);

  // Memoized canvas style
  const canvasStyle = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: interactive ? 'auto' : 'none',
    zIndex: -1,
    ...style
  }), [interactive, style]);

  return (
    <motion.div
      className={`particle-background ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        style={canvasStyle}
        width={dimensions.width}
        height={dimensions.height}
      />
    </motion.div>
  );
};

// Preset particle backgrounds
export const StarfieldBackground = (props) => (
  <ParticleBackground
    variant="stars"
    particleCount={100}
    colors={['#ffffff', '#ffeb3b', '#2196f3']}
    speed={0.2}
    interactive={false}
    connectionDistance={0}
    {...props}
  />
);

export const BubblesBackground = (props) => (
  <ParticleBackground
    variant="bubbles"
    particleCount={30}
    colors={['#667eea', '#764ba2', '#f093fb']}
    speed={1}
    interactive={true}
    connectionDistance={0}
    {...props}
  />
);

export const MatrixBackground = (props) => (
  <ParticleBackground
    variant="matrix"
    particleCount={50}
    colors={['#00ff00', '#00aa00']}
    speed={2}
    interactive={false}
    connectionDistance={0}
    {...props}
  />
);

export const NetworkBackground = (props) => (
  <ParticleBackground
    variant="default"
    particleCount={80}
    colors={['#667eea']}
    speed={0.5}
    interactive={true}
    connectionDistance={120}
    connectionOpacity={0.4}
    {...props}
  />
);

export const FloatingBackground = (props) => (
  <ParticleBackground
    variant="floating"
    particleCount={40}
    colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
    speed={0.3}
    interactive={true}
    connectionDistance={100}
    connectionOpacity={0.2}
    {...props}
  />
);

export default ParticleBackground;
