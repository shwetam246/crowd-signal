import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProducerDashboard from "./pages/ProducerDashboard";
import AudienceView from "./pages/AudienceView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/producer" element={<ProducerDashboard />} />
          <Route path="/audience" element={<AudienceView />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Background color state based on energyScore (0-100)
const getDynamicBg = (score) => {
  if (score > 80) return "bg-gradient-to-br from-purple-900 via-violet-800 to-blue-900 animate-pulse";
  if (score > 50) return "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900";
  return "bg-[#0a0a0a]"; // Default Studio Dark
};

export default App;
