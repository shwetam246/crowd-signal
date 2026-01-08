import { motion } from 'framer-motion';
import { Shield, ShieldOff, Filter, Volume2, VolumeX } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface NoiseGateToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function NoiseGateToggle({ enabled, onToggle }: NoiseGateToggleProps) {
  return (
    <motion.div 
      className={cn(
        'studio-panel p-4 transition-all duration-300',
        enabled && 'border-success/30'
      )}
      animate={enabled ? { 
        boxShadow: '0 0 20px -5px hsl(var(--success) / 0.3)' 
      } : { 
        boxShadow: 'none' 
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
              enabled ? 'bg-success/20' : 'bg-muted'
            )}
            animate={enabled ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: enabled ? Infinity : 0 }}
          >
            {enabled ? (
              <Shield className="w-5 h-5 text-success" />
            ) : (
              <ShieldOff className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">Noise Gate</span>
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {enabled ? 'Filtering low-intent noise' : 'Showing all feedback'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            {enabled ? (
              <Volume2 className="w-4 h-4 text-success" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </div>
          <Switch 
            checked={enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-success"
          />
        </div>
      </div>

      {/* Visual indicator */}
      <motion.div 
        className="mt-3 h-1 rounded-full bg-muted overflow-hidden"
        initial={false}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: enabled 
              ? 'linear-gradient(90deg, hsl(var(--success)), hsl(var(--success) / 0.3))'
              : 'hsl(var(--muted-foreground) / 0.3)'
          }}
          animate={{ 
            width: enabled ? '100%' : '30%',
            x: enabled ? 0 : [0, 10, 0]
          }}
          transition={{ 
            width: { duration: 0.3 },
            x: { duration: 2, repeat: enabled ? 0 : Infinity }
          }}
        />
      </motion.div>
    </motion.div>
  );
}
