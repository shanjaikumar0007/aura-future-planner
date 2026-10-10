import React, { useState, useMemo } from 'react';
import { Goal, SimulationParams, UserProfile } from '../types';
import { runScenarioSimulation } from '../services/simulatorEngine';
import {
  Sliders,
  ShieldAlert,
  TrendingUp,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface FutureSimulatorProps {
  goals: Goal[];
  profile: UserProfile;
  initialParams: SimulationParams;
  onSaveParams: (params: SimulationParams) => void;
  onLogSimulationRun: (goalTitle: string) => void;
}

export const FutureSimulator: React.FC<FutureSimulatorProps> = ({
  goals,
  profile,
  initialParams,
  onSaveParams,
  onLogSimulationRun,
}) => {
  const [params, setParams] = useState<SimulationParams>(initialParams);

  // Run deterministic multi-scenario simulation
  const simulation = useMemo(() => {
    return runScenarioSimulation(goals, params);
  }, [goals, params]);

  const handleParamChange = (key: keyof SimulationParams, value: any) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    onSaveParams(updated);
  };

  const activeGoals = goals.filter((g) => g.status !== 'completed');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title & Transparency Disclaimer */}
      <div className="pb-6 border-b border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400">MULTIVARIATE TRAJECTORY MODELER</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Future Scenario Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Simulate divergent execution futures by varying dedicated weekly hours, discipline factors, and life friction buffers.
            </p>
          </div>

          <button
            onClick={() => onLogSimulationRun(simulation.targetGoalTitle)}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            <span>Record Simulation Run</span>
          </button>
        </div>

        {/* Mandatory Transparency & Anti-Hype Notice */}
        <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-200/90 leading-relaxed">
            <strong className="text-white">Heuristic Scenario Estimation:</strong> All projected dates and timelines are calculated via mathematical sensitivity models based strictly on your input parameters. They illustrate divergent risk curves and operational capacity trade-offs, and are <strong>never presented as guaranteed predictions</strong>.
          </div>
        </div>
      </div>

      {/* Simulator Control Inputs */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">Scenario Parameters & Capacity Calibration</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Evaluating: <span className="text-cyan-400 font-medium">{simulation.targetGoalTitle}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Parameter 1: Target Goal Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Simulation Target
            </label>
            <select
              value={params.goalId}
              onChange={(e) => handleParamChange('goalId', e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">Composite Portfolio (All Active Goals)</option>
              {activeGoals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} ({g.progressPercentage}%)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Remaining workload: <span className="font-mono text-cyan-400">{simulation.remainingHoursEstimated}h</span>
            </p>
          </div>

          {/* Parameter 2: Dedicated Weekly Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Dedicated Hours / Week</span>
              <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {params.weeklyHoursDedicated} hrs
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="60"
              step="1"
              value={params.weeklyHoursDedicated}
              onChange={(e) => handleParamChange('weeklyHoursDedicated', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Part-Time (4h)</span>
              <span>Target ({profile.weeklyTargetHours}h)</span>
              <span>Intensive (60h)</span>
            </div>
          </div>

          {/* Parameter 3: Consistency & Discipline Factor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Discipline & Consistency</span>
              <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {(params.disciplineFactor * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.4"
              step="0.05"
              value={params.disciplineFactor}
              onChange={(e) => handleParamChange('disciplineFactor', parseFloat(e.target.value))}
              className="w-full accent-violet-400 h-2 bg-slate-800 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Fluctuating (50%)</span>
              <span>Nominal (100%)</span>
              <span>Relentless (140%)</span>
            </div>
          </div>

          {/* Parameter 4: Life Friction / Delay Risk */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Friction & Interruption Risk</span>
              <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                {(params.frictionRisk * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.55"
              step="0.05"
              value={params.frictionRisk}
              onChange={(e) => handleParamChange('frictionRisk', parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Protected (10%)</span>
              <span>Normal (25%)</span>
              <span>Volatile (55%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Scenario Cards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scenario 1: Conservative */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase text-amber-400 font-semibold tracking-wider">
                Conservative
              </span>
              <span className="font-mono text-xs text-slate-400">
                {simulation.scenarios.conservative.confidenceScore}% Confidence
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mt-2">
              {simulation.scenarios.conservative.estimatedWeeks} Weeks
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
              <Calendar className="h-3.5 w-3.5 text-amber-400" />
              <span>Projected: <strong>{simulation.scenarios.conservative.projectedDate}</strong></span>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {simulation.scenarios.conservative.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-semibold text-slate-300">Underlying Assumptions:</div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                {simulation.scenarios.conservative.assumptions.map((assump, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Burnout Risk: <strong className="text-emerald-400 font-normal">Low</strong></span>
            <span className="font-mono text-[11px] text-slate-500">Pace: {simulation.scenarios.conservative.velocityPerHour}x</span>
          </div>
        </div>

        {/* Scenario 2: Balanced (Target) */}
        <div className="rounded-xl border border-cyan-500/40 bg-slate-900/80 p-6 space-y-4 shadow-lg shadow-cyan-950/20 hover:border-cyan-500/60 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase text-cyan-400 font-semibold tracking-wider">
                Balanced (Target Plan)
              </span>
              <span className="font-mono text-xs text-cyan-300">
                {simulation.scenarios.balanced.confidenceScore}% Confidence
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mt-2">
              {simulation.scenarios.balanced.estimatedWeeks} Weeks
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <span>Projected: <strong>{simulation.scenarios.balanced.projectedDate}</strong></span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {simulation.scenarios.balanced.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-semibold text-slate-200">Underlying Assumptions:</div>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                {simulation.scenarios.balanced.assumptions.map((assump, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Burnout Risk: <strong className="text-amber-400 font-normal">Moderate</strong></span>
            <span className="font-mono text-[11px] text-cyan-400">Pace: {simulation.scenarios.balanced.velocityPerHour}x</span>
          </div>
        </div>

        {/* Scenario 3: Accelerated */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase text-violet-400 font-semibold tracking-wider">
                Accelerated Sprint
              </span>
              <span className="font-mono text-xs text-slate-400">
                {simulation.scenarios.accelerated.confidenceScore}% Confidence
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mt-2">
              {simulation.scenarios.accelerated.estimatedWeeks} Weeks
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
              <Calendar className="h-3.5 w-3.5 text-violet-400" />
              <span>Projected: <strong>{simulation.scenarios.accelerated.projectedDate}</strong></span>
            </div>

            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {simulation.scenarios.accelerated.description}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] font-semibold text-slate-300">Underlying Assumptions:</div>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                {simulation.scenarios.accelerated.assumptions.map((assump, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-violet-400 mt-0.5">•</span>
                    <span>{assump}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Burnout Risk: <strong className="text-rose-400 font-normal">High</strong></span>
            <span className="font-mono text-[11px] text-slate-500">Pace: {simulation.scenarios.accelerated.velocityPerHour}x</span>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Trajectory Chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h2 className="text-base font-semibold text-white">Projected Completion Trajectories (Week by Week)</h2>
            <p className="text-xs text-slate-400">
              Interactive sensitivity curves showing progress toward 100% completion across all three models.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Conservative
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="h-2 w-2 rounded-full bg-cyan-400" /> Balanced
            </span>
            <span className="flex items-center gap-1.5 text-violet-400">
              <span className="h-2 w-2 rounded-full bg-violet-400" /> Accelerated
            </span>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulation.timeline} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="label" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`, '']}
              />
              <Line
                type="monotone"
                dataKey="conservative"
                name="Conservative"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="balanced"
                name="Balanced (Target)"
                stroke="#06B6D4"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="accelerated"
                name="Accelerated Sprint"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <span>Simulation based on {params.weeklyHoursDedicated} hrs/wk dedicated and {simulation.remainingHoursEstimated} total remaining work hours.</span>
          <span className="font-mono text-cyan-400">Mathematical Heuristic v1.2</span>
        </div>
      </div>

      {/* Projected Milestone Dates Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">Projected Milestone Timeline Comparison</h2>
        <p className="text-xs text-slate-400">
          Estimated completion horizons for key milestones across the three scenarios.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="pb-3 font-medium">Milestone Objective</th>
                <th className="pb-3 font-medium text-amber-400">Conservative Horizon</th>
                <th className="pb-3 font-medium text-cyan-400">Balanced Plan</th>
                <th className="pb-3 font-medium text-violet-400">Accelerated Sprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {simulation.scenarios.balanced.milestoneProjections.map((m, idx) => {
                const consMilestone = simulation.scenarios.conservative.milestoneProjections[idx];
                const accMilestone = simulation.scenarios.accelerated.milestoneProjections[idx];

                return (
                  <tr key={m.milestoneId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-sans text-slate-200">{m.title}</td>
                    <td className="py-3 text-amber-300">{consMilestone?.projectedDate || 'N/A'}</td>
                    <td className="py-3 text-cyan-300 font-bold">{m.projectedDate}</td>
                    <td className="py-3 text-violet-300">{accMilestone?.projectedDate || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
