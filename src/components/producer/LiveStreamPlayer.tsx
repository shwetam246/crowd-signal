import { motion } from 'framer-motion';
import { Video, Volume2, Wifi, Users, Mic, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveStreamPlayerProps {
  viewerCount?: number;
  isLive?: boolean;
  energyScore?: number;
}

export function LiveStreamPlayer({ 
  viewerCount = 1247, 
  isLive = true,
  energyScore = 0
}: LiveStreamPlayerProps) {
  return (
    <div className="studio-panel h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="studio-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Live Stream</span>
        </div>
        <div className="flex items-center gap-3">
          {isLive && (
            <motion.div 
              className="flex items-center gap-1.5"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-xs font-medium text-destructive">LIVE</span>
            </motion.div>
          )}
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">{viewerCount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 16:9 Video Container */}
      <div className="relative aspect-video bg-studio-surface">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
              <Camera className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Video Stream</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Connect OBS / Streaming Software</p>
          </div>
        </div>
        
        {/* Connection indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
          <Wifi className="w-3 h-3 text-success" />
          <span className="text-xs font-mono text-success">Connected</span>
        </div>

        {/* Live Controls Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" className="h-8 gap-1.5 bg-background/80 backdrop-blur-sm">
              <Mic className="w-3.5 h-3.5" />
              <span className="text-xs">Mic On</span>
            </Button>
            <Button size="sm" variant="secondary" className="h-8 gap-1.5 bg-background/80 backdrop-blur-sm">
              <Camera className="w-3.5 h-3.5" />
              <span className="text-xs">Cam On</span>
            </Button>
          </div>
        </div>

        {/* Energy Indicator Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/50">
          <motion.div
            className="h-full rounded-r-full"
            style={{
              background: energyScore > 60 
                ? 'linear-gradient(90deg, hsl(var(--primary)), hsl(270, 60%, 60%))'
                : 'hsl(var(--primary))'
            }}
            animate={{ width: `${energyScore}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Audio Waveform Section */}
      <div className="p-3 border-t border-border flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Audio Monitor</span>
        </div>
        
        {/* Waveform visualization */}
        <div className="waveform-container h-12">
          <div className="absolute inset-0 flex items-center justify-center gap-0.5">
            {Array.from({ length: 80 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-studio-waveform rounded-full"
                animate={{
                  height: [
                    `${15 + Math.random() * 25}%`,
                    `${35 + Math.random() * 55}%`,
                    `${15 + Math.random() * 25}%`
                  ]
                }}
                transition={{
                  duration: 0.25 + Math.random() * 0.25,
                  repeat: Infinity,
                  delay: i * 0.015
                }}
              />
            ))}
          </div>
        </div>

        {/* Audio meters */}
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground w-4">L</span>
            <div className="flex-1 audio-meter h-1.5">
              <motion.div 
                className="audio-meter-fill"
                animate={{ width: ['60%', '85%', '70%', '90%', '65%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground w-8 text-right">-6dB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground w-4">R</span>
            <div className="flex-1 audio-meter h-1.5">
              <motion.div 
                className="audio-meter-fill"
                animate={{ width: ['65%', '80%', '75%', '88%', '60%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground w-8 text-right">-8dB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
