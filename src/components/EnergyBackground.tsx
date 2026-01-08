import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface EnergyBackgroundProps {
  energyScore: number; // 0-100
  children: ReactNode;
  showAcknowledgeFlash?: boolean;
}

export function EnergyBackground({ 
  energyScore, 
  children, 
  showAcknowledgeFlash = false 
}: EnergyBackgroundProps) {
  // Determine gradient based on energy level
  const getGradientColors = () => {
    if (energyScore < 30) {
      // Low energy: Deep slate/charcoal
      return {
        from: 'hsl(222, 20%, 7%)',
        via: 'hsl(222, 18%, 10%)',
        to: 'hsl(222, 16%, 8%)',
      };
    } else if (energyScore < 60) {
      // Medium energy: Subtle purple hints
      return {
        from: 'hsl(260, 25%, 12%)',
        via: 'hsl(222, 20%, 10%)',
        to: 'hsl(280, 20%, 10%)',
      };
    } else if (energyScore < 80) {
      // High energy: Purple/blue glow
      return {
        from: 'hsl(260, 40%, 15%)',
        via: 'hsl(270, 35%, 12%)',
        to: 'hsl(185, 30%, 12%)',
      };
    } else {
      // Peak energy: Electric purple/neon blue
      return {
        from: 'hsl(270, 50%, 18%)',
        via: 'hsl(260, 45%, 15%)',
        to: 'hsl(185, 45%, 15%)',
      };
    }
  };

  const colors = getGradientColors();
  const pulseIntensity = Math.min(energyScore / 100, 1);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Base gradient layer */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.via} 50%, ${colors.to} 100%)`,
        }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Pulsing energy layer */}
      {energyScore > 40 && (
        <motion.div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at center, hsl(270, 60%, 25%) 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.1 * pulseIntensity, 0.3 * pulseIntensity, 0.1 * pulseIntensity],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2 - (energyScore / 100),
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* High energy glow spots */}
      {energyScore > 60 && (
        <>
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 z-0"
            style={{
              background: 'radial-gradient(circle, hsl(185, 70%, 50%, 0.15) 0%, transparent 60%)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              x: [0, 30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-96 h-96 z-0"
            style={{
              background: 'radial-gradient(circle, hsl(270, 60%, 50%, 0.12) 0%, transparent 60%)',
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              x: [0, -20, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
        </>
      )}

      {/* Peak energy electric arcs */}
      {energyScore > 80 && (
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(45deg, transparent 48%, hsl(185, 80%, 60%, 0.1) 50%, transparent 52%),
              linear-gradient(-45deg, transparent 48%, hsl(270, 70%, 60%, 0.08) 50%, transparent 52%)
            `,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Producer Acknowledge Flash */}
      {showAcknowledgeFlash && (
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0, backgroundColor: 'hsl(185, 70%, 50%)' }}
          animate={{ opacity: [0, 0.6, 0], backgroundColor: ['hsl(185, 70%, 50%)', 'hsl(185, 70%, 60%)', 'hsl(185, 70%, 50%)'] }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
