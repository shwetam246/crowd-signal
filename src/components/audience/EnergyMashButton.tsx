import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Flame, Sparkles } from 'lucide-react';

interface EnergyMashButtonProps {
  onMash: () => void;
  energyScore: number;
}

interface FloatingNumber {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface Particle {
  id: number;
  angle: number;
}

export function EnergyMashButton({ onMash, energyScore }: EnergyMashButtonProps) {
  const [ripples, setRipples] = useState<number[]>([]);
  const [mashCount, setMashCount] = useState(0);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHaptic, setIsHaptic] = useState(false);

  const handleMash = useCallback((e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    onMash();
    setMashCount(prev => prev + 1);
    
    // Add ripple
    const rippleId = Date.now();
    setRipples(prev => [...prev, rippleId]);
    setTimeout(() => setRipples(prev => prev.filter(r => r !== rippleId)), 600);
    
    // Get click position for floating number
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX ?? rect.left + rect.width / 2;
      clientY = e.touches[0]?.clientY ?? rect.top + rect.height / 2;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Add floating +3 number
    const floatId = Date.now() + Math.random();
    setFloatingNumbers(prev => [...prev, { id: floatId, x, y, value: 3 }]);
    setTimeout(() => setFloatingNumbers(prev => prev.filter(f => f.id !== floatId)), 800);
    
    // Add particle burst at high energy
    if (energyScore >= 50) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i + Math.random(),
        angle: (i / 8) * 360,
      }));
      setParticles(prev => [...prev, ...newParticles]);
      setTimeout(() => setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id))), 600);
    }
    
    // Haptic simulation
    setIsHaptic(true);
    setTimeout(() => setIsHaptic(false), 100);
    
    // Try to trigger device vibration
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [onMash, energyScore]);

  const getButtonGradient = () => {
    if (energyScore >= 80) return 'from-pink-500 via-purple-500 to-orange-400';
    if (energyScore >= 60) return 'from-purple-500 via-violet-500 to-cyan-400';
    if (energyScore >= 40) return 'from-violet-500 via-blue-500 to-cyan-400';
    return 'from-cyan-500 via-blue-500 to-indigo-500';
  };

  const getEnergyBarGradient = () => {
    if (energyScore >= 80) return 'from-orange-400 via-pink-500 to-purple-500';
    if (energyScore >= 60) return 'from-cyan-400 via-violet-500 to-purple-500';
    if (energyScore >= 40) return 'from-blue-400 via-cyan-400 to-violet-500';
    return 'from-blue-500 via-cyan-500 to-teal-400';
  };

  const getButtonText = () => {
    if (energyScore >= 80) return { emoji: '🔥', text: 'ON FIRE!' };
    if (energyScore >= 60) return { emoji: '⚡', text: 'HYPE IT UP!' };
    if (energyScore >= 40) return { emoji: '🚀', text: 'KEEP GOING!' };
    return { emoji: '💫', text: 'BOOST ENERGY' };
  };

  const buttonContent = getButtonText();

  return (
    <div className="relative w-full">
      {/* Energy Level Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: energyScore >= 60 ? [1, 1.2, 1] : 1,
              rotate: energyScore >= 80 ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.5, repeat: energyScore >= 60 ? Infinity : 0, repeatDelay: 0.5 }}
          >
            <Zap className="w-5 h-5 text-primary" />
          </motion.div>
          <span className="text-sm font-medium">Crowd Energy</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">
            {mashCount} taps
          </span>
          <motion.span 
            className="text-xl font-bold text-primary"
            animate={{ scale: isHaptic ? 1.2 : 1 }}
            transition={{ duration: 0.1 }}
          >
            {energyScore}%
          </motion.span>
        </div>
      </div>

      {/* Energy Bar - Enhanced */}
      <div className="h-3 rounded-full bg-muted/50 mb-5 overflow-hidden relative">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${getEnergyBarGradient()}`}
          animate={{ width: `${energyScore}%` }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        />
        {/* Shimmer effect at high energy */}
        {energyScore >= 60 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      {/* The Mash Button - Larger and more prominent */}
      <div className="relative">
        {/* Ambient glow at high energy */}
        {energyScore >= 60 && (
          <motion.div
            className="absolute -inset-2 rounded-3xl opacity-50 blur-xl"
            style={{
              background: `linear-gradient(135deg, hsl(270, 60%, 50%), hsl(185, 70%, 50%))`,
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Ripple Effects */}
        <AnimatePresence>
          {ripples.map((id) => (
            <motion.div
              key={id}
              className="absolute inset-0 rounded-3xl border-2 border-white pointer-events-none"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ))}
        </AnimatePresence>

        {/* Floating +3 numbers */}
        <AnimatePresence>
          {floatingNumbers.map((float) => (
            <motion.div
              key={float.id}
              className="absolute pointer-events-none text-xl font-bold text-white drop-shadow-lg float-up"
              style={{ left: float.x - 15, top: float.y - 15 }}
              initial={{ opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 0, y: -60, scale: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              +{float.value}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Particle burst */}
        <AnimatePresence>
          {particles.map((particle) => {
            const rad = (particle.angle * Math.PI) / 180;
            const tx = Math.cos(rad) * 80;
            const ty = Math.sin(rad) * 80;
            return (
              <motion.div
                key={particle.id}
                className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-white pointer-events-none"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            );
          })}
        </AnimatePresence>

        <motion.button
          className={`
            relative w-full h-36 rounded-3xl
            bg-gradient-to-br ${getButtonGradient()}
            flex flex-col items-center justify-center gap-3
            shadow-2xl overflow-hidden
            ${isHaptic ? 'haptic-pulse' : ''}
          `}
          whileTap={{ scale: 0.92 }}
          onClick={handleMash}
          onTouchStart={handleMash}
        >
          {/* Internal glow */}
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Icon with animation */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: energyScore >= 70 ? [0, 8, -8, 0] : 0,
            }}
            transition={{
              duration: energyScore >= 60 ? 0.6 : 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {energyScore >= 80 ? (
              <Flame className="w-14 h-14 text-white drop-shadow-lg" />
            ) : energyScore >= 60 ? (
              <Sparkles className="w-14 h-14 text-white drop-shadow-lg" />
            ) : (
              <Zap className="w-14 h-14 text-white drop-shadow-lg" />
            )}
          </motion.div>

          {/* Text */}
          <span className="text-2xl font-black text-white drop-shadow-lg tracking-wide">
            {buttonContent.emoji} {buttonContent.text}
          </span>

          {/* Rising particles for high energy */}
          {energyScore >= 50 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-white/60"
                  style={{
                    left: `${10 + i * 12}%`,
                    bottom: -10,
                  }}
                  animate={{
                    y: [0, -120, -150],
                    opacity: [0.8, 0.4, 0],
                    scale: [1, 0.6, 0],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {/* Instructions */}
      <p className="text-sm text-muted-foreground text-center mt-4">
        Tap rapidly to boost the energy meter! 🎉
      </p>
    </div>
  );
}