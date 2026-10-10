import React, { useState, useEffect } from 'react';
import { Goal, Recommendation, UserProfile, ActivePage } from '../types';
import { generateRecommendations } from '../services/insightEngine';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Info,
  ArrowRight,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface AIInsightsProps {
  goals: Goal[];
  profile: UserProfile;
  onNavigate: (page: ActivePage) => void;
  onOpenGoalStudio: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  goals,
  profile,
  onNavigate,
  onOpenGoalStudio,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'urgent' | 'moderate' | 'opportunity'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [engineSource, setEngineSource] = useState<'deterministic-rules' | 'gemini-model'>('deterministic-rules');
  const [rationaleSummary, setRationaleSummary] = useState<string>('');
  const [useAISynthesis, setUseAISynthesis] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const loadInsights = async (requestAI = false) => {
    setLoading(true);
    try {
      const result = await generateRecommendations(goals, profile, priorityFilter, requestAI);
      setRecommendations(result.recommendations);
      setEngineSource(result.engineSource);
      setRationaleSummary(result.rationaleSummary);
    } catch (e) {
      console.error('Error generating insights:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights(useAISynthesis);
  }, [goals, profile, priorityFilter]);

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-violet-400">STRATEGIC HEURISTICS & ADVICE</div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Strategic Insights Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Transparent, explainable strategic recommendations calculated directly from your goal timelines and capacity metrics.
          </p>
        </div>

        <button
          onClick={() => loadInsights(useAISynthesis)}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:from-violet-500 hover:to-indigo-500 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalculate Recommendations</span>
        </button>
      </div>

      {/* Engine Transparency Banner (Strictly truthful, no fake AI) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`h-2.5 w-2.5 rounded-full ${engineSource === 'gemini-model' ? 'bg-cyan-400' : 'bg-violet-400'}`} />
            <span className="text-xs font-mono uppercase font-semibold text-white">
              {engineSource === 'gemini-model'
                ? 'Engine: Gemini 2.5 Flash Synthesis (Grounded in Local Goals)'
                : 'Engine: Deterministic Strategic Heuristics (Rule-Based & Explainable)'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Synthesis Mode:</span>
            <button
              onClick={() => {
                const nextVal = !useAISynthesis;
                setUseAISynthesis(nextVal);
                loadInsights(nextVal);
              }}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                useAISynthesis
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {useAISynthesis ? 'Gemini Synthesis Active' : 'Deterministic Heuristics (Standard)'}
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {rationaleSummary}
        </p>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>
            Anti-Slop Transparency Guarantee: Every recommendation lists the exact numerical threshold or scheduling bottleneck that triggered it.
          </span>
        </div>
      </div>

      {/* Priority Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <span className="text-slate-400 px-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Recommendations' },
            { id: 'urgent', label: 'Urgent Bottlenecks' },
            { id: 'moderate', label: 'Moderate Optimizations' },
            { id: 'opportunity', label: 'Sprint Opportunities' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPriorityFilter(tab.id as any)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                priorityFilter === tab.id
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Generated <span className="font-mono text-cyan-400">{recommendations.length}</span> strategic insights
        </div>
      </div>

      {/* Recommendations Cards List */}
      {loading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-cyan-400 mb-2" />
          Evaluating scheduling equations and milestone critical paths...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
          <h3 className="text-base font-semibold text-white">All Active Initiatives Nominal</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No urgent bottlenecks, pacing deficits, or workload saturation detected under the current filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {recommendations.map((rec) => {
            const priorityBadge =
              rec.priority === 'urgent'
                ? 'text-rose-400'
                : rec.priority === 'moderate'
                ? 'text-amber-400'
                : 'text-emerald-400';

            return (
              <div
                key={rec.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-all"
              >
                {/* Header line: Zero-pill metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono uppercase font-semibold ${priorityBadge}`}>
                      {rec.priority} Priority
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="capitalize text-slate-400">{rec.category} Optimization</span>
                    {rec.targetGoalTitle && (
                      <>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-cyan-400 truncate max-w-xs">{rec.targetGoalTitle}</span>
                      </>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">
                    Source: {rec.engineSource === 'gemini-model' ? 'Gemini 2.5 Flash' : 'Rule Heuristic'}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rec.description}</p>
                </div>

                {/* Transparent Trigger & Metric Box */}
                <div className="rounded-lg border border-slate-800/90 bg-slate-950/70 p-3.5 space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-semibold text-slate-300">
                        Why this recommendation is displayed:
                      </div>
                      <p className="text-[11px] text-slate-400">{rec.rationale}</p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">Triggered Metric:</span>
                    <span className="text-cyan-400 font-medium">{rec.metricTriggered}</span>
                  </div>
                </div>

                {/* Actionable Steps Checklist */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-200">Recommended Action Plan:</div>
                  <div className="space-y-1.5">
                    {rec.actionableSteps.map((step, idx) => {
                      const stepKey = `${rec.id}-step-${idx}`;
                      const isDone = !!completedSteps[stepKey];

                      return (
                        <label
                          key={idx}
                          className="flex items-start gap-2.5 rounded bg-slate-950/40 p-2.5 border border-slate-800/50 hover:border-slate-700 cursor-pointer text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleStep(stepKey)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-cyan-500 accent-cyan-500 cursor-pointer"
                          />
                          <span className={`leading-snug ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {step}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Quick Link */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Take action directly in Goal Studio</span>
                  <button
                    onClick={onOpenGoalStudio}
                    className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                  >
                    <span>Open Goal Studio</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
