# AURA — AI-Powered Personal Goal Planning and Future Scenario Simulator

AURA is a high-performance web application designed for strategic personal goal planning, multi-scenario future simulations, and actionable strategic insights. Built with React, TypeScript, Vite, Tailwind CSS, Recharts, and localStorage.

---

## Key Highlights

- **Multi-Scenario Horizon Modeling**: Compare **Conservative**, **Balanced**, and **Accelerated** outcomes side-by-side with dynamic weekly sensitivity curves.
- **Granular Atomic Milestones**: Deconstruct ambitious objectives into actionable deliverables with estimated hours and due dates.
- **Transparent Strategic Heuristics**: Deterministic rule engines analyze pacing drift, capacity saturation, and milestone bottlenecks with zero fake AI hype.
- **Interactive Data Telemetry**: High-density Recharts graphs for timeline trajectories, category distribution, and effort vs estimates.
- **Client-Side Persistence**: Fully persistent in browser `localStorage`, with complete JSON backup export/import and demo reset.

---

## Application Structure (The 7 Pages)

1. **Overview (Landing Page)**:
   - High-contrast hero section with animated ambient glow.
   - Interactive live simulation sandbox allowing visitors to test dedicated hours directly.
   - Core architecture features and 3-stage execution pipeline.
   - Empirical calibration metrics and professional footer.

2. **Dashboard**:
   - Aggregate goal metrics (active goals, weighted completion %, time invested, weekly capacity).
   - Recharts Area chart comparing actual completion trajectory against target baseline.
   - Goal progress distribution horizontal bar chart.
   - Imminent milestones radar with instant check-off functionality.
   - Real-time activity audit stream.

3. **Goal Studio**:
   - Comprehensive CRUD for goals across Career, Health, Finance, Learning, and Personal domains.
   - Full input validation (title, dates, target > start, positive hour estimations).
   - Real-time search by keywords, tags, or description.
   - Category, status, and priority segmented filter tabs with sorting options.
   - Milestone checklist with instant toggle and quick ±5% progress adjustments.
   - Delete confirmation modal.

4. **Future Scenario Simulator**:
   - Multivariate controls: Dedicated Weekly Hours, Consistency/Discipline factor, and Life Friction risk.
   - Dynamic recalculation across three distinct models:
     - **Conservative**: 35% life friction buffer, 25% contingency timeline, 88% confidence.
     - **Balanced (Target Plan)**: Steady adherence with gradual momentum, 72% confidence.
     - **Accelerated Sprint**: Overtime push with high focus, 48% confidence, high burnout risk.
   - Multi-line Recharts progression graph over future weeks.
   - Projected milestone calendar comparison.
   - Prominent disclaimer: *Estimates are heuristic scenario models, not guaranteed predictions.*

5. **Strategic Insights Engine**:
   - Rule-based analysis evaluating 5 core heuristics:
     - *Timeline-Progress Drift*: Detects when elapsed schedule outpaces completion.
     - *Milestone Bottlenecks*: Flags critical milestones due within 14 days.
     - *Capacity Saturation*: Warns when weekly active commitments exceed user targets.
     - *Closing Sprints*: Identifies goals past 70% threshold with few remaining tasks.
     - *Domain Asymmetry*: Highlights health/vitality neglect under heavy career load.
   - Every recommendation details the exact triggering metric and provides actionable checklists.
   - Optional Gemini AI synthesis when API credentials exist, with full transparency labeling.

6. **Progress Analytics**:
   - Effort invested vs estimated by domain (Grouped Recharts Bar Chart).
   - Completed vs active goals ratio (Recharts Donut Chart).
   - Tabular-figure performance ledger with domain and status filtering.

7. **Profile & Settings**:
   - User identity, professional title, and bio North Star configuration.
   - Weekly target hour capacity calibration.
   - Accent color preferences and notification toggles.
   - **Dedicated JSON Backup & Configuration Export**:
     - Exports current goals, milestones, and application configurations as an ISO-timestamped `.json` file.
     - Selectable export scopes: Full Backup, Goals & Milestones Only, or Configuration Only.
     - Real-time payload size and line count calculation.
     - Live JSON syntax preview and one-click copy to clipboard.
   - **Academic Presentation & Demo Mode Controller**:
     - Explicit "Load Demo Data" button staging 5 benchmark sample goals across Academic (Thesis), Career (Distributed SaaS), Fitness (Marathon), and Personal domains.
     - Live dataset status indicator with visual badges.
     - Confirmed reset and clear workspace safeguards to prevent accidental overwrites.
   - Full JSON workspace restore via file upload.
   - Confirmed demo reset restoring baseline state.
   - Interactive QA Verification Checklist modal.

---

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4 + Dark Navy Palette (`#080C15`, `#0F172A`)
- **Data Visualization**: Recharts (Line, Area, Bar, Pie charts)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage` with failover and JSON serialization

---

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Verification & Testing Checklist

The application includes an in-app interactive Quality Assurance checklist accessible from **Settings -> Verification Checklist**:

1. [x] **Navigation & Page Routing**: Seamless switching between all 7 views with zero console errors.
2. [x] **Goal Studio CRUD**: Create new goals, edit fields, delete with confirmation, and validate dates.
3. [x] **Milestone Checklist**: Check off items to instantly recalculate progress and log activity.
4. [x] **Future Simulator Sensitivity**: Adjusting weekly hours and friction sliders immediately re-renders trajectories.
5. [x] **Transparency & Zero Fake AI**: All recommendations display exact metric triggers; no mock AI badges.
6. [x] **Progress Analytics**: Grouped bar charts and donut breakdown reflect live saved records.
7. [x] **LocalStorage Persistence**: Settings, goals, and logs survive page reloads.
8. [x] **JSON Export & Import**: Snapshot backup downloads and verifies on import.
9. [x] **Responsive Mobile Drawer**: Works cleanly across desktop, tablet, and mobile viewport widths.
