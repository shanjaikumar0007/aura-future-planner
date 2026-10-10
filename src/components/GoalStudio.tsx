import React, { useState } from 'react';
import { Goal } from '../types';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  AlertCircle,
  Check,
  Sparkles,
} from 'lucide-react';

interface GoalStudioProps {
  goals: Goal[];
  onSaveGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onUpdateGoalProgress: (goalId: string, newProgress: number) => void;
  onOpenNewGoalModal: () => void;
  onEditGoal: (goal: Goal) => void;
  onLoadDemoData?: () => void;
}

export const GoalStudio: React.FC<GoalStudioProps> = ({
  goals,
  onSaveGoal,
  onDeleteGoal,
  onToggleMilestone,
  onUpdateGoalProgress,
  onOpenNewGoalModal,
  onEditGoal,
  onLoadDemoData,
}) => {
  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'progress' | 'priority' | 'title'>('deadline');

  // Delete confirmation state
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  // Filter and sort logic
  const filteredGoals = goals.filter((goal) => {
    // Search query match
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      goal.title.toLowerCase().includes(q) ||
      goal.description.toLowerCase().includes(q) ||
      goal.tags.some((t) => t.toLowerCase().includes(q));

    // Category filter
    const matchesCategory = selectedCategory === 'all' || goal.category === selectedCategory;

    // Status filter
    const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus;

    // Priority filter
    const matchesPriority = selectedPriority === 'all' || goal.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  filteredGoals.sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    }
    if (sortBy === 'progress') {
      return b.progressPercentage - a.progressPercentage;
    }
    if (sortBy === 'priority') {
      const pMap = { high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400">OBJECTIVES & MILESTONES</div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Goal Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Create, calibrate, and break down multi-horizon objectives into verified milestones.
          </p>
        </div>

        <button
          onClick={onOpenNewGoalModal}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2.5 text-xs font-semibold text-white hover:from-violet-500 hover:to-cyan-500 transition-all shadow-sm shrink-0 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search goals by title, tag, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Category Tabs */}
          <div className="md:col-span-4 flex items-center gap-1 overflow-x-auto p-1 bg-slate-950/60 rounded-lg border border-slate-800 text-xs">
            {['all', 'academic', 'career', 'fitness', 'health', 'learning', 'finance', 'personal'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded capitalize whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2 justify-end">
            <span className="text-xs text-slate-400 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="deadline">Target Deadline</option>
              <option value="progress">Completion %</option>
              <option value="priority">Priority Tier</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <div className="flex gap-1">
                {['all', 'in_progress', 'completed'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2 py-0.5 rounded transition-colors ${
                      selectedStatus === st
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st === 'in_progress' ? 'In Progress' : st === 'completed' ? 'Completed' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span>Priority:</span>
              <div className="flex gap-1">
                {['all', 'high', 'medium', 'low'].map((pr) => (
                  <button
                    key={pr}
                    onClick={() => setSelectedPriority(pr)}
                    className={`px-2 py-0.5 rounded capitalize transition-colors ${
                      selectedPriority === pr
                        ? 'bg-slate-800 text-white font-medium'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Showing <span className="font-mono text-cyan-400">{filteredGoals.length}</span> of {goals.length} goals
          </div>
        </div>
      </div>

      {/* Goal Cards Grid */}
      {filteredGoals.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">No goals match current criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Try adjusting your search query, clearing active filters, or create a brand new goal to start tracking.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {onLoadDemoData && (
              <button
                onClick={onLoadDemoData}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition-colors"
              >
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Load Academic Demo Dataset</span>
              </button>
            )}
            <button
              onClick={onOpenNewGoalModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Goal</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const completedMilestones = goal.milestones.filter((m) => m.completed).length;
            const totalMilestones = goal.milestones.length;

            return (
              <div
                key={goal.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Zero-Pill Metadata Line */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="capitalize text-cyan-400 font-medium">{goal.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{goal.priority} priority</span>
                      <span aria-hidden="true">·</span>
                      <span>Target: {goal.targetDate}</span>
                      {goal.isDemo && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 px-1.5 py-0.5 rounded">
                            Demo Sample
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onEditGoal(goal)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Edit goal"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setGoalToDelete(goal)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Goal Title & Description */}
                  <h3 className="text-base font-semibold text-white mt-2 leading-snug">
                    {goal.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {goal.description}
                  </p>

                  {/* Progress Bar & Quick Adjustments */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Completion</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateGoalProgress(goal.id, Math.max(0, goal.progressPercentage - 5))}
                          className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono"
                          title="Decrease 5%"
                        >
                          -5%
                        </button>
                        <span className="font-mono font-bold text-white tabular-nums">
                          {goal.progressPercentage}%
                        </span>
                        <button
                          onClick={() => onUpdateGoalProgress(goal.id, Math.min(100, goal.progressPercentage + 5))}
                          className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 hover:bg-slate-700 font-mono"
                          title="Increase 5%"
                        >
                          +5%
                        </button>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-300"
                        style={{ width: `${goal.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Milestones ({completedMilestones}/{totalMilestones})</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {goal.loggedHours}/{goal.estimatedTotalHours} hrs logged
                      </span>
                    </div>

                    {goal.milestones.length === 0 ? (
                      <div className="text-[11px] text-slate-500 italic py-1">
                        No sub-milestones added yet. Edit to add atomic checkpoints.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {goal.milestones.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-start justify-between gap-2 text-xs rounded bg-slate-950/40 p-2 border border-slate-800/50 hover:border-slate-700 transition-colors"
                          >
                            <label className="flex items-start gap-2 cursor-pointer min-w-0">
                              <input
                                type="checkbox"
                                checked={m.completed}
                                onChange={() => onToggleMilestone(goal.id, m.id)}
                                className="mt-0.5 h-3.5 w-3.5 rounded border-slate-700 bg-slate-800 text-cyan-500 accent-cyan-500 cursor-pointer"
                              />
                              <span
                                className={`text-[11px] leading-tight ${
                                  m.completed ? 'line-through text-slate-500' : 'text-slate-200'
                                }`}
                              >
                                {m.title}
                              </span>
                            </label>
                            {m.dueDate && (
                              <span className="font-mono text-[10px] text-slate-500 shrink-0">
                                {m.dueDate}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {goal.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[11px] text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {goal.status !== 'completed' && goal.progressPercentage === 100 && (
                    <button
                      onClick={() => onSaveGoal({ ...goal, status: 'completed' })}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Mark Goal Done</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {goalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-semibold text-white">Delete Goal?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-white">"{goalToDelete.title}"</strong>?
              This will remove all associated milestones and time logging records from your local storage.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setGoalToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteGoal(goalToDelete.id);
                  setGoalToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-rose-600 hover:bg-rose-500"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
