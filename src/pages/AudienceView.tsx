import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, Music2, Sparkles, CheckCircle2, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnergyBackground } from '@/components/EnergyBackground';
import { EnergyMashButton } from '@/components/audience/EnergyMashButton';
import { LyricInteraction } from '@/components/audience/LyricInteraction';
import { Poll } from '@/logic/rankingEngine';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Cross-tab communication keys
const ACKNOWLEDGE_KEY = 'producer-acknowledge-signal';
const POLL_KEY = 'producer-active-poll';

export default function AudienceView() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<'A' | 'B' | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  
  // Energy system state
  const [energyScore, setEnergyScore] = useState(35);
  const [showAcknowledgeFlash, setShowAcknowledgeFlash] = useState(false);

  // Listen for cross-tab acknowledge signals from producer
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACKNOWLEDGE_KEY && e.newValue) {
        const signal = JSON.parse(e.newValue);
        // Only trigger if it's a new signal (within last second)
        if (Date.now() - signal.timestamp < 1000) {
          setShowAcknowledgeFlash(true);
          toast.success('🎯 Producer received your feedback!', {
            duration: 3000,
            position: 'top-center',
          });
          setTimeout(() => setShowAcknowledgeFlash(false), 500);
        }
      }
      
      // Listen for poll updates from producer
      if (e.key === POLL_KEY) {
        if (e.newValue) {
          const pollData = JSON.parse(e.newValue);
          setPoll(pollData);
          // Reset selection if new poll
          if (poll?.id !== pollData.id) {
            setSelectedPollOption(null);
          }
        } else {
          setPoll(null);
          setSelectedPollOption(null);
        }
      }
    };

    // Check for existing poll on mount
    const existingPoll = localStorage.getItem(POLL_KEY);
    if (existingPoll) {
      setPoll(JSON.parse(existingPoll));
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [poll?.id]);

  // Simulate energy decay
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyScore(prev => Math.max(10, prev - 0.5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulate poll vote updates
  useEffect(() => {
    if (poll?.isActive) {
      const interval = setInterval(() => {
        setPoll(prev => {
          if (!prev) return null;
          return {
            ...prev,
            votesA: prev.votesA + Math.floor(Math.random() * 3),
            votesB: prev.votesB + Math.floor(Math.random() * 3)
          };
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [poll?.isActive]);

  const handleSubmit = () => {
    if (feedback.trim()) {
      setSubmitted(true);
      setFeedback('');
      setTimeout(() => setSubmitted(false), 2000);
    }
  };

  const handleEnergyMash = () => {
    setEnergyScore(prev => Math.min(100, prev + 3));
  };

  const handleLyricEdit = (timestamp: string, suggestion: string) => {
    console.log(`Edit @ ${timestamp}: ${suggestion}`);
    toast.success('Suggestion sent!', { duration: 2000 });
  };

  const handleVote = (option: 'A' | 'B') => {
    if (!selectedPollOption && poll) {
      setSelectedPollOption(option);
      // Update local poll state
      setPoll(prev => {
        if (!prev) return null;
        const updated = {
          ...prev,
          votesA: option === 'A' ? prev.votesA + 1 : prev.votesA,
          votesB: option === 'B' ? prev.votesB + 1 : prev.votesB
        };
        // Broadcast vote update
        localStorage.setItem(POLL_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const totalVotes = poll ? poll.votesA + poll.votesB : 0;
  const percentA = poll && totalVotes > 0 ? Math.round((poll.votesA / totalVotes) * 100) : 50;
  const percentB = poll && totalVotes > 0 ? Math.round((poll.votesB / totalVotes) * 100) : 50;

  return (
    <EnergyBackground energyScore={energyScore} showAcknowledgeFlash={showAcknowledgeFlash}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-border/50 bg-card/60 backdrop-blur-lg px-4 flex items-center justify-between safe-area-inset-top">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Live Session</span>
            <motion.div
              className="w-2 h-2 rounded-full bg-success"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted/50">
            <Radio className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">Energy</span>
            <span className="text-sm font-bold text-primary">{Math.round(energyScore)}%</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 flex flex-col gap-4 max-w-lg mx-auto w-full overflow-y-auto">
          {/* Energy Mash Button */}
          <div className="studio-panel p-4">
            <EnergyMashButton 
              onMash={handleEnergyMash} 
              energyScore={energyScore} 
            />
          </div>

          {/* Active Poll */}
          <AnimatePresence>
            {poll?.isActive && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="studio-panel p-4 high-intent-glow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Live Poll</span>
                </div>

                <p className="font-semibold text-lg mb-4">{poll.question}</p>

                {/* Poll Options */}
                <div className="space-y-3">
                  {/* Option A */}
                  <motion.button
                    className={cn(
                      'poll-option w-full text-left',
                      selectedPollOption === 'A' && 'selected'
                    )}
                    onClick={() => handleVote('A')}
                    whileTap={{ scale: 0.98 }}
                    disabled={!!selectedPollOption}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{poll.optionA}</span>
                      {selectedPollOption && (
                        <span className="text-sm font-mono text-primary font-semibold">
                          {percentA}%
                        </span>
                      )}
                    </div>
                    {selectedPollOption && (
                      <motion.div 
                        className="h-2.5 rounded-full bg-muted overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentA}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                    )}
                    {selectedPollOption === 'A' && (
                      <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary" />
                    )}
                  </motion.button>

                  {/* Option B */}
                  <motion.button
                    className={cn(
                      'poll-option w-full text-left',
                      selectedPollOption === 'B' && 'selected'
                    )}
                    onClick={() => handleVote('B')}
                    whileTap={{ scale: 0.98 }}
                    disabled={!!selectedPollOption}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{poll.optionB}</span>
                      {selectedPollOption && (
                        <span className="text-sm font-mono text-primary font-semibold">
                          {percentB}%
                        </span>
                      )}
                    </div>
                    {selectedPollOption && (
                      <motion.div 
                        className="h-2.5 rounded-full bg-muted overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentB}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                    )}
                    {selectedPollOption === 'B' && (
                      <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-primary" />
                    )}
                  </motion.button>
                </div>

                {selectedPollOption && (
                  <motion.p 
                    className="text-xs text-muted-foreground text-center mt-3 font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {totalVotes.toLocaleString()} total votes
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lyric Interaction */}
          <LyricInteraction onSubmitEdit={handleLyricEdit} />

          {/* Feedback Input */}
          <div className="studio-panel p-4">
            <p className="text-sm font-medium mb-2">
              Share Technical Feedback
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Tip: Be specific! "Boost the kick at 60Hz" helps more than "sounds good" 🎯
            </p>

            <div className="space-y-3">
              <Input
                placeholder="e.g., The snare needs more punch..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="bg-muted/50 border-border min-h-[48px] text-base"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              />

              <Button 
                className="w-full h-12 text-base font-semibold"
                onClick={handleSubmit}
                disabled={!feedback.trim()}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 p-3 rounded-lg bg-success/20 border border-success/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm text-success font-medium">Feedback sent to producer!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Suggestions */}
          <div className="text-center pb-4">
            <p className="text-xs text-muted-foreground mb-2">Try saying:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'More reverb on vocals',
                'Sidechain the bass',
                'Cut the mids on synth'
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="text-xs px-3 py-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors border border-border/50"
                  onClick={() => setFeedback(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </EnergyBackground>
  );
}