import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Clock, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LyricLine {
  id: number;
  timestamp: string;
  line: string;
  section: string;
}

interface LyricInteractionProps {
  onSubmitEdit: (timestamp: string, suggestion: string) => void;
}

const CURRENT_LYRICS: LyricLine[] = [
  { id: 1, timestamp: '0:00', line: 'Verse 1 - Opening line', section: 'intro' },
  { id: 2, timestamp: '0:15', line: 'Building up the energy', section: 'verse' },
  { id: 3, timestamp: '0:30', line: 'Feel the bass drop coming', section: 'build' },
  { id: 4, timestamp: '0:45', line: '[DROP]', section: 'drop' },
  { id: 5, timestamp: '1:00', line: 'Second verse riding', section: 'verse' },
];

export function LyricInteraction({ onSubmitEdit }: LyricInteractionProps) {
  const [selectedLine, setSelectedLine] = useState<LyricLine | null>(null);
  const [editSuggestion, setEditSuggestion] = useState('');
  const [submittedLines, setSubmittedLines] = useState<number[]>([]);

  const handleLineClick = (line: LyricLine) => {
    if (submittedLines.includes(line.id)) return;
    setSelectedLine(line);
    setEditSuggestion('');
  };

  const handleSubmit = () => {
    if (selectedLine && editSuggestion.trim()) {
      onSubmitEdit(selectedLine.timestamp, editSuggestion);
      setSubmittedLines(prev => [...prev, selectedLine.id]);
      setSelectedLine(null);
      setEditSuggestion('');
    }
  };

  return (
    <div className="studio-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Suggest Edits</span>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        Tap any lyric line to suggest a change at that timestamp
      </p>

      {/* Lyric Lines */}
      <div className="space-y-1 mb-4">
        {CURRENT_LYRICS.map((lyric) => (
          <motion.button
            key={lyric.id}
            className={cn(
              "w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all",
              selectedLine?.id === lyric.id 
                ? "bg-primary/20 border border-primary/50" 
                : submittedLines.includes(lyric.id)
                  ? "bg-success/10 border border-success/30 opacity-60"
                  : "bg-muted/30 hover:bg-muted/50",
              lyric.section === 'drop' && "border-l-2 border-l-primary"
            )}
            onClick={() => handleLineClick(lyric)}
            whileTap={{ scale: 0.98 }}
            disabled={submittedLines.includes(lyric.id)}
          >
            <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-mono text-muted-foreground w-8">
              {lyric.timestamp}
            </span>
            <span className={cn(
              "text-sm flex-1",
              lyric.section === 'drop' && "font-semibold text-primary"
            )}>
              {lyric.line}
            </span>
            {submittedLines.includes(lyric.id) && (
              <span className="text-xs text-success">✓ Sent</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Edit Input Panel */}
      <AnimatePresence>
        {selectedLine && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  Editing @ {selectedLine.timestamp}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => setSelectedLine(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>

              <p className="text-sm mb-2 text-primary">"{selectedLine.line}"</p>

              <div className="flex gap-2">
                <Input
                  placeholder="Your suggestion..."
                  value={editSuggestion}
                  onChange={(e) => setEditSuggestion(e.target.value)}
                  className="flex-1 h-10 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={!editSuggestion.trim()}
                  className="h-10"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
