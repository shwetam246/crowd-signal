import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Music, CheckCircle, Play, Mic2 } from 'lucide-react';

export default function App() {
  // 1. STATES
  const [energyScore, setEnergyScore] = useState(30);
  const [signalActive, setSignalActive] = useState(false);
  const [lyrics, setLyrics] = useState("Drowning in the neon lights, looking for a sign...");
  const [suggestions] = useState([
    { id: 1, text: "Change 'Neon' to 'Midnight'", votes: 15 },
    { id: 2, text: "Increase reverb on vocals", votes: 9 }
  ]);

  // 2. LOGIC FUNCTIONS
  const handleEnergyBoost = () => {
    setEnergyScore(prev => Math.min(prev + 5, 100));
  };

  const triggerSignal = () => {
    setSignalActive(true);
    setTimeout(() => setSignalActive(false), 1500);
  };

  const applyEdit = (newWord) => {
    setLyrics(lyrics.replace("neon", newWord.toLowerCase()));
  };

  // 3. DYNAMIC BACKGROUND LOGIC
  const getBgStyle = () => {
    if (energyScore > 80) return "from-purple-900 via-blue-900 to-cyan-900";
    if (energyScore > 50) return "from-slate-900 via-indigo-900 to-slate-950";
    return "from-[#0a0a0a] to-[#121212]";
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 bg-gradient-to-br ${getBgStyle()} text-white p-6 font-sans`}>
      
      {/* HEADER SECTION */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black tracking-tighter italic">LIVE STUDIO PRO</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
             <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest">Global Energy</span>
             <div className="w-32 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                <motion.div animate={{ width: `${energyScore}%` }} className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]" />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: PRODUCER STAGE & EDITOR (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live Video Placeholder */}
          <div className="relative aspect-video bg-black/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-xl">
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Play size={80} />
             </div>
             <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">LIVE</div>
          </div>

          {/* DECISION EDITOR (Alfred's Requirement) */}
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Mic2 size={16} /> Decision Editor
            </h3>
            <div className="text-2xl font-medium mb-6">"{lyrics}"</div>
            <div className="space-y-3">
              {suggestions.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-cyan-500/50 transition">
                  <span className="text-sm text-white/70">Suggestion: <b className="text-white">{s.text}</b></span>
                  <button onClick={() => applyEdit("Midnight")} className="bg-white text-black text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-cyan-400 transition">APPLY</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: RANKING & CONTROLS (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white/5 p-6 rounded-3xl border border-white/10 h-full">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Ranked Feedback</h3>
              <div className="space-y-4">
                 <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                    <p className="text-xs text-cyan-400 font-bold mb-1">MOST REQUESTED</p>
                    <p className="text-sm">"The kick drum is clipping the master channel"</p>
                 </div>
                 {/* PRODUCER SIGNAL BUTTON */}
                 <button 
                   onClick={triggerSignal}
                   className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-cyan-400 transition-all active:scale-95 shadow-xl shadow-white/5"
                 >
                   SIGNAL AUDIENCE (ACK)
                 </button>
              </div>
           </div>
        </div>
      </main>

      {/* AUDIENCE SECTION (Hidden below for interaction) */}
      <div className="mt-20 py-10 border-t border-white/10 flex flex-col items-center">
         <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-10">Audience Interaction Zone</p>
         <button 
           onMouseDown={handleEnergyBoost}
           className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)] active:scale-90 transition"
         >
           <Zap fill="white" />
         </button>
      </div>

      {/* ACKNOWLEDGMENT OVERLAY */}
      <AnimatePresence>
        {signalActive && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none border-[20px] border-cyan-500/50 z-50 flex items-center justify-center"
          >
            <div className="bg-cyan-500 text-black px-8 py-3 rounded-full font-black text-xl shadow-2xl">
               PRODUCER ACKNOWLEDGED!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
