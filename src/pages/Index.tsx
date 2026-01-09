import { motion } from 'framer-motion';
import { Headphones, Users, Zap, Shield, BarChart3, Radio, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Shield,
    title: 'Noise-Gate AI',
    description: 'Filters low-intent noise ("LFG", "🔥") from high-intent technical feedback automatically.'
  },
  {
    icon: BarChart3,
    title: 'Global Ranking',
    description: 'Real-time weighted algorithm ranks suggestions by technical depth, recency, and volume.'
  },
  {
    icon: Zap,
    title: 'Instant A/B Polls',
    description: 'Trigger micro-decisions to your audience. Get instant results on your choices.'
  },
  {
    icon: Users,
    title: 'Crowd Intelligence',
    description: 'Turn thousands of opinions into actionable, ranked decisions in real-time.'
  }
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Radio className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Real-Time Crowd Intelligence</span>
            </motion.div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Producer-Crowd</span>
              <br />
              <span className="text-primary">Co-Pilot</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Transform chaotic live feedback into ranked, actionable decisions. 
              Stay in control while your crowd helps shape the sound.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/producer">
                <Button size="lg" className="h-14 px-8 text-lg gap-2 glow-primary">
                  <Headphones className="w-5 h-5" />
                  Producer Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/audience">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg gap-2">
                  <Users className="w-5 h-5" />
                  Audience View
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            className="mt-16 relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="studio-panel p-1 rounded-xl overflow-hidden">
              <div className="aspect-video bg-studio-surface rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Mock dashboard preview */}
                <div className="absolute inset-0 p-4 grid grid-cols-12 gap-4 opacity-50">
                  <div className="col-span-3 bg-muted/30 rounded-lg" />
                  <div className="col-span-6 bg-muted/30 rounded-lg" />
                  <div className="col-span-3 bg-muted/30 rounded-lg" />
                </div>
                
                <div className="text-center z-10">
                  <Headphones className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Click "Producer Dashboard" to see it in action</p>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              className="absolute -top-4 -right-4 studio-panel p-3 rounded-lg animate-pulse-glow"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs font-medium">High-Intent</p>
                  <p className="text-xs text-muted-foreground">87% confidence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Studio-Grade Intelligence</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built for producers who want crowd input without the chaos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="studio-panel p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary" />
            <span className="font-semibold">Producer Co-Pilot</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time crowd intelligence for music producers
          </p>
        </div>
      </footer>
    </div>
  );
}
