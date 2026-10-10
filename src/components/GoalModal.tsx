import React, { useState, useEffect } from 'react';
import { Goal, GoalCategory, GoalPriority, GoalStatus, Milestone } from '../types';
import { X, Plus, Calendar, Clock, Sparkles, Tag, DollarSign, AlertCircle } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (goal: Goal) => void;
  editingGoal: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSaveGoal,
  editingGoal,
}) => {
  const [formData, setFormData] = useState<{
    id?: string;
    title: string;
    description: string;
    category: GoalCategory;
    priority: GoalPriority;
    status: GoalStatus;
    startDate: string;
    targetDate: string;
    progressPercentage: number;
    estimatedTotalHours: number;
    loggedHours: number;
    budgetTarget: string;
    budgetSpent: string;
    tags: string;
    notes: string;
    milestones: Milestone[];
  }>({
    title: '',
    description: '',
    category: 'career',
    priority: 'medium',
    status: 'in_progress',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split('T')[0],
    progressPercentage: 0,
    estimatedTotalHours: 40,
    loggedHours: 0,
    budgetTarget: '',
    budgetSpent: '',
    tags: '',
    notes: '',
    milestones: [],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneHours, setNewMilestoneHours] = useState('10');
  const [newMilestoneDue, setNewMilestoneDue] = useState('');

  // Sync form state when modal opens or editingGoal changes
  useEffect(() => {
    if (!isOpen) return;

    if (editingGoal) {
      setFormData({
        id: editingGoal.id,
        title: editingGoal.title || '',
        description: editingGoal.description || '',
        category: editingGoal.category || 'career',
        priority: editingGoal.priority || 'medium',
        status: editingGoal.status || 'in_progress',
        startDate: editingGoal.startDate || new Date().toISOString().split('T')[0],
        targetDate:
          editingGoal.targetDate ||
          new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split('T')[0],
        progressPercentage: editingGoal.progressPercentage ?? 0,
        estimatedTotalHours: editingGoal.estimatedTotalHours || 40,
        loggedHours: editingGoal.loggedHours ?? 0,
        budgetTarget: editingGoal.budgetTarget ? editingGoal.budgetTarget.toString() : '',
        budgetSpent: editingGoal.budgetSpent ? editingGoal.budgetSpent.toString() : '',
        tags: Array.isArray(editingGoal.tags) ? editingGoal.tags.join(', ') : '',
        notes: editingGoal.notes || '',
        milestones: Array.isArray(editingGoal.milestones) ? [...editingGoal.milestones] : [],
      });
    } else {
      // Clean blank form for a brand new goal
      const today = new Date().toISOString().split('T')[0];
      const ninetyDaysAhead = new Date(Date.now() + 90 * 24 * 3600 * 1000)
        .toISOString()
        .split('T')[0];

      setFormData({
        title: '',
        description: '',
        category: 'career',
        priority: 'medium',
        status: 'in_progress',
        startDate: today,
        targetDate: ninetyDaysAhead,
        progressPercentage: 0,
        estimatedTotalHours: 40,
        loggedHours: 0,
        budgetTarget: '',
        budgetSpent: '',
        tags: '',
        notes: '',
        milestones: [],
      });
    }

    setFormErrors({});
    setNewMilestoneTitle('');
    setNewMilestoneDue('');
    setNewMilestoneHours('10');
  }, [isOpen, editingGoal]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const ms: Milestone = {
      id: 'm-' + Date.now(),
      title: newMilestoneTitle.trim(),
      completed: false,
      dueDate: newMilestoneDue || undefined,
      estimatedHours: parseInt(newMilestoneHours, 10) || 10,
    };
    setFormData((prev) => ({
      ...prev,
      milestones: [...prev.milestones, ms],
    }));
    setNewMilestoneTitle('');
    setNewMilestoneDue('');
    setNewMilestoneHours('10');
  };

  const handleRemoveMilestone = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      milestones: prev.milestones.filter((m) => m.id !== id),
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    if (!formData.targetDate) {
      errors.targetDate = 'Target date is required';
    } else if (new Date(formData.targetDate) < new Date(formData.startDate)) {
      errors.targetDate = 'Target deadline cannot be earlier than start date';
    }
    if (!formData.estimatedTotalHours || formData.estimatedTotalHours <= 0) {
      errors.estimatedTotalHours = 'Estimated hours must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const tagList = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const goalToSave: Goal = {
      id: formData.id || 'goal-' + Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      startDate: formData.startDate,
      targetDate: formData.targetDate,
      progressPercentage: Math.max(0, Math.min(100, formData.progressPercentage)),
      estimatedTotalHours: formData.estimatedTotalHours,
      loggedHours: formData.loggedHours,
      budgetTarget: formData.budgetTarget ? parseFloat(formData.budgetTarget) : undefined,
      budgetSpent: formData.budgetSpent ? parseFloat(formData.budgetSpent) : undefined,
      tags: tagList,
      notes: formData.notes.trim() || undefined,
      milestones: formData.milestones,
      createdAt: editingGoal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveGoal(goalToSave);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-modal-title"
    >
      <div className="w-full max-w-2xl my-8 rounded-2xl border border-slate-700/80 bg-[#0B1120] p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400">AURA GOAL ARCHITECTURE</span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] text-slate-400 capitalize">
                {editingGoal ? 'Modifying Goal' : 'New Objective'}
              </span>
            </div>
            <h2 id="goal-modal-title" className="text-lg font-bold text-white mt-0.5">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitForm} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Goal Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Architect & Launch Distributed Microservices SaaS"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors ${
                formErrors.title ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-500'
              }`}
              autoFocus
            />
            {formErrors.title && (
              <span className="text-[11px] text-rose-400 mt-1 block flex items-center gap-1">
                <AlertCircle className="h-3 w-3 inline" />
                {formErrors.title}
              </span>
            )}
          </div>

          {/* Strategic Description */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Strategic Description
            </label>
            <textarea
              rows={2}
              placeholder="Explain why this goal matters, definition of done, and expected impact..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category, Priority & Status row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none capitalize"
              >
                <option value="academic">Academic</option>
                <option value="career">Career</option>
                <option value="fitness">Fitness</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="finance">Finance</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e: any) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none capitalize"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              >
                <option value="in_progress">In Progress</option>
                <option value="not_started">Not Started</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Dates & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Start Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
              {formErrors.startDate && (
                <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.startDate}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Deadline <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className={`w-full rounded-lg border bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:outline-none ${
                  formErrors.targetDate ? 'border-rose-500' : 'border-slate-700 focus:border-cyan-500'
                }`}
              />
              {formErrors.targetDate && (
                <span className="text-[11px] text-rose-400 mt-1 block">{formErrors.targetDate}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Estimated Hours <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.estimatedTotalHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedTotalHours: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
              {formErrors.estimatedTotalHours && (
                <span className="text-[11px] text-rose-400 mt-1 block">
                  {formErrors.estimatedTotalHours}
                </span>
              )}
            </div>
          </div>

          {/* Progress & Logged Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Initial Progress: <span className="font-mono text-cyan-400">{formData.progressPercentage}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progressPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, progressPercentage: parseInt(e.target.value, 10) })
                }
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded cursor-pointer mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Hours Logged</label>
              <input
                type="number"
                min="0"
                value={formData.loggedHours}
                onChange={(e) =>
                  setFormData({ ...formData, loggedHours: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Architecture, Rust, Sprint"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Budget & Strategic Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Allocated Budget Target ($)
              </label>
              <input
                type="number"
                placeholder="Optional budget target"
                value={formData.budgetTarget}
                onChange={(e) => setFormData({ ...formData, budgetTarget: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Operational Notes & Context
              </label>
              <input
                type="text"
                placeholder="e.g. High priority for Q2 performance review"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Milestones Section */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Atomic Sub-Milestones</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {formData.milestones.length} milestones
              </span>
            </div>

            {/* Milestone list */}
            {formData.milestones.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {formData.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between gap-2 rounded bg-slate-950 p-2 border border-slate-800 text-xs"
                  >
                    <span className="text-slate-200 truncate">
                      {idx + 1}. {m.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {m.dueDate && (
                        <span className="font-mono text-[10px] text-slate-500">{m.dueDate}</span>
                      )}
                      {m.estimatedHours && (
                        <span className="font-mono text-[10px] text-cyan-400">
                          {m.estimatedHours}h
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(m.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors"
                        aria-label="Remove milestone"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add milestone inline inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <input
                type="text"
                placeholder="Milestone description..."
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="sm:col-span-6 rounded border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="date"
                value={newMilestoneDue}
                onChange={(e) => setNewMilestoneDue(e.target.value)}
                className="sm:col-span-3 rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Hrs"
                value={newMilestoneHours}
                onChange={(e) => setNewMilestoneHours(e.target.value)}
                className="sm:col-span-1 rounded border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="sm:col-span-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-xs py-1.5 transition-colors"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 shadow-sm active:scale-95 transition-all"
            >
              {editingGoal ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
