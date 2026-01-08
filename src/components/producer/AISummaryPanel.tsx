import { motion } from 'framer-motion';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AISummaryPanelProps {
  summary: string;
  onRefresh?: () => void;
}

export function AISummaryPanel({ summary, onRefresh }: AISummaryPanelProps) {
  return (
    <div className="studio-panel h-full flex flex-col">
      {/* Header */}
      <div className="studio-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">AI Crowd Insights</span>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-3 h-3 text-primary" />
          </motion.div>
        </div>
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="h-7 w-7 p-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <motion.div
          key={summary}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {summary.split('\n').map((line, index) => (
            <p 
              key={index} 
              className={`text-sm ${
                line.startsWith('🎯') 
                  ? 'font-medium text-foreground' 
                  : line.startsWith('📊')
                    ? 'text-muted-foreground text-xs mt-4 pt-3 border-t border-border'
                    : 'text-muted-foreground'
              }`}
            >
              {line}
            </p>
          ))}
        </motion.div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Powered by noise-gate AI
          </span>
          <motion.div 
            className="flex items-center gap-1"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-success" />
            <span className="text-xs text-success">Live Analysis</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
