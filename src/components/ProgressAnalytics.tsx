import React, { useState } from 'react';
import { Goal, GoalCategory } from '../types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  PieChart as PieIcon,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

interface ProgressAnalyticsProps {
  goals: Goal[];
}

const CATEGORY_COLORS: Record<GoalCategory, string> = {
  academic: '#6366F1', // indigo
  career: '#06B6D4', // cyan
  fitness: '#10B981', // emerald
  health: '#2DD4BF', // teal
  learning: '#8B5CF6', // violet
  finance: '#F59E0B', // amber
  personal: '#EC4899', // pink
};

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ goals }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredGoals = goals.filter((g) => {
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && g.status !== 'completed') ||
      (statusFilter === 'completed' && g.status === 'completed');
    return matchesCat && matchesStatus;
  });

  // Calculate aggregates
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === 'completed').length;
  const activeGoals = totalGoals - completedGoals;

  const totalLoggedHours = goals.reduce((sum, g) => sum + g.loggedHours, 0);
  const totalEstimatedHours = goals.reduce((sum, g) => sum + g.estimatedTotalHours, 0);
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const avgProgress = totalGoals > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progressPercentage, 0) / totalGoals) : 0;

  // Category Distribution for Bar Chart & Pie Chart
  const categoryStats: Record<string, { count: number; logged: number; estimated: number; progressSum: number }> = {};
  goals.forEach((g) => {
    if (!categoryStats[g.category]) {
      categoryStats[g.category] = { count: 0, logged: 0, estimated: 0, progressSum: 0 };
    }
    categoryStats[g.category].count += 1;
    categoryStats[g.category].logged += g.loggedHours;
    categoryStats[g.category].estimated += g.estimatedTotalHours;
    categoryStats[g.category].progressSum += g.progressPercentage;
  });

  const categoryChartData = Object.entries(categoryStats).map(([cat, data]) => ({
    category: cat.toUpperCase(),
    catKey: cat as GoalCategory,
    count: data.count,
    loggedHours: data.logged,
    estimatedHours: data.estimated,
    avgProgress: Math.round(data.progressSum / data.count),
  }));

  const pieChartData = [
    { name: 'Completed Goals', value: completedGoals, color: '#10B981' },
    { name: 'Active In Progress', value: activeGoals, color: '#06B6D4' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="text-xs font-mono text-cyan-400">TELEMETRY & HISTORICAL AUDIT</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Progress Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Empirical distribution of logged hours, category balance, and completion velocity computed strictly from saved records.
        </p>
      </div>

      {/* Aggregate Numerical Strip (Tabular Figures) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">AVERAGE COMPLETION</div>
          <div className="mt-2 text-3xl font-bold font-mono text-white tabular-nums">
            {avgProgress}%
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Across all {totalGoals} tracked goals</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">TOTAL HOURS INVESTED</div>
          <div className="mt-2 text-3xl font-bold font-mono text-cyan-400 tabular-nums">
            {totalLoggedHours}h
          </div>
          <div className="mt-2 text-[11px] text-slate-500">of {totalEstimatedHours}h estimated workload</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">COMPLETION RATE</div>
          <div className="mt-2 text-3xl font-bold font-mono text-emerald-400 tabular-nums">
            {completionRate}%
          </div>
          <div className="mt-2 text-[11px] text-slate-500">{completedGoals} of {totalGoals} achieved</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="text-xs text-slate-400">EFFICIENCY RATIO</div>
          <div className="mt-2 text-3xl font-bold font-mono text-violet-400 tabular-nums">
            {totalEstimatedHours > 0 ? (totalLoggedHours / totalEstimatedHours).toFixed(2) : '0.00'}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">Logged vs estimated ratio</div>
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Hours by Category (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Hours Invested vs Estimated by Domain</h2>
              <p className="text-xs text-slate-400">Comparison of logged effort against initial hour estimates</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Grouped Bar</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="category" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="loggedHours" name="Logged Hours" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="estimatedHours" name="Estimated Total" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Goal Status Ratio (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Portfolio Status Split</h2>
              <p className="text-xs text-slate-400">Completed vs active initiatives</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{totalGoals} total</span>
          </div>

          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Granular Telemetry Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div>
            <h2 className="text-base font-semibold text-white">Granular Goal Performance Ledger</h2>
            <p className="text-xs text-slate-400">Real-time audit across all active and completed records</p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none capitalize"
            >
              <option value="all">All Domains</option>
              <option value="academic">Academic</option>
              <option value="career">Career</option>
              <option value="fitness">Fitness</option>
              <option value="health">Health</option>
              <option value="learning">Learning</option>
              <option value="finance">Finance</option>
              <option value="personal">Personal</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="pb-3 font-medium">Goal Initiative</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Progress</th>
                <th className="pb-3 font-medium text-right">Logged Hours</th>
                <th className="pb-3 font-medium text-right">Estimated</th>
                <th className="pb-3 font-medium text-right">Milestones</th>
                <th className="pb-3 font-medium text-right">Target Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredGoals.map((g) => {
                const compMilestones = g.milestones.filter((m) => m.completed).length;
                return (
                  <tr key={g.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 font-medium text-white max-w-xs truncate">{g.title}</td>
                    <td className="py-3 capitalize text-cyan-400 font-mono text-[11px]">{g.category}</td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-200">{g.progressPercentage}%</td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-200">{g.loggedHours}h</td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-400">{g.estimatedTotalHours}h</td>
                    <td className="py-3 text-right font-mono tabular-nums text-slate-300">
                      {compMilestones}/{g.milestones.length}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-400 text-[11px]">{g.targetDate}</td>
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
