import React, { useState } from 'react';
import { ActivePage } from '../types';
import { Menu, X, Plus, Compass, Sparkles } from 'lucide-react';

interface NavigationProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onOpenNewGoalModal: () => void;
  isDemoActive?: boolean;
  onLoadDemoData?: () => void;
  onResetDemoData?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activePage,
  onNavigate,
  onOpenNewGoalModal,
  isDemoActive = false,
  onLoadDemoData,
  onResetDemoData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'landing', label: 'Overview' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'goals', label: 'Goal Studio' },
    { id: 'simulator', label: 'Future Simulator' },
    { id: 'insights', label: 'Strategic Insights' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md">
      {/* 3-Zone Top Bar Contract */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNavClick('dashboard')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 text-white font-bold text-base shadow-sm group-hover:opacity-90 transition-opacity">
              A
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
              AURA
            </span>
          </button>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Demo Mode */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isDemoActive ? (
            <button
              onClick={onResetDemoData}
              title="Academic demo dataset is currently active. Click to reset."
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-950/20 px-3 py-1.5 text-xs font-mono text-amber-300 hover:bg-amber-900/30 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Demo Mode</span>
            </button>
          ) : (
            onLoadDemoData && (
              <button
                onClick={onLoadDemoData}
                title="Load curated academic presentation dataset"
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                <span>Load Demo Data</span>
              </button>
            )
          )}

          <button
            onClick={onOpenNewGoalModal}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:from-violet-500 hover:to-cyan-500 transition-all whitespace-nowrap shrink-0 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-800 bg-[#0B0F1B] px-4 py-4 lg:hidden">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800/80 text-cyan-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>AURA Goal Planning & Simulator</span>
            <button
              onClick={() => handleNavClick('landing')}
              className="text-cyan-400 flex items-center gap-1 hover:underline"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Tour Overview</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
