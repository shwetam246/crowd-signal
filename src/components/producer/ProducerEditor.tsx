import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Check, X, Music, Mic2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RankedDecision } from '@/logic/rankingEngine';
import { cn } from '@/lib/utils';

interface ProducerEditorProps {
  rankedDecisions: RankedDecision[];
  onApplySuggestion?: (suggestion: string) => void;
}

// Sample track elements for demo
const SAMPLE_LYRICS = [
  { id: 1, timestamp: '0:00', line: 'Verse 1 - Opening line here', section: 'intro' },
  { id: 2, timestamp: '0:15', line: 'Building up the energy now', section: 'verse' },
  { id: 3, timestamp: '0:30', line: 'Drop incoming, feel the bass', section: 'build' },
  { id: 4, timestamp: '0:45', line: '[INSTRUMENTAL DROP]', section: 'drop' },
  { id: 5, timestamp: '1:00', line: 'Second verse, riding the wave', section: 'verse' },
  { id: 6, timestamp: '1:15', line: 'Chorus hits hard, crowd goes wild', section: 'chorus' },
];

const TRACK_ELEMENTS = [
  { id: 'kick', name: 'Kick Drum', active: true },
  { id: 'bass', name: 'Sub Bass', active: true },
  { id: 'snare', name: 'Snare', active: true },
  { id: 'hihat', name: 'Hi-Hats', active: true },
  { id: 'synth', name: 'Lead Synth', active: true },
  { id: 'pad', name: 'Pad Layer', active: false },
  { id: 'vocal', name: 'Vocal Chop', active: true },
  { id: 'fx', name: 'FX Riser', active: false },
];

export function ProducerEditor({ rankedDecisions, onApplySuggestion }: ProducerEditorProps) {
  const [editingLyric, setEditingLyric] = useState<number | null>(null);
  const [lyrics, setLyrics] = useState(SAMPLE_LYRICS);
  const [elements, setElements] = useState(TRACK_ELEMENTS);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (id: number, currentLine: string) => {
    setEditingLyric(id);
    setEditValue(currentLine);
  };

  const handleSaveEdit = (id: number) => {
    setLyrics(prev => prev.map(l => l.id === id ? { ...l, line: editValue } : l));
    setEditingLyric(null);
    setEditValue('');
  };

  const handleToggleElement = (id: string) => {
    setElements(prev => prev.map(e => e.id === id ? { ...e, active: !e.active } : e));
  };

  const handleApplySuggestion = (decision: RankedDecision) => {
    onApplySuggestion?.(decision.suggestion);
  };

  const topSuggestions = rankedDecisions.slice(0, 3);

  return (
    <div className="studio-panel h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="studio-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Decision Editor</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Suggestions Quick Apply */}
        {topSuggestions.length > 0 && (
          <div className="p-3 border-b border-border bg-muted/20">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Top Crowd Suggestions
            </p>
            <div className="space-y-1.5">
              {topSuggestions.map((decision, index) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-card/50 border border-border/50"
                >
                  <span className="text-xs text-muted-foreground font-mono w-5">
                    #{index + 1}
                  </span>
                  <span className="text-xs flex-1 truncate">{decision.suggestion}</span>
                  <span className="text-xs font-mono text-primary">{decision.confidenceScore}%</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs hover:bg-primary/20 hover:text-primary"
                    onClick={() => handleApplySuggestion(decision)}
                  >
                    Apply
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Lyrics Section */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center gap-2 mb-3">
            <Mic2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">LYRICS / TIMELINE</span>
          </div>

          <div className="space-y-1">
            {lyrics.map((lyric) => (
              <motion.div
                key={lyric.id}
                className={cn(
                  "group flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-muted/30 cursor-pointer",
                  lyric.section === 'drop' && "bg-primary/10 border border-primary/20"
                )}
                whileHover={{ x: 2 }}
              >
                <span className="text-xs font-mono text-muted-foreground w-10">
                  {lyric.timestamp}
                </span>
                
                {editingLyric === lyric.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-7 text-xs bg-background"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => handleSaveEdit(lyric.id)}
                    >
                      <Check className="w-3.5 h-3.5 text-success" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => setEditingLyric(null)}
                    >
                      <X className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className={cn(
                      "flex-1 text-sm",
                      lyric.section === 'drop' && "font-semibold text-primary"
                    )}>
                      {lyric.line}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleStartEdit(lyric.id, lyric.line)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Track Elements Grid */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">TRACK ELEMENTS</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {elements.map((element) => (
              <motion.button
                key={element.id}
                className={cn(
                  "px-2 py-1.5 rounded text-xs font-medium transition-all",
                  element.active 
                    ? "bg-primary/20 text-primary border border-primary/30" 
                    : "bg-muted/50 text-muted-foreground border border-transparent"
                )}
                onClick={() => handleToggleElement(element.id)}
                whileTap={{ scale: 0.95 }}
              >
                {element.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
