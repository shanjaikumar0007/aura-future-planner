import { Goal, ActivityLog, UserProfile, SimulationParams } from '../types';

const STORAGE_KEYS = {
  GOALS: 'aura_goals_v1',
  ACTIVITIES: 'aura_activities_v1',
  PROFILE: 'aura_profile_v1',
  SIMULATION_PARAMS: 'aura_sim_params_v1',
};

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Vance',
  email: 'alex.vance@aurasystem.dev',
  title: 'Principal Systems Architect & Researcher',
  bio: 'Engineering scalable distributed architectures while advancing academic research in machine learning efficiency.',
  weeklyTargetHours: 24,
  primaryFocus: 'academic',
  accentColor: 'cyan',
  emailNotifications: true,
  weeklySummaryDigest: true,
  milestoneReminders: true,
  joinedDate: '2026-01-15',
};

export const DEMO_GOALS: Goal[] = [
  {
    id: 'demo-goal-1',
    title: 'Publish Machine Learning Systems Thesis & Evaluation Suite',
    description: 'Empirical evaluation of low-precision neural quantization, reproducible benchmark pipelines, and peer-reviewed conference manuscript submission.',
    category: 'academic',
    priority: 'high',
    status: 'in_progress',
    startDate: '2026-01-15',
    targetDate: '2026-06-25',
    progressPercentage: 75,
    estimatedTotalHours: 160,
    loggedHours: 120,
    budgetTarget: 1200,
    budgetSpent: 740,
    tags: ['Academic', 'Thesis', 'Quantization', 'Benchmarking'],
    notes: 'Primary focus: statistical reproducibility and synthetic stress ablation studies.',
    isDemo: true,
    milestones: [
      { id: 'dm-101', title: 'Formal literature review & taxonomy formulation', completed: true, dueDate: '2026-02-28', estimatedHours: 35 },
      { id: 'dm-102', title: 'Automated distributed benchmarking rig on cloud GPUs', completed: true, dueDate: '2026-03-31', estimatedHours: 45 },
      { id: 'dm-103', title: 'Statistical ablation analysis & p99 latency verification', completed: true, dueDate: '2026-04-30', estimatedHours: 40 },
      { id: 'dm-104', title: 'Camera-ready manuscript draft & faculty committee review', completed: false, dueDate: '2026-06-25', estimatedHours: 40 },
    ],
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-04-09T14:30:00.000Z',
  },
  {
    id: 'demo-goal-2',
    title: 'Architect & Launch Distributed Microservices SaaS',
    description: 'Design high-throughput event architecture, implement OAuth authorization, and deploy to Kubernetes with automated CI/CD pipeline.',
    category: 'career',
    priority: 'high',
    status: 'in_progress',
    startDate: '2026-01-10',
    targetDate: '2026-07-30',
    progressPercentage: 62,
    estimatedTotalHours: 180,
    loggedHours: 112,
    budgetTarget: 2500,
    budgetSpent: 1400,
    tags: ['Architecture', 'Kubernetes', 'Go', 'Distributed Systems'],
    notes: 'Focus on zero-downtime database migrations and automated telemetry integration.',
    isDemo: true,
    milestones: [
      { id: 'dm-201', title: 'Domain-driven service boundary specifications', completed: true, dueDate: '2026-02-15', estimatedHours: 30 },
      { id: 'dm-202', title: 'Event streaming cluster & gRPC contracts', completed: true, dueDate: '2026-03-30', estimatedHours: 45 },
      { id: 'dm-203', title: 'Multi-tenant auth & RBAC permission matrix', completed: true, dueDate: '2026-04-20', estimatedHours: 40 },
      { id: 'dm-204', title: 'Load testing & latency p99 optimization (<45ms)', completed: false, dueDate: '2026-06-15', estimatedHours: 35 },
      { id: 'dm-205', title: 'Production cluster rollout & pilot customer onboard', completed: false, dueDate: '2026-07-30', estimatedHours: 30 },
    ],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-04-05T14:30:00.000Z',
  },
  {
    id: 'demo-goal-3',
    title: 'Sub-4-Hour Marathon Endurance Conditioning',
    description: 'Structured aerobic base building, weekly progressive long runs, VO2 max interval sessions, and mobility recovery protocols.',
    category: 'fitness',
    priority: 'medium',
    status: 'in_progress',
    startDate: '2026-02-01',
    targetDate: '2026-09-20',
    progressPercentage: 45,
    estimatedTotalHours: 140,
    loggedHours: 63,
    budgetTarget: 800,
    budgetSpent: 420,
    tags: ['Running', 'Cardio', 'Nutrition', 'Endurance'],
    notes: 'Target pacing: 5:40 min/km marathon pace. Maintain hydration electrolytes.',
    isDemo: true,
    milestones: [
      { id: 'dm-301', title: 'Establish 45km weekly aerobic base mileage', completed: true, dueDate: '2026-03-15', estimatedHours: 35 },
      { id: 'dm-302', title: 'Complete first 24km continuous aerobic run', completed: true, dueDate: '2026-04-10', estimatedHours: 25 },
      { id: 'dm-303', title: 'Lactate threshold testing & pace calibration', completed: false, dueDate: '2026-05-20', estimatedHours: 20 },
      { id: 'dm-304', title: 'Peak 34km training simulation run', completed: false, dueDate: '2026-07-30', estimatedHours: 35 },
      { id: 'dm-305', title: 'Race day taper & sub-4 finish', completed: false, dueDate: '2026-09-20', estimatedHours: 25 },
    ],
    createdAt: '2026-02-01T08:00:00.000Z',
    updatedAt: '2026-04-08T11:20:00.000Z',
  },
  {
    id: 'demo-goal-4',
    title: 'Digital Minimalism & Deep Work Cognitive Protocols',
    description: 'Eliminate algorithmic feeds, establish 90-minute daily uninterrupted focus blocks, and maintain dedicated cognitive rest cycles.',
    category: 'personal',
    priority: 'medium',
    status: 'in_progress',
    startDate: '2026-01-01',
    targetDate: '2026-12-31',
    progressPercentage: 80,
    estimatedTotalHours: 50,
    loggedHours: 40,
    budgetTarget: 200,
    budgetSpent: 80,
    tags: ['Focus', 'Mindfulness', 'Habits', 'Productivity'],
    notes: 'Morning focus block strictly offline. Weekly digital sabbath.',
    isDemo: true,
    milestones: [
      { id: 'dm-401', title: 'Audit screen time and remove passive algorithmic apps', completed: true, dueDate: '2026-02-01', estimatedHours: 10 },
      { id: 'dm-402', title: 'Maintain 30-day continuous morning deep work streak', completed: true, dueDate: '2026-03-15', estimatedHours: 15 },
      { id: 'dm-403', title: 'Read 12 core academic monographs in cognitive science', completed: true, dueDate: '2026-04-01', estimatedHours: 15 },
      { id: 'dm-404', title: 'Establish recurring weekly 24-hour analog sabbath', completed: false, dueDate: '2026-12-31', estimatedHours: 10 },
    ],
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-04-09T18:00:00.000Z',
  },
  {
    id: 'demo-goal-5',
    title: 'Build $50k High-Yield Liquidity & Research Reserve',
    description: 'Disciplined capital accumulation: optimize tax-advantaged buckets, automate bi-weekly index purchases, and maintain emergency liquidity.',
    category: 'finance',
    priority: 'low',
    status: 'completed',
    startDate: '2025-06-01',
    targetDate: '2026-03-31',
    progressPercentage: 100,
    estimatedTotalHours: 35,
    loggedHours: 35,
    budgetTarget: 50000,
    budgetSpent: 50000,
    tags: ['Finance', 'Liquidity', 'Investments', 'Compounding'],
    notes: 'Target completed on March 31 with dividend reinvestment enabled.',
    isDemo: true,
    milestones: [
      { id: 'dm-501', title: 'Establish 6-month liquid emergency runway ($25,000)', completed: true, dueDate: '2025-10-31', estimatedHours: 12 },
      { id: 'dm-502', title: 'Automate weekly dollar-cost averaging into global index', completed: true, dueDate: '2025-12-15', estimatedHours: 8 },
      { id: 'dm-503', title: 'Cross $50,000 threshold and perform year-end audit', completed: true, dueDate: '2026-03-31', estimatedHours: 15 },
    ],
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2026-03-31T16:00:00.000Z',
  },
];

export const INITIAL_GOALS: Goal[] = DEMO_GOALS;

export const DEMO_ACTIVITIES: ActivityLog[] = [
  {
    id: 'act-demo-1',
    goalId: 'demo-goal-1',
    goalTitle: 'Publish Machine Learning Systems Thesis & Evaluation Suite',
    type: 'milestone_completed',
    message: 'Completed milestone: Statistical ablation analysis & p99 latency verification (+40 hrs)',
    timestamp: '2026-04-10T09:15:00.000Z',
  },
  {
    id: 'act-demo-2',
    goalId: 'demo-goal-3',
    goalTitle: 'Sub-4-Hour Marathon Endurance Conditioning',
    type: 'milestone_completed',
    message: 'Completed milestone: Complete first 24km continuous aerobic run (+25 hrs)',
    timestamp: '2026-04-08T11:15:00.000Z',
  },
  {
    id: 'act-demo-3',
    goalId: 'demo-goal-2',
    goalTitle: 'Architect & Launch Distributed Microservices SaaS',
    type: 'progress_update',
    message: 'Updated overall progress to 62% after completing multi-tenant auth & RBAC matrix',
    timestamp: '2026-04-05T14:25:00.000Z',
  },
  {
    id: 'act-demo-4',
    goalId: 'demo-goal-5',
    goalTitle: 'Build $50k High-Yield Liquidity & Research Reserve',
    type: 'goal_completed',
    message: 'Goal achieved! Total research and emergency liquidity crossed $50,000 threshold.',
    timestamp: '2026-03-31T15:50:00.000Z',
  },
  {
    id: 'act-demo-5',
    goalId: 'demo-goal-1',
    goalTitle: 'Publish Machine Learning Systems Thesis & Evaluation Suite',
    type: 'simulation_run',
    message: 'Ran Future Scenario Simulator: Balanced timeline projects defense on track by June 25',
    timestamp: '2026-03-29T10:12:00.000Z',
  },
];

export const INITIAL_ACTIVITIES: ActivityLog[] = DEMO_ACTIVITIES;

export const INITIAL_SIMULATION_PARAMS: SimulationParams = {
  goalId: 'all',
  weeklyHoursDedicated: 24,
  disciplineFactor: 1.0,
  frictionRisk: 0.25,
  compoundingVelocity: 0.05,
};

export function isDemoDataActive(): boolean {
  try {
    const goals = getSavedGoals();
    return goals.length > 0 && goals.some((g) => g.isDemo);
  } catch {
    return false;
  }
}

export function loadDemoDataset(): Goal[] {
  saveGoals(DEMO_GOALS);
  saveActivities(DEMO_ACTIVITIES);
  return DEMO_GOALS;
}

export function resetDemoDataset(): Goal[] {
  return loadDemoDataset();
}

export function clearAllGoals(): Goal[] {
  saveGoals([]);
  return [];
}

// Safe storage accessors
export function getSavedGoals(): Goal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (!raw) {
      saveGoals(INITIAL_GOALS);
      return INITIAL_GOALS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_GOALS;
  } catch (e) {
    console.warn('Failed to parse saved goals, using initial dataset', e);
    return INITIAL_GOALS;
  }
}

export function saveGoals(goals: Goal[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals to localStorage', e);
  }
}

export function getSavedActivities(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) {
      saveActivities(INITIAL_ACTIVITIES);
      return INITIAL_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ACTIVITIES;
  } catch (e) {
    return INITIAL_ACTIVITIES;
  }
}

export function saveActivities(activities: ActivityLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save activities to localStorage', e);
  }
}

export function logActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): void {
  const current = getSavedActivities();
  const entry: ActivityLog = {
    ...activity,
    id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
  };
  saveActivities([entry, ...current]);
}

export function getSavedProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      saveProfile(INITIAL_USER_PROFILE);
      return INITIAL_USER_PROFILE;
    }
    return { ...INITIAL_USER_PROFILE, ...JSON.parse(raw) };
  } catch (e) {
    return INITIAL_USER_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function getSavedSimulationParams(): SimulationParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SIMULATION_PARAMS);
    if (!raw) {
      saveSimulationParams(INITIAL_SIMULATION_PARAMS);
      return INITIAL_SIMULATION_PARAMS;
    }
    return { ...INITIAL_SIMULATION_PARAMS, ...JSON.parse(raw) };
  } catch (e) {
    return INITIAL_SIMULATION_PARAMS;
  }
}

export function saveSimulationParams(params: SimulationParams): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SIMULATION_PARAMS, JSON.stringify(params));
  } catch (e) {
    console.error('Failed to save simulation parameters', e);
  }
}

export function resetAllDataToDefault(): void {
  localStorage.removeItem(STORAGE_KEYS.GOALS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  localStorage.removeItem(STORAGE_KEYS.PROFILE);
  localStorage.removeItem(STORAGE_KEYS.SIMULATION_PARAMS);
  saveGoals(INITIAL_GOALS);
  saveActivities(INITIAL_ACTIVITIES);
  saveProfile(INITIAL_USER_PROFILE);
  saveSimulationParams(INITIAL_SIMULATION_PARAMS);
}

export type ExportScope = 'full' | 'goals_only' | 'config_only';

export function exportWorkspaceJSON(scope: ExportScope = 'full'): string {
  const profile = getSavedProfile();
  const goals = getSavedGoals();
  const activities = getSavedActivities();
  const simulationParams = getSavedSimulationParams();

  let payload: any;
  if (scope === 'goals_only') {
    payload = {
      app: 'AURA',
      exportType: 'goals_only',
      exportVersion: '1.1',
      exportedAt: new Date().toISOString(),
      metadata: {
        totalGoals: goals.length,
        totalMilestones: goals.reduce((sum, g) => sum + g.milestones.length, 0),
        completedGoals: goals.filter((g) => g.status === 'completed').length,
      },
      goals,
    };
  } else if (scope === 'config_only') {
    payload = {
      app: 'AURA',
      exportType: 'configuration_only',
      exportVersion: '1.1',
      exportedAt: new Date().toISOString(),
      configuration: {
        profile,
        simulationParameters: simulationParams,
      },
    };
  } else {
    payload = {
      app: 'AURA - Strategic Goal Planner & Future Scenario Simulator',
      exportType: 'full_backup',
      exportVersion: '1.1',
      exportedAt: new Date().toISOString(),
      metadata: {
        totalGoals: goals.length,
        totalMilestones: goals.reduce((sum, g) => sum + g.milestones.length, 0),
        completedGoals: goals.filter((g) => g.status === 'completed').length,
        totalActivitiesLogged: activities.length,
      },
      goals,
      configuration: {
        profile,
        simulationParameters: simulationParams,
      },
      activities,
    };
  }

  return JSON.stringify(payload, null, 2);
}

export function importWorkspaceJSON(jsonString: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed) {
      return { success: false, error: 'Empty JSON payload provided.' };
    }

    if (Array.isArray(parsed.goals)) {
      saveGoals(parsed.goals);
    } else if (parsed.exportType === 'configuration_only' && parsed.configuration) {
      if (parsed.configuration.profile) saveProfile(parsed.configuration.profile);
      if (parsed.configuration.simulationParameters) saveSimulationParams(parsed.configuration.simulationParameters);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid JSON format: missing valid goals array or configuration object.' };
    }

    if (parsed.configuration) {
      if (parsed.configuration.profile) saveProfile(parsed.configuration.profile);
      if (parsed.configuration.simulationParameters) saveSimulationParams(parsed.configuration.simulationParameters);
    } else if (parsed.profile) {
      saveProfile(parsed.profile);
    }

    if (Array.isArray(parsed.activities)) {
      saveActivities(parsed.activities);
    }

    if (parsed.simulationParams) {
      saveSimulationParams(parsed.simulationParams);
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    return { success: false, error: `JSON Parse error: ${message}` };
  }
}
