import React, { useRef, useEffect, useState } from 'react';
import styles from './InteractiveBackground.module.css';
import { useTheme } from '../../context/ThemeContext';

// Define structure for interaction points
interface InteractionPoint {
    x: number;
    y: number;
    timestamp: number; // Needed for highlight fade
    // No isAmbient flag needed if we don't add random pulses for now
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const interactions = useRef<InteractionPoint[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // --- Configuration ---
  const gridSpacing = 15;       // Dense grid (small boxes)
  const baseLineWidth = 0.2;    // Very subtle base lines
  // Interaction effect parameters
  const interactionRadius = 110; // How far the highlight spreads
  const clickEffectDuration = 800; // Duration for highlight fade (milliseconds)
  // Highlight parameters
  const highlightLineWidthFactor = 5; // Max thickness increase factor (relative to base)

  // --- Resize Handler ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setContext(ctx);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // --- Mouse/Touch Handlers ---
  useEffect(() => {
    const handleInteraction = (event: MouseEvent | TouchEvent) => {
      let interactionX, interactionY;
      if (event instanceof MouseEvent) {
        interactionX = event.clientX;
        interactionY = event.clientY;
      } else if (event.touches && event.touches.length > 0) {
        interactionX = event.touches[0].clientX;
        interactionY = event.touches[0].clientY;
      } else {
        return;
      }
      interactions.current.push({ x: interactionX, y: interactionY, timestamp: Date.now() });
      if (interactions.current.length > 15) {
        interactions.current.shift();
      }
    };

    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // --- Animation Loop ---
  useEffect(() => {
    if (!context || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;

    const bodyStyles = getComputedStyle(document.body);
    const lineColor = bodyStyles.getPropertyValue('--color-border').trim() || '#e5e7eb';
    const interactionColor = bodyStyles.getPropertyValue('--color-primary').trim() || '#f97316';

    const animate = () => {
      const now = Date.now();
      // Remove old interactions
      interactions.current = interactions.current.filter(
          (interaction) => now - interaction.timestamp < clickEffectDuration
      );

      context.clearRect(0, 0, width, height);

      // Helper to get highlight effect at a specific coordinate
      const getHighlightFactor = (x: number, y: number): number => {
          let totalHighlight = 0;
          interactions.current.forEach(interaction => {
              const dx = interaction.x - x;
              const dy = interaction.y - y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < interactionRadius) {
                  const timeElapsed = now - interaction.timestamp;
                  const progress = Math.max(0, 1 - timeElapsed / clickEffectDuration);
                  // Use easing for smoother fade
                  const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2; // easeInOutQuad
                  totalHighlight += (1 - distance / interactionRadius) * easedProgress;
              }
          });
          return Math.min(1, totalHighlight); // Clamp
      };

      // Draw horizontal lines (segmented)
      for (let y = gridSpacing / 2; y < height + gridSpacing; y += gridSpacing) {
          context.beginPath();
          context.moveTo(0, y);
          for (let x = gridSpacing / 2; x < width + gridSpacing; x += gridSpacing) {
              // Calculate highlight at the midpoint of the segment for smoother transitions
              const midX = x - gridSpacing / 2;
              const highlight = getHighlightFactor(midX, y);
              const currentLineWidth = baseLineWidth + (baseLineWidth * highlightLineWidthFactor * highlight);
              const currentColor = `color-mix(in srgb, ${interactionColor} ${highlight * 100}%, ${lineColor})`;

              context.lineWidth = Math.max(0.1, currentLineWidth);
              context.strokeStyle = currentColor;
              context.lineTo(x, y);
              context.stroke();
              context.beginPath(); // Start new path for next segment
              context.moveTo(x, y);
          }
      }

      // Draw vertical lines (segmented)
      for (let x = gridSpacing / 2; x < width + gridSpacing; x += gridSpacing) {
          context.beginPath();
          context.moveTo(x, 0);
           for (let y = gridSpacing / 2; y < height + gridSpacing; y += gridSpacing) {
               const midY = y - gridSpacing / 2;
               const highlight = getHighlightFactor(x, midY);
               const currentLineWidth = baseLineWidth + (baseLineWidth * highlightLineWidthFactor * highlight);
               const currentColor = `color-mix(in srgb, ${interactionColor} ${highlight * 100}%, ${lineColor})`;

               context.lineWidth = Math.max(0.1, currentLineWidth);
               context.strokeStyle = currentColor;
               context.lineTo(x, y);
               context.stroke();
               context.beginPath();
               context.moveTo(x, y);
           }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate(); // Start animation

    return () => { // Cleanup
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [context, theme, gridSpacing, interactionRadius, clickEffectDuration, highlightLineWidthFactor]); // Updated dependencies

  return <canvas ref={canvasRef} className={styles.canvasBackground} />;
};

export default InteractiveBackground;