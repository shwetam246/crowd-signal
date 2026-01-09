import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Check, X, Music, Mic2, Layers, Sparkles, Zap } from 'lucide-react';
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
  { id: 1, timestamp: '0:00', line: 'Verse 1 - Opening line here', section: 'INTRO' },
  { id: 2, timestamp: '0:15', line: 'Building up the energy now', section: 'VERSE' },
  { id: 3, timestamp: '0:30', line: 'Drop incoming, feel the bass', section: 'BUILD' },
  { id: 4, timestamp: '0:45', line: '[INSTRUMENTAL DROP]', section: 'DROP' },
  { id: 5, timestamp: '1:00', line: 'Second verse, riding the wave', section: 'VERSE' },
  { id: 6, timestamp: '1:15', line: 'Chorus hits hard, crowd goes wild', section: 'CHORUS' },
  { id: 7, timestamp: '1:30', line: 'Break it down, let them breathe', section: 'BREAKDOWN' },
  { id: 8, timestamp: '1:45', line: '[FINAL DROP]', section: 'DROP' },
];

const TRACK_ELEMENTS = [
  { id: 'kick', name: 'Kick', active: true },
  { id: 'bass', name: 'Sub Bass', active: true },
  { id: 'snare', name: 'Snare', active: true },
  { id: 'hihat', name: 'Hi-Hats', active: true },
  { id: 'synth', name: 'Lead Synth', active: true },
  { id: 'pad', name: 'Pad', active: false },
  { id: 'vocal', name: 'Vocal', active: true },
  { id: 'fx', name: 'FX/Riser', active: false },
];

export function ProducerEditor({ rankedDecisions, onApplySuggestion }: ProducerEditorProps) {
  const [editingLyric, setEditingLyric] = useState<number | null>(null);
  const [lyrics, setLyrics] = useState(SAMPLE_LYRICS);
  const [elements, setElements] = useState(TRACK_ELEMENTS);
  const [editValue, setEditValue] = useState('');
  const [activeLine, setActiveLine] = useState<number>(4); // Current playhead position

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

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'DROP': return 'bg-primary/20 text-primary';
      case 'CHORUS': return 'bg-purple-500/20 text-purple-400';
      case 'BUILD': return 'bg-warning/20 text-[hsl(var(--warning))]';
      case 'BREAKDOWN': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="studio-panel h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="studio-panel-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">Decision Editor</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">LIVE WORKSPACE</span>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Suggestions Quick Apply - Enhanced */}
        {topSuggestions.length > 0 && (
          <div className="p-3 border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary">TOP CROWD SUGGESTIONS</span>
            </div>
            <div className="space-y-2">
              {topSuggestions.map((decision, index) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg border transition-all",
                    decision.isHighlighted 
                      ? "high-intent-glow bg-primary/10 border-primary/30" 
                      : "bg-card/60 border-border/50 hover:bg-card/80"
                  )}
                >
                  <span className="text-xs font-bold text-primary font-mono w-5">
                    #{index + 1}
                  </span>
                  
                  {/* Category badge */}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    {decision.category}
                  </span>
                  
                  <span className="text-sm flex-1 truncate">{decision.suggestion}</span>
                  
                  {/* Confidence bar */}
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${decision.confidenceScore}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs font-mono font-semibold text-primary w-8">
                      {decision.confidenceScore}%
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    className="h-7 px-3 text-xs bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
                    onClick={() => handleApplySuggestion(decision)}
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Apply
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Lyrics Section - Enhanced */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center gap-2 mb-3">
            <Mic2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Lyrics / Timeline</span>
          </div>

          <div className="space-y-1">
            {lyrics.map((lyric) => (
              <motion.div
                key={lyric.id}
                className={cn(
                  "group flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer",
                  lyric.id === activeLine && "lyric-line-active",
                  lyric.section === 'DROP' && lyric.id !== activeLine && "bg-primary/5",
                  lyric.id !== activeLine && "hover:bg-muted/30"
                )}
                onClick={() => setActiveLine(lyric.id)}
                whileHover={{ x: 2 }}
              >
                {/* Timestamp */}
                <span className="text-xs font-mono text-muted-foreground w-10 flex-shrink-0">
                  {lyric.timestamp}
                </span>
                
                {/* Section Badge */}
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider flex-shrink-0",
                  getSectionColor(lyric.section)
                )}>
                  {lyric.section}
                </span>
                
                {editingLyric === lyric.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 text-sm bg-background flex-1"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleSaveEdit(lyric.id)}
                    >
                      <Check className="w-4 h-4 text-success" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => setEditingLyric(null)}
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className={cn(
                      "flex-1 text-sm",
                      lyric.section === 'DROP' && "font-semibold text-primary",
                      lyric.id === activeLine && "font-medium"
                    )}>
                      {lyric.line}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(lyric.id, lyric.line);
                      }}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Track Elements Grid - Enhanced */}
        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2.5">
            <Music className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Track Elements</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {elements.map((element) => (
              <motion.button
                key={element.id}
                className={cn(
                  "px-2 py-2 rounded-lg text-xs font-medium transition-all border",
                  element.active 
                    ? "bg-primary/20 text-primary border-primary/40 glow-primary" 
                    : "bg-muted/30 text-muted-foreground border-transparent hover:bg-muted/50"
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