import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FeedbackItem, 
  RankedDecision, 
  Poll,
  classifyIntent, 
  analyzeTechnicalDepth,
  categorizeFeedback,
  getRankedDecisions,
  generateAISummary
} from '@/logic/rankingEngine';

// Cross-tab communication key for localStorage
const ACKNOWLEDGE_KEY = 'producer-acknowledge-signal';
const POLL_KEY = 'producer-active-poll';
const ENERGY_KEY = 'crowd-energy-score';

// Simulated feedback messages for demo
const SIMULATED_FEEDBACK = [
  // High Intent - Technical
  "The kick needs more punch, try boosting around 60-80Hz",
  "Compression on the bass is too heavy, losing dynamics",
  "Could use some high-end shimmer on the lead synth",
  "The snare sounds muddy, maybe cut around 300Hz",
  "Sidechain the pad to the kick for more groove",
  "The drop would hit harder with more sub bass",
  "Try adding some saturation to warm up the mid-range",
  "Reverb tail is too long, cluttering the mix",
  "Hi-hats could be brighter, boost 8-10kHz",
  "The vocal needs de-essing around 6kHz",
  "Add some stereo width to the synth layers",
  "Consider automating the filter cutoff in the build",
  "The low-end is competing with the kick, try HPF on bass",
  "More attack on the pluck synth would help it cut through",
  "The breakdown needs more tension, try a riser",
  "Maybe less reverb on the vocals, feels too distant",
  "The second drop needs variation from the first",
  "Try parallel compression on the drum bus",
  
  // Medium Intent
  "Love the melody but bass feels weak",
  "The mix sounds good but needs more energy",
  "Vibes are right, maybe more reverb?",
  "Great track, the drop could be bigger though",
  "Feeling the groove, drums could hit harder",
  "The build is nice but the drop doesn't deliver",
  
  // Low Intent - Noise
  "LFG 🔥🔥🔥",
  "This is fire!",
  "Insane vibes",
  "GOAT",
  "Amazing!!!",
  "💯💯💯",
  "Love it",
  "Yes yes yes",
  "Sick drop",
  "Wow",
  "Let's goooo",
  "🔥🔥🔥",
  "Sheesh!",
  "This slaps"
];

const USERNAMES = [
  'BassHead_Mike', 'SynthWizard', 'DrumMachine99', 'MixMaster_J', 
  'VinylVibes', 'StudioPro', 'BeatDropper', 'FreqHunter',
  'WaveRider', 'SoundSculptor', 'GrooveMaker', 'AudioNerd42',
  'SubFreq_Sam', 'MelodyMaven', 'RhythmRider', 'SonicArchitect'
];

export function useFeedbackSimulation(simulationSpeed: number = 2000) {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [rankedDecisions, setRankedDecisions] = useState<RankedDecision[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [noiseGateEnabled, setNoiseGateEnabled] = useState(true);
  const [isSimulating, setIsSimulating] = useState(true);
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [newHighIntent, setNewHighIntent] = useState<string | null>(null);
  
  // Energy system
  const [energyScore, setEnergyScore] = useState(25);
  const [acknowledgeFlash, setAcknowledgeFlash] = useState(false);
  const [lastAcknowledged, setLastAcknowledged] = useState<number | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const energyDecayRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random feedback
  const generateFeedback = useCallback((): FeedbackItem => {
    const text = SIMULATED_FEEDBACK[Math.floor(Math.random() * SIMULATED_FEEDBACK.length)];
    const userId = USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
    
    return {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      timestamp: Date.now(),
      userId,
      intentLevel: classifyIntent(text),
      technicalScore: analyzeTechnicalDepth(text),
      category: categorizeFeedback(text)
    };
  }, []);

  // Add new feedback
  const addFeedback = useCallback((feedback: FeedbackItem) => {
    setFeedbackItems(prev => {
      const updated = [feedback, ...prev].slice(0, 100); // Keep last 100
      return updated;
    });

    // Trigger highlight for high-intent
    if (feedback.intentLevel === 'high') {
      setNewHighIntent(feedback.id);
      setTimeout(() => setNewHighIntent(null), 3000);
    }
  }, []);

  // Submit user feedback
  const submitFeedback = useCallback((text: string, userId: string = 'You') => {
    const feedback: FeedbackItem = {
      id: `fb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      timestamp: Date.now(),
      userId,
      intentLevel: classifyIntent(text),
      technicalScore: analyzeTechnicalDepth(text),
      category: categorizeFeedback(text)
    };
    addFeedback(feedback);
  }, [addFeedback]);

  // Energy boost from audience
  const boostEnergy = useCallback(() => {
    setEnergyScore(prev => Math.min(100, prev + 3));
    // Broadcast energy update for cross-tab sync
    localStorage.setItem(ENERGY_KEY, JSON.stringify({ 
      score: Math.min(100, energyScore + 3),
      timestamp: Date.now() 
    }));
  }, [energyScore]);

  // Producer acknowledge signal - broadcasts to all tabs
  const sendAcknowledge = useCallback(() => {
    setAcknowledgeFlash(true);
    setLastAcknowledged(Date.now());
    setTimeout(() => setAcknowledgeFlash(false), 500);
    
    // Broadcast to other tabs via localStorage
    localStorage.setItem(ACKNOWLEDGE_KEY, JSON.stringify({ 
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    }));
  }, []);

  // Listen for cross-tab acknowledge signals (for audience view)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACKNOWLEDGE_KEY && e.newValue) {
        const signal = JSON.parse(e.newValue);
        // Only trigger if it's a new signal (within last second)
        if (Date.now() - signal.timestamp < 1000) {
          setAcknowledgeFlash(true);
          setLastAcknowledged(signal.timestamp);
          setTimeout(() => setAcknowledgeFlash(false), 500);
        }
      }
      
      if (e.key === POLL_KEY && e.newValue) {
        const pollData = JSON.parse(e.newValue);
        setActivePoll(pollData);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Energy decay over time
  useEffect(() => {
    energyDecayRef.current = setInterval(() => {
      setEnergyScore(prev => Math.max(10, prev - 0.8));
    }, 2000);

    return () => {
      if (energyDecayRef.current) {
        clearInterval(energyDecayRef.current);
      }
    };
  }, []);

  // Update rankings whenever feedback changes
  useEffect(() => {
    const ranked = getRankedDecisions(feedbackItems, noiseGateEnabled);
    setRankedDecisions(ranked);
    setAiSummary(generateAISummary(ranked));
  }, [feedbackItems, noiseGateEnabled]);

  // Simulation loop
  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(() => {
        const newFeedback = generateFeedback();
        addFeedback(newFeedback);
        
        // Random energy boost from simulated audience
        if (Math.random() > 0.7) {
          setEnergyScore(prev => Math.min(100, prev + Math.floor(Math.random() * 5)));
        }
      }, simulationSpeed + Math.random() * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulating, simulationSpeed, generateFeedback, addFeedback]);

  // Poll functions with cross-tab sync
  const createPoll = useCallback((question: string, optionA: string, optionB: string) => {
    const poll: Poll = {
      id: `poll-${Date.now()}`,
      question,
      optionA,
      optionB,
      votesA: 0,
      votesB: 0,
      createdAt: Date.now(),
      isActive: true
    };
    setActivePoll(poll);
    // Broadcast to other tabs
    localStorage.setItem(POLL_KEY, JSON.stringify(poll));
    return poll;
  }, []);

  const votePoll = useCallback((option: 'A' | 'B') => {
    setActivePoll(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        votesA: option === 'A' ? prev.votesA + 1 : prev.votesA,
        votesB: option === 'B' ? prev.votesB + 1 : prev.votesB
      };
      localStorage.setItem(POLL_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const closePoll = useCallback(() => {
    setActivePoll(prev => {
      if (!prev) return null;
      const updated = { ...prev, isActive: false };
      localStorage.setItem(POLL_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearPoll = useCallback(() => {
    setActivePoll(null);
    localStorage.removeItem(POLL_KEY);
  }, []);

  return {
    feedbackItems,
    rankedDecisions,
    aiSummary,
    noiseGateEnabled,
    setNoiseGateEnabled,
    isSimulating,
    setIsSimulating,
    submitFeedback,
    activePoll,
    createPoll,
    votePoll,
    closePoll,
    clearPoll,
    newHighIntent,
    // Energy system
    energyScore,
    boostEnergy,
    acknowledgeFlash,
    sendAcknowledge,
    lastAcknowledged
  };
}