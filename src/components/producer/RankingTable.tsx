import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, Users, Zap, ChevronUp } from 'lucide-react';
import { RankedDecision, IntentLevel } from '@/logic/rankingEngine';
import { cn } from '@/lib/utils';

interface RankingTableProps {
  decisions: RankedDecision[];
  highlightedId?: string | null;
}

function IntentBadge({ level }: { level: IntentLevel }) {
  return (
    <span className={cn(
      'intent-badge',
      level === 'high' && 'high',
      level === 'medium' && 'medium',
      level === 'low' && 'low'
    )}>
      {level === 'high' && <Zap className="w-3 h-3 inline mr-0.5" />}
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="confidence-bar flex-1 w-20">
        <motion.div 
          className="confidence-fill"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-mono text-muted-foreground w-8">{score}%</span>
    </div>
  );
}

export function RankingTable({ decisions, highlightedId }: RankingTableProps) {
  return (
    <div className="studio-panel h-full flex flex-col">
      {/* Header */}
      <div className="studio-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Global Ranking</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {decisions.length} decisions
        </span>
      </div>

      {/* Table Header */}
      <div className="px-4 py-2 border-b border-border bg-muted/20 grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground">
        <div className="col-span-1">#</div>
        <div className="col-span-4">Suggestion</div>
        <div className="col-span-2">Category</div>
        <div className="col-span-1 text-center">Intent</div>
        <div className="col-span-2">Confidence</div>
        <div className="col-span-1 text-center">
          <Users className="w-3 h-3 inline" />
        </div>
        <div className="col-span-1 text-center">
          <Clock className="w-3 h-3 inline" />
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {decisions.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No feedback yet. Waiting for crowd input...
            </div>
          ) : (
            decisions.map((decision, index) => (
              <motion.div
                key={decision.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'ranking-row grid grid-cols-12 gap-2 items-center',
                  decision.isHighlighted && 'high-intent-glow',
                  highlightedId === decision.id && 'highlighted'
                )}
              >
                {/* Rank */}
                <div className="col-span-1">
                  <div className={cn(
                    'w-6 h-6 rounded flex items-center justify-center text-xs font-bold',
                    index === 0 && 'bg-primary text-primary-foreground',
                    index === 1 && 'bg-primary/60 text-primary-foreground',
                    index === 2 && 'bg-primary/30 text-foreground',
                    index > 2 && 'bg-muted text-muted-foreground'
                  )}>
                    {index + 1}
                  </div>
                </div>

                {/* Suggestion */}
                <div className="col-span-4">
                  <p className="text-sm truncate" title={decision.suggestion}>
                    {decision.suggestion}
                  </p>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    {decision.category}
                  </span>
                </div>

                {/* Intent */}
                <div className="col-span-1 text-center">
                  <IntentBadge level={decision.intentLevel} />
                </div>

                {/* Confidence */}
                <div className="col-span-2">
                  <ConfidenceBar score={decision.confidenceScore} />
                </div>

                {/* Votes */}
                <div className="col-span-1 text-center">
                  <span className="text-sm font-mono">{decision.frequency}</span>
                </div>

                {/* Recency */}
                <div className="col-span-1 text-center">
                  <div className={cn(
                    'inline-flex items-center gap-0.5 text-xs',
                    decision.recencyBoost >= 80 && 'text-success',
                    decision.recencyBoost >= 40 && decision.recencyBoost < 80 && 'text-warning',
                    decision.recencyBoost < 40 && 'text-muted-foreground'
                  )}>
                    {decision.recencyBoost >= 60 && (
                      <ChevronUp className="w-3 h-3" />
                    )}
                    <span className="font-mono">{decision.recencyBoost}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
