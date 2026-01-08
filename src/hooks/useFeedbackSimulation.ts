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
  
  // Medium Intent
  "Love the melody but bass feels weak",
  "The mix sounds good but needs more energy",
  "Vibes are right, maybe more reverb?",
  "Great track, the drop could be bigger though",
  "Feeling the groove, drums could hit harder",
  
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
  "Wow"
];

const USERNAMES = [
  'BassHead_Mike', 'SynthWizard', 'DrumMachine99', 'MixMaster_J', 
  'VinylVibes', 'StudioPro', 'BeatDropper', 'FreqHunter',
  'WaveRider', 'SoundSculptor', 'GrooveMaker', 'AudioNerd42'
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
  }, []);

  // Producer acknowledge signal
  const sendAcknowledge = useCallback(() => {
    setAcknowledgeFlash(true);
    setLastAcknowledged(Date.now());
    setTimeout(() => setAcknowledgeFlash(false), 500);
  }, []);

  // Energy decay over time
  useEffect(() => {
    energyDecayRef.current = setInterval(() => {
      setEnergyScore(prev => Math.max(10, prev - 1));
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

  // Poll functions
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
    return poll;
  }, []);

  const votePoll = useCallback((option: 'A' | 'B') => {
    setActivePoll(prev => {
      if (!prev) return null;
      return {
        ...prev,
        votesA: option === 'A' ? prev.votesA + 1 : prev.votesA,
        votesB: option === 'B' ? prev.votesB + 1 : prev.votesB
      };
    });
  }, []);

  const closePoll = useCallback(() => {
    setActivePoll(prev => prev ? { ...prev, isActive: false } : null);
  }, []);

  const clearPoll = useCallback(() => {
    setActivePoll(null);
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
