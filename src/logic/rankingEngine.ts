// Ranking Engine - Weighted Global Ranking Algorithm for Producer Co-Pilot

export type IntentLevel = 'high' | 'medium' | 'low';

export interface FeedbackItem {
  id: string;
  text: string;
  timestamp: number;
  userId: string;
  intentLevel: IntentLevel;
  technicalScore: number; // 0-100
  category: string;
}

export interface RankedDecision {
  id: string;
  suggestion: string;
  category: string;
  frequency: number;
  confidenceScore: number; // 0-100 percentage
  intentLevel: IntentLevel;
  recencyBoost: number;
  totalScore: number;
  contributors: string[];
  lastUpdated: number;
  isHighlighted: boolean;
}

// Expanded technical audio terms for enhanced noise gate
const TECHNICAL_TERMS = [
  // Core Mixing Terms
  'compression', 'compressor', 'reverb', 'delay', 'eq', 'equalizer', 'bass', 'treble',
  'mid', 'midrange', 'high-end', 'low-end', 'sidechain', 'limiter', 'saturation',
  'distortion', 'filter', 'cutoff', 'resonance', 'attack', 'release',
  'threshold', 'ratio', 'gain', 'volume', 'pan', 'panning', 'stereo', 'mono',
  
  // Drums & Percussion
  'kick', 'snare', 'hi-hat', 'hihat', 'cymbal', 'clap', 'percussion', 'drum', 'drums',
  'transient', 'punch', 'snap', 'thump',
  
  // Synths & Sound Design
  'synth', 'synthesizer', 'pad', 'lead', 'pluck', 'arp', 'arpeggio', 'bassline',
  'oscillator', 'osc', 'wavetable', 'lfo', 'envelope', 'adsr', 'modulation',
  'filter sweep', 'wobble', 'growl',
  
  // Arrangement & Structure
  'drop', 'build', 'buildup', 'breakdown', 'verse', 'chorus', 'bridge', 'intro', 'outro',
  'transition', 'fill', 'riser', 'impact', 'tension', 'release',
  
  // Frequency & Spectrum
  'frequency', 'hz', 'khz', 'spectrum', 'bandwidth', 'q', 'shelf', 'notch', 'peak',
  'sub', 'sub-bass', 'presence', 'air', 'sparkle', 'body', 'warmth',
  
  // Dynamics & Levels
  'db', 'decibel', 'lufs', 'rms', 'peak', 'headroom', 'dynamic', 'dynamics',
  'louder', 'quieter', 'boost', 'cut', 'reduce', 'increase',
  
  // Effects & Processing
  'chorus', 'flanger', 'phaser', 'bitcrusher', 'vocoder', 'pitch', 'detune',
  'doubling', 'parallel', 'wet', 'dry', 'send', 'return', 'bus',
  'de-esser', 'de-essing', 'multiband', 'sibilance',
  
  // Spatial & Stereo
  'stereo width', 'width', 'narrow', 'wide', 'mono', 'phase', 'imaging',
  'depth', 'space', 'room', 'hall', 'plate', 'ambient',
  
  // Descriptive Audio Terms
  'muddy', 'crisp', 'punchy', 'warm', 'bright', 'dark', 'harsh', 'thin',
  'fat', 'thick', 'clean', 'dirty', 'gritty', 'smooth', 'sharp', 'dull',
  'boomy', 'boxy', 'nasal', 'airy', 'tight', 'loose',
  
  // Vocals
  'vocal', 'vocals', 'vox', 'voice', 'lyrics', 'verse', 'hook',
  
  // Technical Actions
  'automate', 'automation', 'sidechain', 'ducking', 'gating', 'noise gate',
  'sample', 'loop', 'chop', 'slice', 'bounce', 'render'
];

// Low-intent noise patterns
const NOISE_PATTERNS = [
  'lfg', 'fire', 'lit', 'goat', 'vibes', 'sick', 'dope', 'insane',
  'crazy', 'amazing', 'love it', 'yes', 'no', 'wow', 'omg', 'lol',
  'nice', 'cool', 'good', 'great', 'awesome', 'perfect', 'beautiful',
  '🔥', '💯', '🎵', '🎶', '❤️', '👏', '🙌', '💪', '😍', '🤩', '💥', '🚀',
  'w', 'dub', 'lets go', "let's go", 'go off', 'sheesh', 'bussin'
];

/**
 * Analyzes feedback text and returns technical depth score (0-100)
 */
export function analyzeTechnicalDepth(text: string): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  let matchedTerms = 0;

  TECHNICAL_TERMS.forEach(term => {
    if (lowerText.includes(term)) {
      matchedTerms++;
      score += 12; // Each technical term adds weight
    }
  });

  // Bonus for specific numeric values (e.g., "reduce by 3db", "at 120hz")
  const hasNumbers = /\d+\s*(db|hz|khz|bpm|ms|%)/i.test(text);
  if (hasNumbers) score += 30;

  // Bonus for comparative language
  const hasComparison = /(more|less|too much|too little|reduce|increase|lower|higher|boost|cut|needs?|try|add|remove)/i.test(text);
  if (hasComparison) score += 15;

  // Bonus for specific suggestions with "at" or location context
  const hasLocation = /(at|around|in the|on the|during|after|before)/i.test(text);
  if (hasLocation) score += 10;

  // Bonus for actionable suggestions
  const hasAction = /(try|maybe|could|should|consider|suggest|would|automate|sidechain)/i.test(text);
  if (hasAction) score += 10;

  // Extra bonus for multiple technical terms
  if (matchedTerms >= 3) score += 15;

  return Math.min(100, score);
}

/**
 * Determines intent level based on text analysis
 */
export function classifyIntent(text: string): IntentLevel {
  const lowerText = text.toLowerCase();
  
  // Check for noise patterns
  const isNoise = NOISE_PATTERNS.some(pattern => 
    lowerText.includes(pattern.toLowerCase()) || text.includes(pattern)
  );
  
  // Very short messages with only noise are low intent
  if (text.length < 12 && isNoise) return 'low';
  
  // Pure emoji messages are low intent
  const emojiOnly = /^[\p{Emoji}\s]+$/u.test(text);
  if (emojiOnly) return 'low';
  
  const technicalScore = analyzeTechnicalDepth(text);
  
  if (technicalScore >= 35) return 'high';
  if (technicalScore >= 15) return 'medium';
  return 'low';
}

/**
 * Categorizes feedback into actionable categories
 */
export function categorizeFeedback(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (/bass|low-end|sub|kick|low freq|808|thump/i.test(lowerText)) return 'Low End';
  if (/high|treble|bright|crisp|hi-hat|hihat|air|sparkle|sibilant/i.test(lowerText)) return 'High End';
  if (/mid|presence|vocal|voice|body|nasal|boxy/i.test(lowerText)) return 'Mids/Vocals';
  if (/compress|dynamic|punch|transient|limiter|louder/i.test(lowerText)) return 'Dynamics';
  if (/reverb|delay|space|room|hall|ambient|wet|dry/i.test(lowerText)) return 'Space/FX';
  if (/mix|balance|level|volume|too loud|too quiet/i.test(lowerText)) return 'Mix Balance';
  if (/synth|lead|pad|sound design|oscillator|wavetable/i.test(lowerText)) return 'Sound Design';
  if (/arrangement|structure|drop|build|breakdown|transition|riser/i.test(lowerText)) return 'Arrangement';
  if (/tempo|bpm|speed|faster|slower|groove|swing/i.test(lowerText)) return 'Tempo/Groove';
  if (/stereo|width|pan|imaging|mono|phase/i.test(lowerText)) return 'Stereo Image';
  
  return 'General';
}

/**
 * Calculates recency boost (higher for recent feedback)
 * Feedback in last 30 seconds gets full boost, decays over time
 */
export function calculateRecencyBoost(timestamp: number): number {
  const now = Date.now();
  const ageSeconds = (now - timestamp) / 1000;
  
  if (ageSeconds <= 15) return 100;
  if (ageSeconds <= 30) return 90;
  if (ageSeconds <= 60) return 70;
  if (ageSeconds <= 120) return 50;
  if (ageSeconds <= 300) return 30;
  return 15;
}

/**
 * Main ranking function - aggregates and ranks all feedback
 */
export function getRankedDecisions(
  feedbackItems: FeedbackItem[],
  noiseGateEnabled: boolean = true
): RankedDecision[] {
  // Filter out low-intent if noise gate is enabled
  const filteredFeedback = noiseGateEnabled
    ? feedbackItems.filter(item => item.intentLevel !== 'low')
    : feedbackItems;

  // Group similar suggestions
  const groupedSuggestions = new Map<string, FeedbackItem[]>();
  
  filteredFeedback.forEach(item => {
    // Create a normalized key for grouping similar feedback
    const category = categorizeFeedback(item.text);
    const key = `${category}-${item.text.toLowerCase().substring(0, 50)}`;
    
    if (!groupedSuggestions.has(key)) {
      groupedSuggestions.set(key, []);
    }
    groupedSuggestions.get(key)!.push(item);
  });

  // Calculate scores for each group
  const rankedDecisions: RankedDecision[] = [];
  
  groupedSuggestions.forEach((items, key) => {
    const latestItem = items.reduce((a, b) => 
      a.timestamp > b.timestamp ? a : b
    );
    
    const frequency = items.length;
    const avgTechnicalScore = items.reduce((sum, i) => sum + i.technicalScore, 0) / items.length;
    const avgRecency = items.reduce((sum, i) => sum + calculateRecencyBoost(i.timestamp), 0) / items.length;
    
    // Weighted total score (40% technical, 35% recency, 25% volume)
    const totalScore = 
      (avgTechnicalScore * 0.4) +
      (avgRecency * 0.35) +
      (Math.min(frequency * 10, 100) * 0.25);

    // Confidence score based on agreement and technical depth
    const confidenceScore = Math.min(100, 
      (frequency * 12) +
      (avgTechnicalScore * 0.5) +
      (avgRecency * 0.15)
    );

    // Determine highest intent level in group
    const hasHighIntent = items.some(i => i.intentLevel === 'high');
    const hasMediumIntent = items.some(i => i.intentLevel === 'medium');
    const intentLevel: IntentLevel = hasHighIntent ? 'high' : hasMediumIntent ? 'medium' : 'low';

    rankedDecisions.push({
      id: key,
      suggestion: latestItem.text,
      category: categorizeFeedback(latestItem.text),
      frequency,
      confidenceScore: Math.round(confidenceScore),
      intentLevel,
      recencyBoost: Math.round(avgRecency),
      totalScore: Math.round(totalScore),
      contributors: [...new Set(items.map(i => i.userId))],
      lastUpdated: latestItem.timestamp,
      isHighlighted: Date.now() - latestItem.timestamp < 5000 && intentLevel === 'high'
    });
  });

  // Sort by total score descending
  return rankedDecisions.sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Generates AI summary from ranked decisions
 */
export function generateAISummary(decisions: RankedDecision[]): string {
  if (decisions.length === 0) {
    return "No actionable feedback yet. Crowd is listening...";
  }

  const topDecisions = decisions.slice(0, 3);
  const categories = [...new Set(topDecisions.map(d => d.category))];
  
  let summary = `🎯 Top Focus: ${categories.join(', ')}\n\n`;
  
  topDecisions.forEach((decision, index) => {
    const confidence = decision.confidenceScore;
    const emoji = confidence >= 70 ? '🟢' : confidence >= 40 ? '🟡' : '⚪';
    summary += `${index + 1}. ${emoji} "${decision.suggestion.substring(0, 60)}${decision.suggestion.length > 60 ? '...' : ''}" (${confidence}% confident, ${decision.frequency} votes)\n`;
  });

  const totalVoters = decisions.reduce((sum, d) => sum + d.contributors.length, 0);
  summary += `\n📊 ${totalVoters} active contributors`;

  return summary;
}

// Poll Types
export interface Poll {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
  createdAt: number;
  isActive: boolean;
}

export interface PollVote {
  pollId: string;
  option: 'A' | 'B';
  userId: string;
  timestamp: number;
}