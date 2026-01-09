import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useMemo } from 'react';

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
  // 5-tier energy system with more dramatic color shifts
  const { colors, tier } = useMemo(() => {
    if (energyScore < 20) {
      return {
        tier: 1,
        colors: {
          from: 'hsl(222, 20%, 7%)',
          via: 'hsl(222, 18%, 9%)',
          to: 'hsl(222, 16%, 8%)',
          glow1: 'hsl(222, 30%, 15%)',
          glow2: 'hsl(222, 25%, 12%)',
        }
      };
    } else if (energyScore < 40) {
      return {
        tier: 2,
        colors: {
          from: 'hsl(260, 25%, 10%)',
          via: 'hsl(240, 20%, 9%)',
          to: 'hsl(270, 22%, 10%)',
          glow1: 'hsl(260, 40%, 20%)',
          glow2: 'hsl(270, 35%, 18%)',
        }
      };
    } else if (energyScore < 60) {
      return {
        tier: 3,
        colors: {
          from: 'hsl(270, 35%, 13%)',
          via: 'hsl(260, 30%, 11%)',
          to: 'hsl(280, 30%, 12%)',
          glow1: 'hsl(270, 50%, 25%)',
          glow2: 'hsl(185, 40%, 22%)',
        }
      };
    } else if (energyScore < 80) {
      return {
        tier: 4,
        colors: {
          from: 'hsl(270, 45%, 16%)',
          via: 'hsl(260, 40%, 14%)',
          to: 'hsl(185, 35%, 13%)',
          glow1: 'hsl(270, 60%, 30%)',
          glow2: 'hsl(185, 50%, 28%)',
        }
      };
    } else {
      return {
        tier: 5,
        colors: {
          from: 'hsl(280, 50%, 18%)',
          via: 'hsl(270, 48%, 16%)',
          to: 'hsl(185, 45%, 15%)',
          glow1: 'hsl(270, 70%, 40%)',
          glow2: 'hsl(185, 70%, 35%)',
        }
      };
    }
  }, [energyScore]);

  const pulseSpeed = 2 - (energyScore / 100) * 1.2; // Faster pulse at higher energy

  return (
    <div className={`relative min-h-screen overflow-hidden ${showAcknowledgeFlash ? 'screen-shake' : ''}`}>
      {/* Base gradient layer - faster transitions */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.via} 50%, ${colors.to} 100%)`,
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      {/* Tier 2+: Subtle purple ambient glow */}
      <AnimatePresence>
        {tier >= 2 && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${colors.glow1} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Tier 3+: Pulsing energy layer */}
      <AnimatePresence>
        {tier >= 3 && (
          <motion.div
            className="absolute inset-0 z-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.02, 1],
            }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(ellipse at center, ${colors.glow1} 0%, transparent 60%)`,
            }}
            transition={{
              duration: pulseSpeed,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </AnimatePresence>

      {/* Tier 4+: Dual glow spots */}
      <AnimatePresence>
        {tier >= 4 && (
          <>
            <motion.div
              className="absolute -top-20 -right-20 w-[500px] h-[500px] z-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                x: [0, 40, 0],
                y: [0, 30, 0],
              }}
              exit={{ opacity: 0 }}
              style={{
                background: `radial-gradient(circle, ${colors.glow2} 0%, transparent 50%)`,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -bottom-20 -left-20 w-[500px] h-[500px] z-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                x: [0, -30, 0],
                y: [0, -40, 0],
              }}
              exit={{ opacity: 0 }}
              style={{
                background: `radial-gradient(circle, ${colors.glow1} 0%, transparent 50%)`,
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
      </AnimatePresence>

      {/* Tier 5: Electric arcs / lightning streaks */}
      <AnimatePresence>
        {tier >= 5 && (
          <>
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none lightning-flicker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background: `
                  linear-gradient(45deg, transparent 46%, hsl(185, 90%, 60%, 0.12) 50%, transparent 54%),
                  linear-gradient(-45deg, transparent 46%, hsl(270, 80%, 60%, 0.1) 50%, transparent 54%),
                  linear-gradient(90deg, transparent 48%, hsl(185, 100%, 70%, 0.08) 50%, transparent 52%)
                `,
              }}
            />
            {/* Neon border glow */}
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none"
              animate={{
                boxShadow: [
                  'inset 0 0 60px hsl(185, 100%, 60%, 0.1)',
                  'inset 0 0 100px hsl(270, 80%, 60%, 0.15)',
                  'inset 0 0 60px hsl(185, 100%, 60%, 0.1)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Producer Acknowledge Flash - Enhanced */}
      <AnimatePresence>
        {showAcknowledgeFlash && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [1, 1.02, 1],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              background: 'radial-gradient(ellipse at center, hsl(185, 80%, 55%) 0%, hsl(185, 70%, 45%, 0.6) 50%, transparent 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}