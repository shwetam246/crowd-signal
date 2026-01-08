import { motion } from 'framer-motion';
import { Headphones, Radio, Settings, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EnergyBackground } from '@/components/EnergyBackground';
import { LiveStreamPlayer } from '@/components/producer/LiveStreamPlayer';
import { ProducerEditor } from '@/components/producer/ProducerEditor';
import { RankingTable } from '@/components/producer/RankingTable';
import { AISummaryPanel } from '@/components/producer/AISummaryPanel';
import { NoiseGateToggle } from '@/components/producer/NoiseGateToggle';
import { PollCreator } from '@/components/producer/PollCreator';
import { AcknowledgeButton } from '@/components/producer/AcknowledgeButton';
import { useFeedbackSimulation } from '@/hooks/useFeedbackSimulation';
import { Link } from 'react-router-dom';

export default function ProducerDashboard() {
  const {
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
    newHighIntent,
    energyScore,
    sendAcknowledge,
    lastAcknowledged
  } = useFeedbackSimulation(1500);

  return (
    <EnergyBackground energyScore={energyScore}>
      <div className="min-h-screen">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Headphones className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Producer Command Center</h1>
              <p className="text-xs text-muted-foreground">Real-time crowd intelligence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Energy Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
              <span className="text-xs text-muted-foreground">Energy</span>
              <span className="text-sm font-bold text-primary">{energyScore}%</span>
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-[hsl(270,60%,55%)]"
                  animate={{ width: `${energyScore}%` }}
                />
              </div>
            </div>

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
            {/* Live Stream Player */}
            <div className="h-[320px]">
              <LiveStreamPlayer 
                viewerCount={1247 + Math.floor(Math.random() * 50)} 
                energyScore={energyScore}
              />
            </div>

            {/* Acknowledge Button */}
            <AcknowledgeButton 
              onAcknowledge={sendAcknowledge}
              lastAcknowledged={lastAcknowledged}
            />

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

          {/* Center Column - Producer Editor & Ranking */}
          <div className="col-span-6 flex flex-col gap-4">
            {/* Producer Editor - Decision Workspace */}
            <div className="h-[380px]">
              <motion.div 
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ProducerEditor 
                  rankedDecisions={rankedDecisions}
                  onApplySuggestion={(suggestion) => {
                    console.log('Applied suggestion:', suggestion);
                  }}
                />
              </motion.div>
            </div>

            {/* Ranking Table */}
            <motion.div 
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <RankingTable 
                decisions={rankedDecisions} 
                highlightedId={newHighIntent}
              />
            </motion.div>
          </div>

          {/* Right Column - AI Summary */}
          <div className="col-span-3 flex flex-col gap-4">
            {/* AI Summary */}
            <div className="flex-1">
              <AISummaryPanel summary={aiSummary} />
            </div>
          </div>
        </div>
      </div>
    </EnergyBackground>
  );
}
