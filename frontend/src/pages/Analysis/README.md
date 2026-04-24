# pages/Analysis

Analysis flow pages — from submitting a URL to watching the live progress.

## Files

- `NewAnalysisPage.tsx` — form at `/app/new-analysis` where users enter a URL and choose analysis depth
- `AnalysisProgressPage.tsx` — live progress view at `/app/analysis-progress` showing engine stages

## components/

Page-specific components used only by the Analysis flow:

- `AnalysisDepthSelector` — selector for quick / standard / deep analysis modes
- `EarlyInsights` — panel showing preliminary findings as the analysis runs
- `EngineConsole` — live log console displaying analysis engine output
- `RecentURLHistory` — grid of recently analyzed URLs for quick re-analysis
- `StageCard` — card showing the status of a single analysis stage (crawl, CV, NLP, scoring)
