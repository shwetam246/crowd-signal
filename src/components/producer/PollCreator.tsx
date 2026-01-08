import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Plus, X, Send, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Poll } from '@/logic/rankingEngine';
import { cn } from '@/lib/utils';

interface PollCreatorProps {
  activePoll: Poll | null;
  onCreatePoll: (question: string, optionA: string, optionB: string) => void;
  onClosePoll: () => void;
  onClearPoll: () => void;
}

export function PollCreator({ activePoll, onCreatePoll, onClosePoll, onClearPoll }: PollCreatorProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [question, setQuestion] = useState('Which version sounds better?');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');

  const handleCreate = () => {
    if (optionA.trim() && optionB.trim()) {
      onCreatePoll(question, optionA.trim(), optionB.trim());
      setIsCreating(false);
      setOptionA('');
      setOptionB('');
    }
  };

  const totalVotes = activePoll ? activePoll.votesA + activePoll.votesB : 0;
  const percentA = totalVotes > 0 ? Math.round((activePoll!.votesA / totalVotes) * 100) : 50;
  const percentB = totalVotes > 0 ? Math.round((activePoll!.votesB / totalVotes) * 100) : 50;

  return (
    <div className="studio-panel">
      <div className="studio-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">A/B Poll Hub</span>
        </div>
        {!activePoll && !isCreating && (
          <Button 
            size="sm" 
            onClick={() => setIsCreating(true)}
            className="h-7 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            New Poll
          </Button>
        )}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {/* Create Poll Form */}
          {isCreating && !activePoll && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <Input
                placeholder="Question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="bg-muted border-border"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Option A (e.g., Bassline A)"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  className="bg-muted border-border"
                />
                <Input
                  placeholder="Option B (e.g., Bassline B)"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  className="bg-muted border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsCreating(false)}
                  className="flex-1"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleCreate}
                  disabled={!optionA.trim() || !optionB.trim()}
                  className="flex-1"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Launch Poll
                </Button>
              </div>
            </motion.div>
          )}

          {/* Active Poll */}
          {activePoll && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{activePoll.question}</p>
                {activePoll.isActive && (
                  <motion.div
                    className="flex items-center gap-1.5"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-xs text-success">Live</span>
                  </motion.div>
                )}
              </div>

              {/* Results bars */}
              <div className="space-y-3">
                {/* Option A */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{activePoll.optionA}</span>
                    <span className="font-mono text-muted-foreground">
                      {activePoll.votesA} votes ({percentA}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        percentA >= percentB ? 'bg-primary' : 'bg-primary/50'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentA}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Option B */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{activePoll.optionB}</span>
                    <span className="font-mono text-muted-foreground">
                      {activePoll.votesB} votes ({percentB}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        percentB > percentA ? 'bg-primary' : 'bg-primary/50'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentB}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BarChart3 className="w-4 h-4" />
                  <span className="text-sm">{totalVotes} total votes</span>
                </div>
                <div className="flex gap-2">
                  {activePoll.isActive ? (
                    <Button size="sm" variant="outline" onClick={onClosePoll}>
                      End Poll
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={onClearPoll}>
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!isCreating && !activePoll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6"
            >
              <Vote className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Create an A/B poll to get instant crowd feedback
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
