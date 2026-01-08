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

// Technical audio terms for intent detection
const TECHNICAL_TERMS = [
  'compression', 'reverb', 'delay', 'eq', 'equalizer', 'bass', 'treble',
  'mid', 'high-end', 'low-end', 'sidechain', 'limiter', 'saturation',
  'distortion', 'filter', 'cutoff', 'resonance', 'attack', 'release',
  'threshold', 'ratio', 'gain', 'volume', 'pan', 'stereo', 'mono',
  'kick', 'snare', 'hi-hat', 'synth', 'pad', 'lead', 'bassline',
  'drop', 'build', 'breakdown', 'verse', 'chorus', 'bridge',
  'bpm', 'tempo', 'key', 'melody', 'harmony', 'chord', 'arpeggio',
  'modulation', 'lfo', 'envelope', 'oscillator', 'wavetable',
  'sample', 'loop', 'transient', 'sustain', 'decay', 'adsr',
  'db', 'decibel', 'frequency', 'hz', 'khz', 'spectrum',
  'muddy', 'crisp', 'punchy', 'warm', 'bright', 'dark', 'harsh'
];

// Low-intent noise patterns
const NOISE_PATTERNS = [
  'lfg', 'fire', 'lit', 'goat', 'vibes', 'sick', 'dope', 'insane',
  'crazy', 'amazing', 'love it', 'yes', 'no', 'wow', 'omg',
  '🔥', '💯', '🎵', '🎶', '❤️', '👏', '🙌', '💪'
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
      score += 15; // Each technical term adds weight
    }
  });

  // Bonus for specific numeric values (e.g., "reduce by 3db", "at 120hz")
  const hasNumbers = /\d+\s*(db|hz|khz|bpm|ms|%)/i.test(text);
  if (hasNumbers) score += 25;

  // Bonus for comparative language
  const hasComparison = /(more|less|too|reduce|increase|lower|higher|boost|cut)/i.test(text);
  if (hasComparison) score += 15;

  // Bonus for specific suggestions
  const hasSpecific = /(try|maybe|could|should|consider)/i.test(text);
  if (hasSpecific) score += 10;

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
  if (text.length < 10 && isNoise) return 'low';
  
  const technicalScore = analyzeTechnicalDepth(text);
  
  if (technicalScore >= 40) return 'high';
  if (technicalScore >= 15) return 'medium';
  return 'low';
}

/**
 * Categorizes feedback into actionable categories
 */
export function categorizeFeedback(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (/bass|low-end|sub|kick/i.test(lowerText)) return 'Low End';
  if (/high|treble|bright|crisp|hi-hat/i.test(lowerText)) return 'High End';
  if (/mid|presence|vocal/i.test(lowerText)) return 'Mids';
  if (/compress|dynamic|punch/i.test(lowerText)) return 'Dynamics';
  if (/reverb|delay|space|room/i.test(lowerText)) return 'Space/FX';
  if (/mix|balance|level|volume/i.test(lowerText)) return 'Mix Balance';
  if (/synth|lead|pad|sound design/i.test(lowerText)) return 'Sound Design';
  if (/arrangement|structure|drop|build/i.test(lowerText)) return 'Arrangement';
  if (/tempo|bpm|speed|faster|slower/i.test(lowerText)) return 'Tempo';
  
  return 'General';
}

/**
 * Calculates recency boost (higher for recent feedback)
 * Feedback in last 30 seconds gets full boost, decays over time
 */
export function calculateRecencyBoost(timestamp: number): number {
  const now = Date.now();
  const ageSeconds = (now - timestamp) / 1000;
  
  if (ageSeconds <= 30) return 100;
  if (ageSeconds <= 60) return 80;
  if (ageSeconds <= 120) return 60;
  if (ageSeconds <= 300) return 40;
  return 20;
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
    
    // Weighted total score
    const totalScore = 
      (avgTechnicalScore * 0.4) + // Technical depth: 40%
      (avgRecency * 0.35) +       // Recency: 35%
      (Math.min(frequency * 10, 100) * 0.25); // Volume: 25% (capped)

    // Confidence score based on agreement and technical depth
    const confidenceScore = Math.min(100, 
      (frequency * 15) + // More people = more confidence
      (avgTechnicalScore * 0.5) + // Technical suggestions are more reliable
      (avgRecency * 0.2) // Recent consensus matters
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
  odllId: string;
  option: 'A' | 'B';
  userId: string;
  timestamp: number;
}
