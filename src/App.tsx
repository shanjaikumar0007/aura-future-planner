/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActivePage, Goal, ActivityLog, UserProfile, SimulationParams } from './types';
import {
  getSavedGoals,
  saveGoals,
  getSavedActivities,
  logActivity,
  getSavedProfile,
  saveProfile,
  getSavedSimulationParams,
  saveSimulationParams,
  resetAllDataToDefault,
  loadDemoDataset,
  resetDemoDataset,
  clearAllGoals,
} from './services/storage';

import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { GoalStudio } from './components/GoalStudio';
import { FutureSimulator } from './components/FutureSimulator';
import { AIInsights } from './components/AIInsights';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { ProfileSettings } from './components/ProfileSettings';
import { TestingChecklistModal } from './components/TestingChecklistModal';
import { GoalModal } from './components/GoalModal';
import { Sparkles, X, Database } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>(getSavedProfile());
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(getSavedSimulationParams());

  // Modal & banner states
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [showLoadDemoConfirm, setShowLoadDemoConfirm] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Initialize data from persistent localStorage
  useEffect(() => {
    const loadedGoals = getSavedGoals();
    const loadedActivities = getSavedActivities();
    const loadedProfile = getSavedProfile();
    const loadedSimParams = getSavedSimulationParams();

    setGoals(loadedGoals);
    setActivities(loadedActivities);
    setProfile(loadedProfile);
    setSimulationParams(loadedSimParams);
  }, []);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const isDemoActive = goals.length > 0 && goals.some((g) => g.isDemo);

  // Demo Mode Handlers
  const handleTriggerLoadDemo = () => {
    const hasCustomGoals = goals.length > 0 && goals.some((g) => !g.isDemo);
    if (hasCustomGoals) {
      // Ask confirmation so we don't overwrite user data without permission
      setShowLoadDemoConfirm(true);
    } else {
      executeLoadDemo();
    }
  };

  const executeLoadDemo = () => {
    const newGoals = loadDemoDataset();
    setGoals(newGoals);
    setActivities(getSavedActivities());
    setShowDemoBanner(true);
    showNotification('Academic Presentation Dataset loaded (5 sample goals).');
  };

  const handleResetDemoData = () => {
    const resetGoals = resetDemoDataset();
    setGoals(resetGoals);
    setActivities(getSavedActivities());
    showNotification('Demo dataset reset to initial baseline.');
  };

  const handleClearAllData = () => {
    const empty = clearAllGoals();
    setGoals(empty);
    showNotification('Workspace cleared. Start by adding your own goals.');
  };

  // Goal handlers
  const handleSaveGoal = (goalToSave: Goal) => {
    const exists = goals.some((g) => g.id === goalToSave.id);
    let updatedGoals: Goal[];

    if (exists) {
      updatedGoals = goals.map((g) => (g.id === goalToSave.id ? goalToSave : g));
      logActivity({
        goalId: goalToSave.id,
        goalTitle: goalToSave.title,
        type: 'goal_updated',
        message: `Updated configuration for "${goalToSave.title}"`,
      });
      showNotification(`Goal "${goalToSave.title}" updated.`);
    } else {
      updatedGoals = [goalToSave, ...goals];
      logActivity({
        goalId: goalToSave.id,
        goalTitle: goalToSave.title,
        type: 'goal_created',
        message: `Created new objective: "${goalToSave.title}" (${goalToSave.category})`,
      });
      showNotification(`Created goal "${goalToSave.title}".`);
    }

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setActivities(getSavedActivities());
  };

  const handleDeleteGoal = (goalId: string) => {
    const target = goals.find((g) => g.id === goalId);
    const updatedGoals = goals.filter((g) => g.id !== goalId);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);

    if (target) {
      logActivity({
        goalId: target.id,
        goalTitle: target.title,
        type: 'goal_updated',
        message: `Deleted goal record: "${target.title}"`,
      });
      showNotification(`Goal "${target.title}" deleted.`);
    }
    setActivities(getSavedActivities());
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const updatedGoals = goals.map((g) => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        const nextCompleted = !m.completed;
        if (nextCompleted) {
          logActivity({
            goalId: g.id,
            goalTitle: g.title,
            type: 'milestone_completed',
            message: `Completed milestone: "${m.title}" for "${g.title}"`,
          });
          showNotification(`Milestone completed: "${m.title}"`);
        }
        return { ...m, completed: nextCompleted };
      });

      // Recalculate progress percentage based on completed milestones ratio if milestones exist
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const totalCount = updatedMilestones.length;
      const autoProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : g.progressPercentage;

      return {
        ...g,
        milestones: updatedMilestones,
        progressPercentage: autoProgress,
        status: autoProgress === 100 ? ('completed' as const) : g.status,
      };
    });

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setActivities(getSavedActivities());
  };

  const handleUpdateGoalProgress = (goalId: string, newProgress: number) => {
    const updatedGoals = goals.map((g) => {
      if (g.id !== goalId) return g;
      const progress = Math.max(0, Math.min(100, newProgress));
      return {
        ...g,
        progressPercentage: progress,
        status: progress === 100 ? ('completed' as const) : g.status,
      };
    });

    const target = goals.find((g) => g.id === goalId);
    if (target) {
      logActivity({
        goalId: target.id,
        goalTitle: target.title,
        type: 'progress_update',
        message: `Updated progress on "${target.title}" to ${newProgress}%`,
      });
    }

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setActivities(getSavedActivities());
  };

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    showNotification('Settings and preferences saved.');
  };

  const handleSaveSimulationParams = (newParams: SimulationParams) => {
    setSimulationParams(newParams);
    saveSimulationParams(newParams);
  };

  const handleLogSimulationRun = (targetTitle: string) => {
    logActivity({
      type: 'simulation_run',
      message: `Executed multi-scenario simulation for "${targetTitle}"`,
    });
    setActivities(getSavedActivities());
    showNotification('Simulation execution recorded in activity stream.');
  };

  const handleResetAllData = () => {
    resetAllDataToDefault();
    setGoals(getSavedGoals());
    setActivities(getSavedActivities());
    setProfile(getSavedProfile());
    setSimulationParams(getSavedSimulationParams());
    showNotification('All data reset to fresh default demo state.');
  };

  const handleOpenNewGoal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080C15] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Navigation
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onOpenNewGoalModal={handleOpenNewGoal}
        isDemoActive={isDemoActive}
        onLoadDemoData={handleTriggerLoadDemo}
        onResetDemoData={handleResetDemoData}
      />

      {/* Academic Presentation Demo Mode Banner */}
      {isDemoActive && showDemoBanner && (
        <div className="bg-gradient-to-r from-violet-950/80 via-[#0E1528] to-slate-900 border-b border-indigo-500/30 px-4 py-2.5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-indigo-200">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
            <span>
              <strong className="text-white font-semibold">Academic Demo Dataset Active:</strong> 5 sample goals loaded across Academic (Thesis), Career (Distributed SaaS), Fitness (Marathon), and Personal domains.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0 text-xs">
            <button
              onClick={handleResetDemoData}
              className="text-cyan-300 hover:text-white font-medium underline underline-offset-2"
            >
              Reset Sample Goals
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={handleClearAllData}
              className="text-slate-400 hover:text-rose-300"
            >
              Clear Workspace
            </button>
            <button
              onClick={() => setShowDemoBanner(false)}
              className="text-slate-400 hover:text-white p-0.5 ml-1"
              title="Dismiss banner"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Global Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/95 px-4 py-3 text-xs text-slate-200 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Page Content Router */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onNavigate={(p) => setActivePage(p)}
            goals={goals}
          />
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            goals={goals}
            activities={activities}
            profile={profile}
            onNavigate={(p) => setActivePage(p)}
            onOpenNewGoalModal={handleOpenNewGoal}
            onToggleMilestone={handleToggleMilestone}
            onLoadDemoData={handleTriggerLoadDemo}
            isDemoActive={isDemoActive}
          />
        )}

        {activePage === 'goals' && (
          <GoalStudio
            goals={goals}
            onSaveGoal={handleSaveGoal}
            onDeleteGoal={handleDeleteGoal}
            onToggleMilestone={handleToggleMilestone}
            onUpdateGoalProgress={handleUpdateGoalProgress}
            onOpenNewGoalModal={handleOpenNewGoal}
            onEditGoal={handleOpenEditGoal}
            onLoadDemoData={handleTriggerLoadDemo}
          />
        )}

        {activePage === 'simulator' && (
          <FutureSimulator
            goals={goals}
            profile={profile}
            initialParams={simulationParams}
            onSaveParams={handleSaveSimulationParams}
            onLogSimulationRun={handleLogSimulationRun}
          />
        )}

        {activePage === 'insights' && (
          <AIInsights
            goals={goals}
            profile={profile}
            onNavigate={(p) => setActivePage(p)}
            onOpenGoalStudio={() => setActivePage('goals')}
          />
        )}

        {activePage === 'analytics' && (
          <ProgressAnalytics
            goals={goals}
          />
        )}

        {activePage === 'settings' && (
          <ProfileSettings
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onResetAllData={handleResetAllData}
            onOpenChecklistModal={() => setIsChecklistModalOpen(true)}
            isDemoActive={isDemoActive}
            onLoadDemoData={handleTriggerLoadDemo}
            onResetDemoData={handleResetDemoData}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Universal Create & Edit Goal Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSaveGoal={(savedGoal) => {
          handleSaveGoal(savedGoal);
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        editingGoal={editingGoal}
      />

      {/* Testing Checklist Verification Modal */}
      <TestingChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => setIsChecklistModalOpen(false)}
      />

      {/* Confirmation Modal: Load Demo Data */}
      {showLoadDemoConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-cyan-400">
              <Database className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-semibold text-white">Load Academic Demo Dataset?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              You currently have customized goals in your workspace. Loading the academic demo dataset will replace them with 5 sample presentation goals across Academic, Career, Fitness, and Personal domains.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLoadDemoConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  executeLoadDemo();
                  setShowLoadDemoConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-500"
              >
                Load Demo Dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
