# pages/Report

Full analysis report page shown after an analysis completes.

## Files

- `ReportPage.tsx` — route component at `/app/report`

## components/

Page-specific components used only by the Report page:

- `ActionableFixItem` — expandable list item showing a specific issue and how to fix it
- `BreakdownCard` — score breakdown card for a single category (visual, copy, performance)
- `ConversionHealthCard` — overall conversion health summary with donut chart
- `TopRecommendations` — ranked list of the highest-impact recommendations
- `WebVitalsChart` — bar chart of Core Web Vitals scores
