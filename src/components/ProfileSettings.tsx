import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types';
import {
  exportWorkspaceJSON,
  importWorkspaceJSON,
  ExportScope,
  getSavedGoals,
  getSavedActivities,
} from '../services/storage';
import {
  User,
  Settings,
  Bell,
  Download,
  Upload,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Save,
  CheckSquare,
  Copy,
  Check,
  FileJson,
  Eye,
  EyeOff,
  Database,
} from 'lucide-react';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetAllData: () => void;
  onOpenChecklistModal: () => void;
  isDemoActive?: boolean;
  onLoadDemoData?: () => void;
  onResetDemoData?: () => void;
  onClearAllData?: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onSaveProfile,
  onResetAllData,
  onOpenChecklistModal,
  isDemoActive = false,
  onLoadDemoData,
  onResetDemoData,
  onClearAllData,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showLoadDemoConfirm, setShowLoadDemoConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // JSON Export state & controls
  const [exportScope, setExportScope] = useState<ExportScope>('full');
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [exportNotification, setExportNotification] = useState<{ filename: string; size: string } | null>(null);

  // Compute export payload and statistics dynamically
  const exportPayloadString = useMemo(() => {
    return exportWorkspaceJSON(exportScope);
  }, [exportScope, profile]);

  const exportStats = useMemo(() => {
    const bytes = new Blob([exportPayloadString]).size;
    const formattedSize = bytes < 1024 ? `${bytes} bytes` : `${(bytes / 1024).toFixed(1)} KB`;
    const lineCount = exportPayloadString.split('\n').length;
    const goalsCount = getSavedGoals().length;
    const activitiesCount = getSavedActivities().length;
    return {
      size: formattedSize,
      lines: lineCount,
      goalsCount,
      activitiesCount,
    };
  }, [exportPayloadString]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  /**
   * Generates and triggers the file download of the JSON backup.
   */
  const handleExportJSON = () => {
    try {
      const jsonStr = exportWorkspaceJSON(exportScope);
      const dateStamp = new Date().toISOString().split('T')[0];
      const prefix =
        exportScope === 'goals_only'
          ? 'aura-goals-backup'
          : exportScope === 'config_only'
          ? 'aura-config-backup'
          : 'aura-complete-backup';
      const filename = `${prefix}-${dateStamp}.json`;

      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportNotification({
        filename,
        size: exportStats.size,
      });
      setTimeout(() => setExportNotification(null), 4500);
    } catch (err) {
      console.error('Failed to export JSON file:', err);
    }
  };

  /**
   * Copies the generated JSON payload directly to the clipboard.
   */
  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(exportPayloadString);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importWorkspaceJSON(content);
      if (res.success) {
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportError(res.error || 'Failed to import JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400">OPERATOR PROFILE & PREFERENCES</div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Configure identity parameters, weekly capacity boundaries, notifications, and local JSON backups.
          </p>
        </div>

        <button
          onClick={onOpenChecklistModal}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <CheckSquare className="h-4 w-4 text-cyan-400" />
          <span>Verification Checklist</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>Profile and preferences updated successfully in local storage.</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: User Identity */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-white">
            <User className="h-4 w-4 text-cyan-400" />
            <span>Personal Identity & Capacity Baseline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Professional Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Weekly Target Dedicated Hours: <span className="font-mono text-cyan-400">{formData.weeklyTargetHours} hrs</span>
              </label>
              <input
                type="number"
                min="5"
                max="80"
                value={formData.weeklyTargetHours}
                onChange={(e) => setFormData({ ...formData, weeklyTargetHours: parseInt(e.target.value, 10) || 20 })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">Used by AI Insights to detect capacity overloading.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Bio / North Star Statement</label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Visual & Strategic Focus */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-white">
            <Settings className="h-4 w-4 text-violet-400" />
            <span>Strategic Focus & Visual Accents</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Domain Focus</label>
              <select
                value={formData.primaryFocus}
                onChange={(e: any) => setFormData({ ...formData, primaryFocus: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 focus:border-cyan-500 focus:outline-none capitalize"
              >
                <option value="career">Career & Engineering</option>
                <option value="health">Health & Physical Vitality</option>
                <option value="finance">Capital & Investments</option>
                <option value="learning">Continuous Mastery</option>
                <option value="personal">Personal Life</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">System Accent Color</label>
              <div className="flex items-center gap-3 mt-1.5">
                {[
                  { id: 'cyan', label: 'Cyan Laser', color: 'bg-cyan-500' },
                  { id: 'violet', label: 'Violet Nebula', color: 'bg-violet-500' },
                  { id: 'emerald', label: 'Emerald Signal', color: 'bg-emerald-500' },
                ].map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, accentColor: acc.id as any })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                      formData.accentColor === acc.id
                        ? 'border-white bg-slate-800 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${acc.color}`} />
                    <span>{acc.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Notification & Digest Preferences */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-white">
            <Bell className="h-4 w-4 text-cyan-400" />
            <span>Reminders & Digest Preferences</span>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer text-xs">
              <div>
                <div className="font-medium text-slate-200">Email Notifications</div>
                <div className="text-[11px] text-slate-500">Receive schedule change alerts and overdue goal notifications</div>
              </div>
              <input
                type="checkbox"
                checked={formData.emailNotifications}
                onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500 accent-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer text-xs">
              <div>
                <div className="font-medium text-slate-200">Weekly Strategic Summary Digest</div>
                <div className="text-[11px] text-slate-500">Automated weekly progress calibration report</div>
              </div>
              <input
                type="checkbox"
                checked={formData.weeklySummaryDigest}
                onChange={(e) => setFormData({ ...formData, weeklySummaryDigest: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500 accent-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer text-xs">
              <div>
                <div className="font-medium text-slate-200">Milestone Deadlines Radar</div>
                <div className="text-[11px] text-slate-500">Alerts when milestone is within 14 days of due date</div>
              </div>
              <input
                type="checkbox"
                checked={formData.milestoneReminders}
                onChange={(e) => setFormData({ ...formData, milestoneReminders: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500 accent-cyan-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 px-6 py-2.5 text-xs font-semibold text-white hover:from-violet-500 hover:to-cyan-500 transition-all shadow-sm active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Section 4: DEDICATED JSON BACKUP & CONFIGURATION EXPORT */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-900/70 p-6 space-y-5 shadow-lg shadow-cyan-950/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileJson className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">JSON Backup & Configuration Export</h2>
              <p className="text-xs text-slate-400">
                Generate an export of your goals, milestones, and application configurations as a local JSON file.
              </p>
            </div>
          </div>

          {/* Scope Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setExportScope('full')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                exportScope === 'full'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Backup
            </button>
            <button
              type="button"
              onClick={() => setExportScope('goals_only')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                exportScope === 'goals_only'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Goals Only
            </button>
            <button
              type="button"
              onClick={() => setExportScope('config_only')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                exportScope === 'config_only'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Config Only
            </button>
          </div>
        </div>

        {/* Live Export Metadata Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
          <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Target Scope</span>
            <span className="text-xs font-semibold text-white capitalize">
              {exportScope === 'full' ? 'Complete Workspace' : exportScope === 'goals_only' ? 'Goals & Checkpoints' : 'Config & Preferences'}
            </span>
          </div>

          <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Goals Count</span>
            <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
              {exportScope === 'config_only' ? '0 (Config only)' : `${exportStats.goalsCount} objectives`}
            </span>
          </div>

          <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Estimated Payload</span>
            <span className="text-xs font-mono font-bold text-violet-400 tabular-nums">
              {exportStats.size} ({exportStats.lines} lines)
            </span>
          </div>

          <div className="rounded-lg bg-slate-950/70 p-2.5 border border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Format Version</span>
            <span className="text-xs font-mono text-emerald-400">JSON v1.1 UTF-8</span>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotification && (
          <div className="rounded-lg border border-cyan-500/40 bg-cyan-950/30 p-3 text-xs text-cyan-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>
                Export complete! Downloaded <strong className="font-mono text-white">{exportNotification.filename}</strong> ({exportNotification.size}).
              </span>
            </div>
            <span className="font-mono text-[10px] text-cyan-400">Saved to local disk</span>
          </div>
        )}

        {/* Action Buttons: Export File, Copy JSON, Preview JSON */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-cyan-500 transition-all shadow-sm active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span>Download JSON Backup File</span>
          </button>

          <button
            type="button"
            onClick={handleCopyJSON}
            className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
          >
            {copiedToClipboard ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-400" />
                <span>Copy JSON to Clipboard</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowJsonPreview(!showJsonPreview)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors ml-auto"
          >
            {showJsonPreview ? (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span>Hide Payload Preview</span>
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Preview JSON Payload</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible JSON Preview Container */}
        {showJsonPreview && (
          <div className="space-y-2 pt-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">JSON Payload Preview ({exportStats.lines} lines)</span>
              <span className="text-[11px] text-slate-500">Ready for offline restore or cold storage</span>
            </div>
            <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-3 max-h-60 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed scrollbar-thin">
              <pre className="whitespace-pre-wrap">{exportPayloadString}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Section 5: ACADEMIC PRESENTATION & DEMO MODE */}
      <div className="rounded-xl border border-indigo-500/30 bg-slate-900/70 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <CheckSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Academic Presentation & Demo Dataset</h2>
              <p className="text-xs text-slate-400">
                Load curated sample goals across Academic, Career, Fitness, and Personal domains for evaluations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Dataset State:</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
              isDemoActive
                ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 font-semibold'
                : 'border-slate-800 bg-slate-950 text-slate-400'
            }`}>
              {isDemoActive ? 'Demo Active (5 Sample Goals)' : 'Custom Workspace'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The Academic Demo dataset includes multi-domain goals: Machine Learning Systems thesis publishing, distributed SaaS architecture, marathon conditioning, and cognitive digital minimalism. All sample goals are fully editable and can be simulated or deleted.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {onLoadDemoData && (
            <button
              type="button"
              onClick={() => setShowLoadDemoConfirm(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm active:scale-95"
            >
              <Database className="h-4 w-4" />
              <span>Load Academic Demo Data</span>
            </button>
          )}

          {onResetDemoData && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RotateCcw className="h-4 w-4 text-cyan-400" />
              <span>Reset Demo Dataset</span>
            </button>
          )}

          {onClearAllData && (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-2 rounded-lg border border-rose-900/50 bg-rose-950/20 px-3.5 py-2.5 text-xs font-medium text-rose-300 hover:bg-rose-900/40 transition-colors ml-auto"
            >
              <ShieldAlert className="h-4 w-4 text-rose-400" />
              <span>Clear Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* Section 6: Local Storage Data Operations (Import & Reset) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-semibold text-white">
          <Database className="h-4 w-4 text-emerald-400" />
          <span>Restore Backup & Raw Factory Reset</span>
        </div>

        <p className="text-xs text-slate-400">
          Restore previous JSON backups into this browser or perform a cold factory wipe.
        </p>

        {importSuccess && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Data successfully imported! Reloading workspace...</span>
          </div>
        )}

        {importError && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{importError}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer">
            <Upload className="h-4 w-4 text-violet-400" />
            <span>Import Workspace Backup (.json)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Load Demo Data Confirmation Modal */}
      {showLoadDemoConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-cyan-400">
              <Database className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-semibold text-white">Load Academic Demo Dataset?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will stage the curated academic presentation goals across Academic, Career, Fitness, and Personal domains. Any unsaved custom goals will be replaced. We recommend exporting a JSON backup first if needed.
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
                  if (onLoadDemoData) onLoadDemoData();
                  setShowLoadDemoConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-500"
              >
                Confirm & Load Demo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Demo Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <RotateCcw className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-semibold text-white">Reset Demo Data to Baseline?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will restore the 5 original sample goals, milestones, and activity history to their initial state. Any edits made during the session will be reset.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onResetDemoData) {
                    onResetDemoData();
                  } else {
                    onResetAllData();
                  }
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-cyan-600 hover:bg-cyan-500"
              >
                Reset Demo Dataset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Workspace Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0B1120] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="h-6 w-6 shrink-0" />
              <h3 className="text-base font-semibold text-white">Clear All Workspace Goals?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This will wipe all goals and milestones so you can start with a clean, empty canvas. You can re-load the demo dataset or create new goals at any time.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onClearAllData) onClearAllData();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white rounded-lg bg-rose-600 hover:bg-rose-500"
              >
                Clear Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
