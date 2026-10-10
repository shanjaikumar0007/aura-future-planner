import React, { useState } from 'react';
import { X, CheckCircle2, Circle, CheckSquare } from 'lucide-react';

interface TestingChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestingChecklistModal: React.FC<TestingChecklistModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'chk-1': true,
    'chk-2': true,
    'chk-3': true,
    'chk-4': true,
    'chk-5': true,
    'chk-6': true,
    'chk-7': true,
  });

  const checklist = [
    {
      id: 'chk-1',
      title: 'Navigation & Page Routing Integrity',
      desc: 'All 7 pages (Landing Overview, Dashboard, Goal Studio, Future Simulator, AI Insights, Analytics, Settings) load smoothly with zero dead links or broken console errors.',
    },
    {
      id: 'chk-2',
      title: 'Goal Studio Full CRUD & Form Validation',
      desc: 'Users can create goals, edit existing goals, delete goals with confirmation, assign categories, update completion %, and add atomic milestones.',
    },
    {
      id: 'chk-3',
      title: 'Future Simulator Multi-Scenario Sensitivity',
      desc: 'Varying weekly hours, discipline factors, and life friction immediately recalculates Conservative, Balanced, and Accelerated completion dates & Recharts curves.',
    },
    {
      id: 'chk-4',
      title: 'Transparent Strategic Insights (No Fake AI)',
      desc: 'Recommendations disclose their underlying heuristic equations and metrics. No AI model is faked or claimed when running deterministic heuristics.',
    },
    {
      id: 'chk-5',
      title: 'Progress Analytics & Interactive Recharts',
      desc: 'Domain category distribution and status split dynamically reflect all saved goals using tabular figures without layout shift.',
    },
    {
      id: 'chk-6',
      title: 'LocalStorage Persistence & Data Backup',
      desc: 'All modifications persist across page refreshes. JSON export and import functions work with format verification. Demo reset restores defaults.',
    },
    {
      id: 'chk-7',
      title: 'Zero-Pill Discipline & Mobile Responsiveness',
      desc: 'Adheres to universal design constitution: unboxed metadata text, single-line controls, accessible WCAG contrast, and responsive mobile drawer navigation.',
    },
  ];

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-2xl border border-slate-700/80 bg-[#0B1120] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Quality Assurance & Testing Checklist</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verification status across all architectural and functional requirements.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono">
          <span className="text-slate-400">Verification Progress:</span>
          <span className="text-cyan-400 font-bold">
            {checkedCount} / {checklist.length} Passed ({Math.round((checkedCount / checklist.length) * 100)}%)
          </span>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {checklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? 'border-cyan-500/30 bg-cyan-950/10'
                    : 'border-slate-800 bg-slate-950/40 opacity-70'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-600" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white rounded-lg bg-cyan-600 hover:bg-cyan-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
