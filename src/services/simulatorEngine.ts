import { Goal, SimulationParams, SimulationOutput, ScenarioProjection, TimelineDataPoint } from '../types';

/**
 * Calculates deterministic multi-scenario projections based on explicit mathematical models.
 * Strictly presents estimates as heuristic scenario models, NEVER guaranteed predictions.
 */
export function runScenarioSimulation(goals: Goal[], params: SimulationParams): SimulationOutput {
  // Determine target scope
  let activeGoals = goals.filter((g) => g.status !== 'completed');
  if (activeGoals.length === 0) {
    activeGoals = goals; // fallback if all completed
  }

  const targetGoal = params.goalId === 'all'
    ? null
    : goals.find((g) => g.id === params.goalId) || null;

  // Calculate remaining work in hours
  let remainingHours = 0;
  if (targetGoal) {
    const uncompletedMilestones = targetGoal.milestones.filter((m) => !m.completed);
    const milestoneHours = uncompletedMilestones.reduce((acc, m) => acc + (m.estimatedHours || 15), 0);
    const hoursFromProgress = Math.max(0, targetGoal.estimatedTotalHours - targetGoal.loggedHours);
    remainingHours = Math.max(10, Math.max(milestoneHours, hoursFromProgress));
  } else {
    // Composite portfolio
    remainingHours = activeGoals.reduce((sum, g) => {
      const remainingForGoal = Math.max(5, g.estimatedTotalHours - g.loggedHours);
      return sum + remainingForGoal;
    }, 0);
    if (remainingHours <= 0) remainingHours = 120;
  }

  const weeklyHours = Math.max(2, params.weeklyHoursDedicated);
  const discipline = Math.max(0.4, Math.min(1.5, params.disciplineFactor));
  const friction = Math.max(0.05, Math.min(0.6, params.frictionRisk));
  const compounding = Math.max(0.0, Math.min(0.2, params.compoundingVelocity));

  // 1. Conservative Scenario:
  // Buffer: high friction (friction * 1.5), lower discipline impact (discipline * 0.85), 0 compounding
  const conservativeEffectiveWeekly = Math.max(1, weeklyHours * (1 - friction * 1.4) * (discipline * 0.85));
  const conservativeWeeks = Math.ceil(remainingHours / conservativeEffectiveWeekly * 1.25); // 25% contingency buffer

  // 2. Balanced Scenario:
  // Realistic adherence with slight compounding
  const balancedEffectiveWeekly = Math.max(1.5, weeklyHours * (1 - friction) * discipline * (1 + compounding * 0.5));
  const balancedWeeks = Math.max(2, Math.ceil(remainingHours / balancedEffectiveWeekly));

  // 3. Accelerated Scenario:
  // Overtime push (+25% weekly capacity), disciplined execution, compounding benefits
  const acceleratedCapacity = weeklyHours * 1.25;
  const acceleratedEffectiveWeekly = Math.max(2, acceleratedCapacity * (1 - friction * 0.5) * (discipline * 1.15) * (1 + compounding * 1.2));
  const acceleratedWeeks = Math.max(1, Math.ceil(remainingHours / acceleratedEffectiveWeekly));

  // Helper date adder
  const now = new Date();
  const addWeeksToDate = (weeks: number): string => {
    const d = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  // Milestone forecasts for target goal or main active goal
  const goalToForecast = targetGoal || activeGoals[0];
  const uncompleted = goalToForecast ? goalToForecast.milestones.filter((m) => !m.completed) : [];

  const mapMilestones = (totalWeeks: number) => {
    if (uncompleted.length === 0) {
      return [{
        milestoneId: 'ms-final',
        title: 'Complete Target Objectives',
        projectedDate: addWeeksToDate(totalWeeks),
      }];
    }
    const step = totalWeeks / uncompleted.length;
    return uncompleted.map((m, idx) => ({
      milestoneId: m.id,
      title: m.title,
      projectedDate: addWeeksToDate(Math.max(1, Math.round((idx + 1) * step))),
    }));
  };

  const conservativeScen: ScenarioProjection = {
    id: 'conservative',
    name: 'Conservative Scenario',
    description: 'High contingency buffer factoring in unexpected operational roadblocks, energy dips, and schedule interruptions.',
    estimatedWeeks: conservativeWeeks,
    projectedDate: addWeeksToDate(conservativeWeeks),
    confidenceScore: Math.min(94, Math.round(82 + (1 - friction) * 12)),
    velocityPerHour: Math.round((conservativeEffectiveWeekly / weeklyHours) * 100) / 100,
    burnoutRiskLevel: 'Low',
    assumptions: [
      `Assumes ${Math.round(friction * 140)}% scheduling friction buffer for emergencies and energy dips`,
      `Effective weekly output budgeted at ${conservativeEffectiveWeekly.toFixed(1)} hrs/week`,
      'Includes mandatory 25% project timeline contingency',
      'High statistical likelihood of completion within the predicted horizon without strain',
    ],
    milestoneProjections: mapMilestones(conservativeWeeks),
  };

  const balancedScen: ScenarioProjection = {
    id: 'balanced',
    name: 'Balanced Scenario',
    description: 'Target strategic trajectory with steady weekly execution, manageable friction absorption, and moderate efficiency gains.',
    estimatedWeeks: balancedWeeks,
    projectedDate: addWeeksToDate(balancedWeeks),
    confidenceScore: Math.min(84, Math.round(70 + discipline * 10 - friction * 8)),
    velocityPerHour: Math.round((balancedEffectiveWeekly / weeklyHours) * 100) / 100,
    burnoutRiskLevel: 'Moderate',
    assumptions: [
      `Maintains steady ${Math.round(discipline * 85)}% consistency without prolonged lapses`,
      `Absorbs baseline friction of ${Math.round(friction * 100)}% via planned weekend catch-up blocks`,
      `Accounts for ${(compounding * 50).toFixed(1)}% incremental efficiency gain as domain familiarity increases`,
      'Recommended baseline for calendar scheduling and commitment planning',
    ],
    milestoneProjections: mapMilestones(balancedWeeks),
  };

  const acceleratedScen: ScenarioProjection = {
    id: 'accelerated',
    name: 'Accelerated Scenario',
    description: 'High-intensity sprint capitalizing on deep work immersion, strict boundary defense, and aggressive compounding efficiency.',
    estimatedWeeks: acceleratedWeeks,
    projectedDate: addWeeksToDate(acceleratedWeeks),
    confidenceScore: Math.max(38, Math.min(62, Math.round(48 + discipline * 10 - friction * 20))),
    velocityPerHour: Math.round((acceleratedEffectiveWeekly / weeklyHours) * 100) / 100,
    burnoutRiskLevel: 'High',
    assumptions: [
      `Requires dedicated overtime push of ${(weeklyHours * 1.25).toFixed(1)} hrs/week (+25% over baseline)`,
      `Demands near-zero friction resistance (${Math.round(friction * 50)}% assumed delay cap)`,
      'Vulnerable to sudden schedule disruptions or cognitive fatigue if sustained beyond 8 weeks',
      'Should be treated as an aspirational upper boundary rather than a hard commitment',
    ],
    milestoneProjections: mapMilestones(acceleratedWeeks),
  };

  // Generate Recharts timeline curve data
  const maxWeeks = Math.max(conservativeWeeks, 12);
  const timelinePoints: TimelineDataPoint[] = [];
  const startProgress = targetGoal ? targetGoal.progressPercentage : Math.round(
    activeGoals.reduce((sum, g) => sum + g.progressPercentage, 0) / (activeGoals.length || 1)
  );

  const stepsCount = Math.min(20, Math.max(8, maxWeeks));
  const weekIncrement = maxWeeks / stepsCount;

  for (let i = 0; i <= stepsCount; i++) {
    const wk = Math.round(i * weekIncrement);
    const consProgress = Math.min(100, Math.round(startProgress + ((100 - startProgress) * Math.min(1, wk / conservativeWeeks))));
    const balProgress = Math.min(100, Math.round(startProgress + ((100 - startProgress) * Math.min(1, wk / balancedWeeks))));
    const accProgress = Math.min(100, Math.round(startProgress + ((100 - startProgress) * Math.min(1, wk / acceleratedWeeks))));

    timelinePoints.push({
      week: wk,
      label: `Wk ${wk}`,
      conservative: consProgress,
      balanced: balProgress,
      accelerated: accProgress,
    });
  }

  return {
    params,
    targetGoalTitle: targetGoal ? targetGoal.title : `Composite Portfolio (${activeGoals.length} Active Goals)`,
    remainingHoursEstimated: Math.round(remainingHours),
    scenarios: {
      conservative: conservativeScen,
      balanced: balancedScen,
      accelerated: acceleratedScen,
    },
    timeline: timelinePoints,
    generatedAt: new Date().toISOString(),
  };
}
