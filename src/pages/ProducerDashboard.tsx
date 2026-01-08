import { motion } from 'framer-motion';
import { Headphones, Radio, Settings, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StreamPanel } from '@/components/producer/StreamPanel';
import { RankingTable } from '@/components/producer/RankingTable';
import { AISummaryPanel } from '@/components/producer/AISummaryPanel';
import { NoiseGateToggle } from '@/components/producer/NoiseGateToggle';
import { PollCreator } from '@/components/producer/PollCreator';
import { FeedbackStream } from '@/components/producer/FeedbackStream';
import { useFeedbackSimulation } from '@/hooks/useFeedbackSimulation';
import { Link } from 'react-router-dom';

export default function ProducerDashboard() {
  const {
    feedbackItems,
    rankedDecisions,
    aiSummary,
    noiseGateEnabled,
    setNoiseGateEnabled,
    isSimulating,
    setIsSimulating,
    activePoll,
    createPoll,
    closePoll,
    clearPoll,
    newHighIntent
  } = useFeedbackSimulation(1500);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Headphones className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Producer Co-Pilot</h1>
            <p className="text-xs text-muted-foreground">Real-time crowd intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Simulation Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSimulating(!isSimulating)}
            className="text-xs"
          >
            <Radio className={`w-3.5 h-3.5 mr-1.5 ${isSimulating ? 'text-success' : ''}`} />
            {isSimulating ? 'Live' : 'Paused'}
          </Button>

          {/* Audience View Link */}
          <Link to="/audience">
            <Button variant="outline" size="sm" className="text-xs">
              <Maximize2 className="w-3.5 h-3.5 mr-1.5" />
              Audience View
            </Button>
          </Link>

          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="h-[calc(100vh-3.5rem)] p-4 grid grid-cols-12 gap-4">
        {/* Left Column - Stream & Controls */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* Stream Panel */}
          <div className="flex-1">
            <StreamPanel viewerCount={1247 + Math.floor(Math.random() * 50)} />
          </div>

          {/* Noise Gate Toggle */}
          <NoiseGateToggle 
            enabled={noiseGateEnabled} 
            onToggle={setNoiseGateEnabled} 
          />

          {/* Poll Creator */}
          <PollCreator
            activePoll={activePoll}
            onCreatePoll={createPoll}
            onClosePoll={closePoll}
            onClearPoll={clearPoll}
          />
        </div>

        {/* Center Column - Ranking Table */}
        <div className="col-span-6">
          <motion.div 
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RankingTable 
              decisions={rankedDecisions} 
              highlightedId={newHighIntent}
            />
          </motion.div>
        </div>

        {/* Right Column - AI Summary & Feed */}
        <div className="col-span-3 flex flex-col gap-4">
          {/* AI Summary */}
          <div className="h-[280px]">
            <AISummaryPanel summary={aiSummary} />
          </div>

          {/* Live Feedback Stream */}
          <div className="flex-1">
            <FeedbackStream 
              items={feedbackItems}
              noiseGateEnabled={noiseGateEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
