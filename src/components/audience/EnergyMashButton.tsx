import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame } from 'lucide-react';

interface EnergyMashButtonProps {
  onMash: () => void;
  energyScore: number;
}

export function EnergyMashButton({ onMash, energyScore }: EnergyMashButtonProps) {
  const [ripples, setRipples] = useState<number[]>([]);
  const [mashCount, setMashCount] = useState(0);

  const handleMash = () => {
    onMash();
    setMashCount(prev => prev + 1);
    setRipples(prev => [...prev, Date.now()]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 600);
  };

  const getButtonColor = () => {
    if (energyScore >= 80) return 'from-purple-500 via-pink-500 to-orange-400';
    if (energyScore >= 60) return 'from-purple-500 to-cyan-400';
    if (energyScore >= 40) return 'from-cyan-500 to-blue-500';
    return 'from-cyan-600 to-blue-600';
  };

  return (
    <div className="relative w-full">
      {/* Energy Level Indicator */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Crowd Energy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">
            {mashCount} taps
          </span>
          <span className="text-lg font-bold text-primary">{energyScore}%</span>
        </div>
      </div>

      {/* Energy Bar */}
      <div className="h-2 rounded-full bg-muted/50 mb-4 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getButtonColor()}`}
          animate={{ width: `${energyScore}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* The Mash Button */}
      <div className="relative">
        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map((id) => (
            <motion.div
              key={id}
              className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </AnimatePresence>

        <motion.button
          className={`
            relative w-full h-32 rounded-2xl
            bg-gradient-to-br ${getButtonColor()}
            flex flex-col items-center justify-center gap-2
            shadow-lg overflow-hidden
            active:scale-95 transition-transform
          `}
          whileTap={{ scale: 0.92 }}
          onClick={handleMash}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{
              opacity: [0, 0.2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Icon */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: energyScore > 60 ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {energyScore >= 70 ? (
              <Flame className="w-12 h-12 text-white drop-shadow-lg" />
            ) : (
              <Zap className="w-12 h-12 text-white drop-shadow-lg" />
            )}
          </motion.div>

          {/* Text */}
          <span className="text-xl font-bold text-white drop-shadow-md">
            {energyScore >= 80 ? '🔥 ON FIRE!' : energyScore >= 60 ? 'HYPE IT UP!' : 'BOOST ENERGY'}
          </span>

          {/* Particle Effects for high energy */}
          {energyScore >= 60 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/50"
                  style={{
                    left: `${15 + i * 15}%`,
                    bottom: 0,
                  }}
                  animate={{
                    y: [0, -80, -100],
                    opacity: [0.8, 0.4, 0],
                    scale: [1, 0.5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {/* Instructions */}
      <p className="text-xs text-muted-foreground text-center mt-3">
        Tap rapidly to boost the energy meter!
      </p>
    </div>
  );
}
