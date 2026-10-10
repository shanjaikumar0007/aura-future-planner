export type GoalCategory = 'academic' | 'career' | 'fitness' | 'health' | 'finance' | 'learning' | 'personal';

export type GoalPriority = 'low' | 'medium' | 'high';

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  estimatedHours?: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  startDate: string;
  targetDate: string;
  progressPercentage: number;
  milestones: Milestone[];
  estimatedTotalHours: number;
  loggedHours: number;
  budgetTarget?: number;
  budgetSpent?: number;
  tags: string[];
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  goalId?: string;
  goalTitle?: string;
  type: 'goal_created' | 'goal_updated' | 'progress_update' | 'milestone_completed' | 'goal_completed' | 'simulation_run';
  message: string;
  timestamp: string;
}

export interface SimulationParams {
  goalId: string; // 'all' or specific goal id
  weeklyHoursDedicated: number;
  disciplineFactor: number; // 0.6 to 1.4 (consistency multiplier)
  frictionRisk: number; // 0.1 to 0.5 (interruptions / delays)
  compoundingVelocity: number; // 0.0 to 0.15 (skill growth per month)
}

export interface ScenarioProjection {
  id: 'conservative' | 'balanced' | 'accelerated';
  name: string;
  description: string;
  estimatedWeeks: number;
  projectedDate: string;
  confidenceScore: number; // 0 - 100%
  velocityPerHour: number;
  burnoutRiskLevel: 'Low' | 'Moderate' | 'High';
  assumptions: string[];
  milestoneProjections: {
    milestoneId: string;
    title: string;
    projectedDate: string;
  }[];
}

export interface TimelineDataPoint {
  week: number;
  label: string;
  conservative: number;
  balanced: number;
  accelerated: number;
}

export interface SimulationOutput {
  params: SimulationParams;
  targetGoalTitle: string;
  remainingHoursEstimated: number;
  scenarios: Record<'conservative' | 'balanced' | 'accelerated', ScenarioProjection>;
  timeline: TimelineDataPoint[];
  generatedAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'pacing' | 'risk' | 'acceleration' | 'balance' | 'milestone' | 'opportunity';
  priority: 'urgent' | 'moderate' | 'opportunity';
  description: string;
  rationale: string;
  metricTriggered: string;
  actionableSteps: string[];
  targetGoalId?: string;
  targetGoalTitle?: string;
  actionType?: 'reschedule' | 'breakdown' | 'allocate_time' | 'complete_milestone';
  engineSource: 'deterministic-rules' | 'gemini-model';
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  bio: string;
  weeklyTargetHours: number;
  primaryFocus: GoalCategory;
  accentColor: 'cyan' | 'violet' | 'emerald';
  emailNotifications: boolean;
  weeklySummaryDigest: boolean;
  milestoneReminders: boolean;
  joinedDate: string;
}

export type ActivePage =
  | 'landing'
  | 'dashboard'
  | 'goals'
  | 'simulator'
  | 'insights'
  | 'analytics'
  | 'settings';
