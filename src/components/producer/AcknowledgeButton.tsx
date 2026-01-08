import { motion } from 'framer-motion';
import { Hand, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AcknowledgeButtonProps {
  onAcknowledge: () => void;
  lastAcknowledged?: number | null;
}

export function AcknowledgeButton({ onAcknowledge, lastAcknowledged }: AcknowledgeButtonProps) {
  const timeSince = lastAcknowledged 
    ? Math.floor((Date.now() - lastAcknowledged) / 1000)
    : null;

  return (
    <div className="studio-panel p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Hand className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Signal Crowd</span>
        </div>
        {timeSince !== null && timeSince < 60 && (
          <span className="text-xs text-muted-foreground">
            {timeSince}s ago
          </span>
        )}
      </div>
      
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button 
          onClick={onAcknowledge}
          className="w-full h-12 text-base gap-2 bg-gradient-to-r from-primary to-[hsl(270,60%,55%)] hover:from-primary/90 hover:to-[hsl(270,60%,50%)]"
        >
          <Sparkles className="w-5 h-5" />
          ACKNOWLEDGE
        </Button>
      </motion.div>

      <p className="text-xs text-muted-foreground text-center mt-2">
        Flash screen for all viewers to confirm feedback received
      </p>
    </div>
  );
}
