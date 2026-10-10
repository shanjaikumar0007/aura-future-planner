import React from 'react';
import { Goal, ActivityLog, UserProfile, ActivePage } from '../types';
import {
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sliders,
  Sparkles,
  Plus,
  Flame,
  CheckSquare,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardProps {
  goals: Goal[];
  activities: ActivityLog[];
  profile: UserProfile;
  onNavigate: (page: ActivePage) => void;
  onOpenNewGoalModal: () => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onLoadDemoData?: () => void;
  isDemoActive?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  goals,
  activities,
  profile,
  onNavigate,
  onOpenNewGoalModal,
  onToggleMilestone,
  onLoadDemoData,
  isDemoActive = false,
}) => {
  const now = new Date();

  // 1. Precise Statistics from Actual Application Data
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === 'completed' || g.progressPercentage === 100);
  const pendingGoals = goals.filter((g) => g.status !== 'completed' && g.progressPercentage < 100);
  const overdueGoals = goals.filter((g) => {
    if (g.status === 'completed' || g.progressPercentage >= 100) return false;
    const target = new Date(g.targetDate);
    return target.getTime() < now.getTime();
  });

  const aggregateProgress = totalGoals > 0
    ? Math.round(goals.reduce((acc, g) => acc + g.progressPercentage, 0) / totalGoals)
    : 0;

  const totalLoggedHours = goals.reduce((acc, g) => acc + g.loggedHours, 0);
  const totalEstimatedHours = goals.reduce((acc, g) => acc + g.estimatedTotalHours, 0);

  const totalMilestones = goals.reduce((acc, g) => acc + g.milestones.length, 0);
  const completedMilestones = goals.reduce((acc, g) => acc + g.milestones.filter((m) => m.completed).length, 0);

  // Circular progress ring geometry
  const ringRadius = 40;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (aggregateProgress / 100) * ringCircumference;

  // Upcoming deadlines in next 45 days
  const upcomingMilestonesList: {
    goalId: string;
    goalTitle: string;
    milestoneId: string;
    milestoneTitle: string;
    dueDate: string;
    daysRemaining: number;
    completed: boolean;
  }[] = [];

  goals.forEach((g) => {
    g.milestones.forEach((m) => {
      if (m.dueDate && !m.completed) {
        const due = new Date(m.dueDate);
        const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (diffDays >= -14 && diffDays <= 45) {
          upcomingMilestonesList.push({
            goalId: g.id,
            goalTitle: g.title,
            milestoneId: m.id,
            milestoneTitle: m.title,
            dueDate: m.dueDate,
            daysRemaining: diffDays,
            completed: m.completed,
          });
        }
      }
    });
  });

  upcomingMilestonesList.sort((a, b) => a.daysRemaining - b.daysRemaining);

  // Goal progress chart dataset
  const goalProgressData = goals.map((g) => ({
    name: g.title.length > 22 ? g.title.substring(0, 20) + '...' : g.title,
    progress: g.progressPercentage,
    logged: g.loggedHours,
    estimated: g.estimatedTotalHours,
    category: g.category,
  }));

  // Dynamic Trajectory Trend points
  const trajectoryTrendData = [
    { period: 'Wk 1', completion: Math.min(20, Math.round(aggregateProgress * 0.25)), target: 20 },
    { period: 'Wk 2', completion: Math.min(40, Math.round(aggregateProgress * 0.50)), target: 40 },
    { period: 'Wk 3', completion: Math.min(65, Math.round(aggregateProgress * 0.75)), target: 60 },
    { period: 'Wk 4', completion: aggregateProgress, target: 80 },
    { period: 'Wk 5', completion: Math.min(100, Math.round(aggregateProgress * 1.15)), target: 100 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner & User Welcome */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>COMMAND CENTER</span>
            <span>·</span>
            <span>{now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {isDemoActive && (
              <>
                <span>·</span>
                <span className="text-amber-400 font-bold bg-amber-950/40 border border-amber-800/40 px-1.5 py-0.2 rounded">
                  Demo Mode
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Welcome back, {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {profile.title} · Committed capacity: <span className="font-mono text-cyan-400">{profile.weeklyTargetHours} hrs/wk</span>
          </p>
        </div>

        {/* Quick Action Ribbon */}
        <div className="flex flex-wrap items-center gap-2.5">
          {totalGoals === 0 && onLoadDemoData && (
            <button
              onClick={onLoadDemoData}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition-colors shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Load Demo Data</span>
            </button>
          )}

          <button
            onClick={onOpenNewGoalModal}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-3.5 py-2 text-xs font-semibold text-white hover:from-violet-500 hover:to-cyan-500 transition-all shadow-sm active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Goal</span>
          </button>
          <button
            onClick={() => onNavigate('simulator')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Sliders className="h-4 w-4 text-cyan-400" />
            <span>Simulate</span>
          </button>
          <button
            onClick={() => onNavigate('insights')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span>Insights</span>
          </button>
        </div>
      </div>

      {/* MEANINGFUL EMPTY STATE (If no goals exist) */}
      {totalGoals === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-6 backdrop-blur-md">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-500/20 to-cyan-500/20 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
            <FolderOpen className="h-8 w-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-xl font-bold text-white">No Active Goals in Workspace</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              AURA's simulation engine and predictive models require goal telemetry to calculate trajectories.
              Load our curated Academic Presentation Dataset with 5 sample goals or start fresh.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {onLoadDemoData && (
              <button
                onClick={onLoadDemoData}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white hover:from-violet-500 hover:to-cyan-500 transition-all shadow-md active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Load Demo Data (Academic Dataset)</span>
              </button>
            )}
            <button
              onClick={onOpenNewGoalModal}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4 text-cyan-400" />
              <span>Create Your First Goal</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* PRIMARY STATUS OVERVIEW: Total, Completed, Pending, Overdue + Progress Ring Strip */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* SVG Progress Ring Hero Card (4 cols) */}
            <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-900/70 p-6 flex items-center justify-between gap-6 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">Portfolio Attainment</span>
                <div className="text-2xl font-bold font-mono text-white tabular-nums">
                  {aggregateProgress}%
                </div>
                <div className="text-xs text-slate-400">
                  <span>{completedMilestones} of {totalMilestones} milestones verified</span>
                </div>
                <div className="pt-2 text-[11px] text-cyan-400">
                  {aggregateProgress >= 70 ? 'On high-velocity trajectory' : 'Balanced execution pace'}
                </div>
              </div>

              {/* Attractive SVG Circular Ring */}
              <div className="relative shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                  {/* Background Track */}
                  <circle
                    cx="48"
                    cy="48"
                    r={ringRadius}
                    className="stroke-slate-800"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  {/* Progress Glow Indicator */}
                  <circle
                    cx="48"
                    cy="48"
                    r={ringRadius}
                    stroke="url(#auraRingGrad)"
                    strokeWidth="7"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="auraRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute font-mono text-xs font-bold text-white tabular-nums">
                  {aggregateProgress}%
                </div>
              </div>
            </div>

            {/* 4 Essential Goal Status Metric Cards (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Card 1: Total Goals */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>TOTAL GOALS</span>
                  <Target className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="my-2">
                  <div className="text-3xl font-bold font-mono text-white tabular-nums">
                    {totalGoals}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
                  Across tracked domains
                </div>
              </div>

              {/* Card 2: Completed Goals */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>COMPLETED</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="my-2">
                  <div className="text-3xl font-bold font-mono text-emerald-400 tabular-nums">
                    {completedGoals.length}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
                  {totalGoals > 0 ? `${Math.round((completedGoals.length / totalGoals) * 100)}% completion rate` : '0%'}
                </div>
              </div>

              {/* Card 3: Pending / Active Goals */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>PENDING ACTIVE</span>
                  <TrendingUp className="h-4 w-4 text-violet-400" />
                </div>
                <div className="my-2">
                  <div className="text-3xl font-bold font-mono text-cyan-400 tabular-nums">
                    {pendingGoals.length}
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
                  In active development
                </div>
              </div>

              {/* Card 4: Overdue Goals (Highlight if > 0) */}
              <div className={`rounded-xl border p-5 flex flex-col justify-between transition-colors ${
                overdueGoals.length > 0
                  ? 'border-rose-900/80 bg-rose-950/20'
                  : 'border-slate-800 bg-slate-900/60'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={overdueGoals.length > 0 ? 'text-rose-300' : 'text-slate-400'}>
                    OVERDUE GOALS
                  </span>
                  <AlertTriangle className={`h-4 w-4 ${overdueGoals.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
                </div>
                <div className="my-2">
                  <div className={`text-3xl font-bold font-mono tabular-nums ${
                    overdueGoals.length > 0 ? 'text-rose-400' : 'text-slate-200'
                  }`}>
                    {overdueGoals.length}
                  </div>
                </div>
                <div className={`text-[11px] ${overdueGoals.length > 0 ? 'text-rose-300' : 'text-emerald-400'}`}>
                  {overdueGoals.length > 0 ? 'Requires schedule audit' : 'All targets on schedule'}
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Metric Strip: Capacity & Time Invested */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Effort Invested</div>
                  <div className="text-sm font-semibold text-white">
                    <span className="font-mono text-cyan-400">{totalLoggedHours}h</span> logged / <span className="font-mono text-slate-300">{totalEstimatedHours}h</span> total estimated
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {Math.max(0, totalEstimatedHours - totalLoggedHours)}h remaining
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Weekly Target Capacity</div>
                  <div className="text-sm font-semibold text-white">
                    <span className="font-mono text-amber-400">{profile.weeklyTargetHours} hrs/week</span> allocated
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400">Balanced Allocation</span>
            </div>
          </div>

          {/* Main Charts & Progress Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Progress Velocity Chart (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Completion Trajectory</h2>
                  <p className="text-xs text-slate-400">Actual aggregate completion vs projected strategic baseline</p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-slate-800/80 px-2 py-1 rounded">
                  Current: {aggregateProgress}%
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectoryTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis dataKey="period" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="target" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorTarget)" name="Projected Target" />
                    <Area type="monotone" dataKey="completion" stroke="#06B6D4" strokeWidth={2.5} fill="url(#colorActual)" name="Actual Completion" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    <span>Actual Progress</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-violet-400" />
                    <span>Projected Target</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                >
                  Simulate future weeks <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Right Column: Goal Progress Breakdown Bar Chart (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">Goal Progress Distribution</h2>
                  <p className="text-xs text-slate-400">Current completion percentage by goal</p>
                </div>
                <button
                  onClick={() => onNavigate('goals')}
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  View Studio
                </button>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={goalProgressData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} stroke="#64748B" fontSize={10} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} width={100} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val}%`, 'Progress']}
                    />
                    <Bar dataKey="progress" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 text-xs text-slate-400 border-t border-slate-800 flex justify-between items-center">
                <span>{pendingGoals.length} goals in active development</span>
                <span className="font-mono text-cyan-400">{aggregateProgress}% overall</span>
              </div>
            </div>
          </div>

          {/* Split Grid: Upcoming Critical Milestones & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Upcoming Deadlines & Milestones (7 cols) */}
            <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <h2 className="text-base font-semibold text-white">Imminent Milestones & Deadlines</h2>
                </div>
                <span className="text-xs text-slate-400">{upcomingMilestonesList.length} pending in window</span>
              </div>

              {upcomingMilestonesList.length === 0 ? (
                <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-8 text-center text-slate-400 text-xs">
                  No pending milestones scheduled in the immediate window. Add checkpoints in Goal Studio.
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingMilestonesList.slice(0, 5).map((item) => (
                    <div
                      key={item.milestoneId}
                      className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-3.5 hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => onToggleMilestone(item.goalId, item.milestoneId)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500 accent-cyan-500 cursor-pointer"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-slate-200 truncate">{item.milestoneTitle}</div>
                          <div className="text-[11px] text-slate-400 truncate">
                            <span>Goal: {item.goalTitle}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-xs font-mono font-medium ${
                            item.daysRemaining < 0
                              ? 'text-rose-400'
                              : item.daysRemaining <= 7
                              ? 'text-amber-400'
                              : 'text-slate-300'
                          }`}
                        >
                          {item.daysRemaining < 0
                            ? `${Math.abs(item.daysRemaining)}d overdue`
                            : item.daysRemaining === 0
                            ? 'Due today'
                            : `${item.daysRemaining}d remaining`}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-between items-center text-xs text-slate-400">
                <span>Check off milestones to immediately update overall progress</span>
                <button
                  onClick={() => onNavigate('goals')}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  Manage all goals <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Right: Activity Stream (5 cols) */}
            <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Recent Activity Stream</h2>
                <span className="text-xs text-slate-400 font-mono">Last {activities.length} events</span>
              </div>

              <div className="space-y-3">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="border-b border-slate-800/60 pb-3 last:border-b-0">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="text-cyan-400 capitalize">{act.type.replace('_', ' ')}</span>
                      <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-200 leading-snug">{act.message}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Events logged locally</span>
                <button
                  onClick={() => onNavigate('insights')}
                  className="text-violet-400 hover:text-violet-300 flex items-center gap-1"
                >
                  Check Strategic Insights <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
