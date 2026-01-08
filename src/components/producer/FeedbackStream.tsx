import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Zap, User } from 'lucide-react';
import { FeedbackItem } from '@/logic/rankingEngine';
import { cn } from '@/lib/utils';

interface FeedbackStreamProps {
  items: FeedbackItem[];
  noiseGateEnabled: boolean;
  maxItems?: number;
}

export function FeedbackStream({ items, noiseGateEnabled, maxItems = 15 }: FeedbackStreamProps) {
  const filteredItems = noiseGateEnabled 
    ? items.filter(item => item.intentLevel !== 'low')
    : items;

  const displayItems = filteredItems.slice(0, maxItems);

  return (
    <div className="studio-panel h-full flex flex-col">
      <div className="studio-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Live Feedback</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {filteredItems.length} messages
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence mode="popLayout">
          {displayItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'p-2 rounded-lg text-sm',
                item.intentLevel === 'high' && 'bg-success/10 border border-success/20',
                item.intentLevel === 'medium' && 'bg-warning/5 border border-warning/10',
                item.intentLevel === 'low' && 'bg-muted/30'
              )}
            >
              <div className="flex items-start gap-2">
                <div className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                  item.intentLevel === 'high' && 'bg-success/20',
                  item.intentLevel === 'medium' && 'bg-warning/20',
                  item.intentLevel === 'low' && 'bg-muted'
                )}>
                  {item.intentLevel === 'high' ? (
                    <Zap className="w-3 h-3 text-success" />
                  ) : (
                    <User className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.userId}
                    </span>
                    <span className="text-xs text-muted-foreground/50">
                      {new Date(item.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className={cn(
                    'text-sm mt-0.5 break-words',
                    item.intentLevel === 'high' && 'text-foreground',
                    item.intentLevel !== 'high' && 'text-muted-foreground'
                  )}>
                    {item.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {displayItems.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            {noiseGateEnabled 
              ? 'Filtering noise... Waiting for high-intent feedback'
              : 'Waiting for feedback...'}
          </div>
        )}
      </div>
    </div>
  );
}
