import { motion } from 'framer-motion';
import { Video, Volume2, Wifi, Users } from 'lucide-react';

interface StreamPanelProps {
  viewerCount?: number;
  isLive?: boolean;
}

export function StreamPanel({ viewerCount = 1247, isLive = true }: StreamPanelProps) {
  return (
    <div className="studio-panel h-full flex flex-col">
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

      {/* Video Placeholder */}
      <div className="flex-1 relative bg-studio-surface">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
              <Video className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Video Stream</p>
            <p className="text-xs text-muted-foreground/60 mt-1">OBS / Streaming Software</p>
          </div>
        </div>
        
        {/* Connection indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
          <Wifi className="w-3 h-3 text-success" />
          <span className="text-xs font-mono text-success">Connected</span>
        </div>
      </div>

      {/* Audio Waveform */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Audio Monitor</span>
        </div>
        
        {/* Waveform visualization */}
        <div className="waveform-container">
          <div className="absolute inset-0 flex items-center justify-center gap-0.5">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-studio-waveform rounded-full"
                animate={{
                  height: [
                    `${20 + Math.random() * 30}%`,
                    `${40 + Math.random() * 50}%`,
                    `${20 + Math.random() * 30}%`
                  ]
                }}
                transition={{
                  duration: 0.3 + Math.random() * 0.3,
                  repeat: Infinity,
                  delay: i * 0.02
                }}
              />
            ))}
          </div>
        </div>

        {/* Audio meters */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground w-6">L</span>
            <div className="flex-1 audio-meter">
              <motion.div 
                className="audio-meter-fill"
                animate={{ width: ['60%', '85%', '70%', '90%', '65%'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground w-10 text-right">-6dB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground w-6">R</span>
            <div className="flex-1 audio-meter">
              <motion.div 
                className="audio-meter-fill"
                animate={{ width: ['65%', '80%', '75%', '88%', '60%'] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground w-10 text-right">-8dB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
