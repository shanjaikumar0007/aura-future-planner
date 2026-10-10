import { Goal, Recommendation, UserProfile } from '../types';
import { GoogleGenAI } from '@google/genai';

/**
 * Transparent Strategic Insight Engine.
 * Evaluates goal telemetry against deterministic heuristic rules.
 * If a real GEMINI API key is provided, it can synthesize high-level strategic reasoning,
 * but NEVER claims AI execution when running deterministically.
 */
export async function generateRecommendations(
  goals: Goal[],
  profile: UserProfile,
  priorityFilter: 'all' | 'urgent' | 'moderate' | 'opportunity' = 'all',
  requestAIEnhancement: boolean = false
): Promise<{ recommendations: Recommendation[]; engineSource: 'deterministic-rules' | 'gemini-model'; rationaleSummary: string }> {
  // 1. Generate Deterministic Rule-Based Recommendations
  const rulesRecs: Recommendation[] = [];
  const now = new Date();

  // Rule A: Pacing vs Deadline Drift Check
  goals.forEach((goal) => {
    if (goal.status === 'completed') return;

    const targetDate = new Date(goal.targetDate);
    const startDate = new Date(goal.startDate);
    const totalDurationDays = Math.max(1, (targetDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const daysElapsed = Math.max(0, (now.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const timeElapsedPct = Math.min(100, Math.round((daysElapsed / totalDurationDays) * 100));

    // If time elapsed is significantly ahead of progress percentage
    if (timeElapsedPct - goal.progressPercentage >= 20) {
      const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 3600 * 24)));
      rulesRecs.push({
        id: `rec-drift-${goal.id}`,
        title: `Pacing Deficit Detected: "${goal.title}"`,
        category: 'pacing',
        priority: timeElapsedPct - goal.progressPercentage >= 35 ? 'urgent' : 'moderate',
        description: `This goal has consumed ${timeElapsedPct}% of its allocated schedule, but logged completion stands at only ${goal.progressPercentage}%. At current velocity, completion will slip beyond the ${goal.targetDate} target.`,
        rationale: `Triggered because timeline elapsed ratio (${timeElapsedPct}%) outpaces progress completion (${goal.progressPercentage}%) by ${timeElapsedPct - goal.progressPercentage} percentage points.`,
        metricTriggered: `Time-to-Progress Delta: +${timeElapsedPct - goal.progressPercentage}% (${daysRemaining} days remaining)`,
        actionableSteps: [
          `Audit remaining ${goal.estimatedTotalHours - goal.loggedHours} estimated hours and identify atomic chunks`,
          `Reschedule or prune non-essential sub-milestones to protect core deliverables`,
          `Protect a dedicated 3-hour uninterrupted focus block this week for milestone work`,
        ],
        targetGoalId: goal.id,
        targetGoalTitle: goal.title,
        actionType: 'reschedule',
        engineSource: 'deterministic-rules',
      });
    }
  });

  // Rule B: High-Priority Milestone Stagnation
  goals.forEach((goal) => {
    if (goal.status === 'completed') return;
    const pendingMilestones = goal.milestones.filter((m) => !m.completed);
    if (pendingMilestones.length > 0 && goal.progressPercentage > 0 && goal.loggedHours > 0) {
      const nextMilestone = pendingMilestones[0];
      if (nextMilestone.dueDate) {
        const due = new Date(nextMilestone.dueDate);
        const daysLeft = Math.ceil((due.getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (daysLeft <= 14) {
          rulesRecs.push({
            id: `rec-milestone-${nextMilestone.id}`,
            title: `Imminent Milestone Critical Path: "${nextMilestone.title}"`,
            category: 'milestone',
            priority: daysLeft <= 5 ? 'urgent' : 'moderate',
            description: `The upcoming milestone "${nextMilestone.title}" for "${goal.title}" is due in ${daysLeft > 0 ? `${daysLeft} days` : 'overdue'}. Completing this will unblock subsequent phases.`,
            rationale: `Milestone due date is within the two-week critical operational window.`,
            metricTriggered: `Milestone due in ${daysLeft} days (Estimated: ${nextMilestone.estimatedHours || 15} hours)`,
            actionableSteps: [
              `Review prerequisites for "${nextMilestone.title}" today`,
              `Block execution time before ${nextMilestone.dueDate}`,
              `Mark completed in Goal Studio once verification passes`,
            ],
            targetGoalId: goal.id,
            targetGoalTitle: goal.title,
            actionType: 'complete_milestone',
            engineSource: 'deterministic-rules',
          });
        }
      }
    }
  });

  // Rule C: Category Allocation & Portfolio Balance
  const activeGoals = goals.filter((g) => g.status !== 'completed');
  const categoryCounts: Record<string, number> = {};
  activeGoals.forEach((g) => {
    categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1;
  });

  if (categoryCounts['career'] && categoryCounts['career'] >= 2 && (!categoryCounts['health'] || categoryCounts['health'] === 0)) {
    rulesRecs.push({
      id: 'rec-balance-health',
      title: 'Restorative Health Asymmetry Warning',
      category: 'balance',
      priority: 'moderate',
      description: 'Your portfolio is heavily weighted toward high-cognitive career objectives with zero active health or recovery goals. High cognitive demands without deliberate physical baseline maintenance degrades sustained output.',
      rationale: 'Active goals contain multiple Career tasks with 0 Health/Endurance goals active.',
      metricTriggered: `Career: ${categoryCounts['career']} vs Health: 0 active initiatives`,
      actionableSteps: [
        'Establish at least 1 baseline physical vitality routine (e.g., 3x weekly aerobic conditioning or sleep hygiene)',
        'Schedule fixed non-negotiable recovery zones in your weekly calendar',
      ],
      engineSource: 'deterministic-rules',
    });
  }

  // Rule D: Momentum Quick Win / High Completion Opportunity
  const nearCompletion = activeGoals.filter((g) => g.progressPercentage >= 70 && g.progressPercentage < 100);
  if (nearCompletion.length > 0) {
    const topNear = nearCompletion[0];
    const uncompletedCount = topNear.milestones.filter((m) => !m.completed).length;
    rulesRecs.push({
      id: `rec-quickwin-${topNear.id}`,
      title: `Closing Sprint Opportunity: "${topNear.title}"`,
      category: 'opportunity',
      priority: 'opportunity',
      description: `"${topNear.title}" is already at ${topNear.progressPercentage}% completion with only ${uncompletedCount} milestone${uncompletedCount === 1 ? '' : 's'} remaining. Completing it delivers compounding psychological momentum and frees cognitive capacity.`,
      rationale: `Goal progress is over 70% threshold with clear finish line proximity.`,
      metricTriggered: `Progress at ${topNear.progressPercentage}% · Estimated remaining: ${Math.max(5, topNear.estimatedTotalHours - topNear.loggedHours)} hrs`,
      actionableSteps: [
        `Conduct a 1-day dedicated closing sprint this weekend`,
        `Resolve final validation criteria and celebrate completion`,
        `Reallocate weekly capacity to pending initiatives`,
      ],
      targetGoalId: topNear.id,
      targetGoalTitle: topNear.title,
      engineSource: 'deterministic-rules',
    });
  }

  // Rule E: Bandwidth & Weekly Target Hours Audit
  const totalWeeklyCommittedHours = activeGoals.reduce((sum, g) => {
    const remaining = Math.max(5, g.estimatedTotalHours - g.loggedHours);
    // assume distributed across 12 weeks
    return sum + remaining / 12;
  }, 0);

  if (totalWeeklyCommittedHours > profile.weeklyTargetHours * 1.25) {
    rulesRecs.push({
      id: 'rec-bandwidth-overload',
      title: 'Capacity Overload: Target Hours Exceeded',
      category: 'risk',
      priority: 'urgent',
      description: `Your active goals require an estimated ${Math.round(totalWeeklyCommittedHours)} hrs/week to meet current deadlines, which exceeds your planned capacity of ${profile.weeklyTargetHours} hrs/week by ${Math.round(totalWeeklyCommittedHours - profile.weeklyTargetHours)} hrs.`,
      rationale: `Active goal workload demand (${Math.round(totalWeeklyCommittedHours)} hrs/wk) exceeds user profile limit (${profile.weeklyTargetHours} hrs/wk).`,
      metricTriggered: `Weekly demand: ${Math.round(totalWeeklyCommittedHours)} hrs vs Capacity: ${profile.weeklyTargetHours} hrs (+${Math.round(((totalWeeklyCommittedHours / profile.weeklyTargetHours) - 1) * 100)}%)`,
      actionableSteps: [
        'Move at least one non-critical goal to "on_hold" status in Goal Studio',
        'Extend target dates for secondary initiatives by 3-4 weeks',
        'Protect core priority goals from context switching',
      ],
      engineSource: 'deterministic-rules',
    });
  }

  // Check if AI enhancement is requested and API key is present
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
                 (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
                 '';

  if (requestAIEnhancement && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are the executive strategic advisor inside AURA (Goal Planning & Scenario Simulator).
Given the user's active goals:
${goals.map((g) => `- ${g.title} (${g.category}, ${g.progressPercentage}%, target: ${g.targetDate}, ${g.loggedHours}/${g.estimatedTotalHours} hrs)`).join('\n')}
User weekly capacity: ${profile.weeklyTargetHours} hours/week.

Synthesize exactly 2 high-leverage strategic recommendations.
Respond in valid JSON matching this schema:
[
  {
    "id": "gemini-rec-1",
    "title": "string",
    "category": "pacing" | "risk" | "acceleration" | "balance" | "milestone",
    "priority": "urgent" | "moderate" | "opportunity",
    "description": "string",
    "rationale": "Exact metric or pattern observed",
    "metricTriggered": "string",
    "actionableSteps": ["string", "string"]
  }
]
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '[]';
      const aiRecs = JSON.parse(responseText);

      if (Array.isArray(aiRecs) && aiRecs.length > 0) {
        const formattedAiRecs: Recommendation[] = aiRecs.map((r, i) => ({
          ...r,
          id: `gemini-${Date.now()}-${i}`,
          engineSource: 'gemini-model' as const,
        }));

        const combined = [...formattedAiRecs, ...rulesRecs];
        const filtered = priorityFilter === 'all' ? combined : combined.filter((r) => r.priority === priorityFilter);
        return {
          recommendations: filtered,
          engineSource: 'gemini-model',
          rationaleSummary: 'Recommendations synthesized via Gemini 2.5 Flash grounded in current goal metrics and schedule telemetry.',
        };
      }
    } catch (err) {
      console.warn('Gemini API call skipped or encountered error, smoothly falling back to deterministic heuristic rules', err);
    }
  }

  // Deterministic engine output
  const filteredRules = priorityFilter === 'all'
    ? rulesRecs
    : rulesRecs.filter((r) => r.priority === priorityFilter);

  return {
    recommendations: filteredRules,
    engineSource: 'deterministic-rules',
    rationaleSummary: 'Evaluated deterministically across 5 strategic heuristics: Timeline-Progress Drift, Imminent Milestones, Capacity Ratios, Category Balance, and Momentum Thresholds.',
  };
}
