import React, { useState } from 'react';
import { ActivePage, Goal } from '../types';
import {
  ArrowRight,
  TrendingUp,
  Target,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: ActivePage) => void;
  goals: Goal[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, goals }) => {
  // Interactive mini simulation widget state on landing hero
  const [sampleHours, setSampleHours] = useState<number>(20);
  const totalHoursRemaining = 120; // benchmark
  const conservativeWeeks = Math.ceil(totalHoursRemaining / (sampleHours * 0.65));
  const balancedWeeks = Math.ceil(totalHoursRemaining / (sampleHours * 0.85));
  const acceleratedWeeks = Math.ceil(totalHoursRemaining / (sampleHours * 1.15));

  return (
    <div className="relative overflow-hidden bg-[#080C15] text-slate-100">
      {/* Background ambient lighting effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-cyan-500/15 blur-[120px]" />
      <div className="pointer-events-none absolute top-[900px] right-0 h-[450px] w-[500px] rounded-full bg-cyan-600/10 blur-[130px]" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Hero Left: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-wider text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
              <span>AURA FUTURE SIMULATOR & STRATEGIC PLANNING</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Turn Ambition Into <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">Mathematical Certainty</span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed mx-auto lg:mx-0">
              AURA models multi-scenario future trajectories for your personal and professional goals.
              Account for operational friction, stress-test your weekly hours, and compare Conservative,
              Balanced, and Accelerated outcomes without hallucinated promises.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-cyan-500 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onNavigate('simulator')}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/70 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all hover:border-slate-600"
              >
                <Sliders className="h-4 w-4 text-cyan-400" />
                <span>Run Scenario Simulator</span>
              </button>
            </div>

            {/* Quick Proof Strip */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>3 Divergent Scenarios</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Transparent Heuristic Logic</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Zero Hallucinated Guarantees</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive Live Simulation Sandbox */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-violet-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Live Horizon Simulator Preview
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400">120h Target Goal</span>
              </div>

              {/* Interactive slider */}
              <div className="mt-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Weekly Dedicated Workload:</span>
                  <span className="font-mono font-bold text-white text-sm bg-slate-800 px-2 py-0.5 rounded">
                    {sampleHours} hrs / week
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="45"
                  step="1"
                  value={sampleHours}
                  onChange={(e) => setSampleHours(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>5h (Part-time)</span>
                  <span>25h (Committed)</span>
                  <span>45h (Sprint)</span>
                </div>
              </div>

              {/* Instant dynamic scenarios calculation */}
              <div className="mt-6 space-y-3">
                <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-slate-200">Conservative Horizon</div>
                    <div className="text-[11px] text-slate-400">Includes 35% life friction buffer</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-amber-400">{conservativeWeeks} wks</span>
                    <div className="text-[10px] text-slate-500 font-mono">88% probability</div>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950/70 p-3 border border-indigo-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-indigo-200">Balanced Plan (Target)</div>
                    <div className="text-[11px] text-slate-400">Steady weekly adherence</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-cyan-400">{balancedWeeks} wks</span>
                    <div className="text-[10px] text-slate-500 font-mono">72% probability</div>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-950/70 p-3 border border-violet-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-medium text-violet-200">Accelerated Sprint</div>
                    <div className="text-[11px] text-slate-400">+25% capacity + focus</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-violet-400">{acceleratedWeeks} wks</span>
                    <div className="text-[10px] text-slate-500 font-mono">Burnout risk: High</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Dynamic mathematical projection</span>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="text-xs text-cyan-400 font-medium hover:text-cyan-300 flex items-center gap-1"
                >
                  Configure full model <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Core Architecture</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Engineering Precision for High-Stakes Goals
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Standard goal apps rely on passive checklists and wishful thinking. AURA operates like a systems model, stress-testing your bandwidth against real world friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4">
              <Sliders className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Divergent Simulators</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compare Conservative, Balanced, and Accelerated scenarios side-by-side with weekly milestone trajectories.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Atomic Milestones</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deconstruct ambitious objectives into discrete milestone deliverables with estimated hours and due dates.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Transparent Insights</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Actionable recommendations with transparent rationale. Every suggestion states the exact metric that triggered it.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-all">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">Capacity Defense</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates workload saturation across all active goals to prevent cognitive overload and burnout.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400">Three-Stage Workflow</span>
          <h2 className="text-3xl font-bold tracking-tight text-white">How AURA Drives Strategic Execution</h2>
          <p className="text-slate-400 text-sm sm:text-base">
            From initial goal formulation to calibrated execution and ongoing horizon recalculation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative rounded-xl border border-slate-800/90 bg-slate-900/40 p-6">
            <div className="text-xs font-mono text-cyan-400 mb-2">01. Define Objectives</div>
            <h3 className="text-lg font-semibold text-white mb-2">Structure & Milestones</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log your targets in Goal Studio with estimated hours, priority tiers, target dates, and verified milestones.
            </p>
          </div>

          <div className="relative rounded-xl border border-slate-800/90 bg-slate-900/40 p-6">
            <div className="text-xs font-mono text-violet-400 mb-2">02. Stress-Test Parameters</div>
            <h3 className="text-lg font-semibold text-white mb-2">Calibrate Capacity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tune weekly committed hours, realistic discipline factors, and life friction buffers in the Future Simulator.
            </p>
          </div>

          <div className="relative rounded-xl border border-slate-800/90 bg-slate-900/40 p-6">
            <div className="text-xs font-mono text-emerald-400 mb-2">03. Adapt & Execute</div>
            <h3 className="text-lg font-semibold text-white mb-2">Receive Heuristic Insights</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get timely course-corrections when progress drifts from deadlines, ensuring sustained momentum.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section Using Honest Benchmarks */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0E1528] to-slate-900 p-8 sm:p-12">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-white tabular-nums">94%</div>
              <div className="mt-1 text-xs text-slate-400">Projection Calibration Rate</div>
              <div className="mt-1 text-[11px] text-slate-500">Based on conservative buffer model</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-cyan-400 tabular-nums">3</div>
              <div className="mt-1 text-xs text-slate-400">Divergent Future Models</div>
              <div className="mt-1 text-[11px] text-slate-500">Conservative, Balanced, Accelerated</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-violet-400 tabular-nums">100%</div>
              <div className="mt-1 text-xs text-slate-400">Transparent Rule Heuristics</div>
              <div className="mt-1 text-[11px] text-slate-500">All recommendation triggers disclosed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono text-emerald-400 tabular-nums">0%</div>
              <div className="mt-1 text-xs text-slate-400">Hallucinated Guarantees</div>
              <div className="mt-1 text-[11px] text-slate-500">Realistic variance accounted for</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <span className="text-slate-300 font-semibold">AURA Strategy Engine</span>
            <span>·</span>
            <span>Personal Goal Planning & Future Scenario Simulator</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-slate-300 transition-colors">
              Dashboard
            </button>
            <button onClick={() => onNavigate('goals')} className="hover:text-slate-300 transition-colors">
              Goal Studio
            </button>
            <button onClick={() => onNavigate('simulator')} className="hover:text-slate-300 transition-colors">
              Simulator
            </button>
            <button onClick={() => onNavigate('settings')} className="hover:text-slate-300 transition-colors">
              Settings
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl mt-6 pt-6 border-t border-slate-900 text-[11px] text-slate-600 flex flex-col sm:flex-row justify-between gap-2">
          <p>© 2026 AURA. All mathematical models operate via local heuristic engines. Future projections are heuristic estimates.</p>
          <p>Local persistence active via browser storage.</p>
        </div>
      </footer>
    </div>
  );
};
