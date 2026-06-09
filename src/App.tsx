import React, { Suspense, lazy } from 'react';
import { useStore } from './store/useStore';
import { useGamificationStore } from './store/gamificationStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { Spinner, LoadingSkeleton } from './components/ui';
import { Sparkles, Target } from 'lucide-react';

// Lazy load components for code splitting
const MaterialSelector = lazy(() =>
  import('./components/Materials/MaterialSelector').then(m => ({ default: m.MaterialSelector }))
);
const AnalysisForm = lazy(() =>
  import('./components/Analysis/AnalysisForm').then(m => ({ default: m.AnalysisForm }))
);
const ResultsView = lazy(() =>
  import('./components/Results/ResultsView').then(m => ({ default: m.ResultsView }))
);
const ComparisonView = lazy(() =>
  import('./components/Comparison/ComparisonView').then(m => ({ default: m.ComparisonView }))
);
const ProgressDashboard = lazy(() =>
  import('./components/Dashboard/ProgressDashboard').then(m => ({ default: m.ProgressDashboard }))
);

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-slate-600">Loading...</p>
    </div>
  </div>
);

function App() {
  const { activeTab, selectedMaterial, analysisResults, setActiveTab } = useStore();
  const { recordAnalysis } = useGamificationStore();

  const tabIndexMap = {
    materials: 1,
    analysis: 2,
    results: 3,
    comparison: 4,
    dashboard: 5,
  } as const;

  const progressPercent = (tabIndexMap[activeTab as keyof typeof tabIndexMap] / 5) * 100;
  
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'materials':
        return (
          <Suspense fallback={<LoadingSkeleton batch="card" count={3} />}>
            <MaterialSelector />
          </Suspense>
        );
      case 'analysis':
        return (
          <Suspense fallback={<LoadingSkeleton batch="list" count={5} />}>
            <AnalysisForm />
          </Suspense>
        );
      case 'results':
        return (
          <Suspense fallback={<LoadingSkeleton batch="list" count={4} />}>
            <ResultsView />
          </Suspense>
        );
      case 'comparison':
        return (
          <Suspense fallback={<LoadingSkeleton batch="list" count={4} />}>
            <ComparisonView />
          </Suspense>
        );
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingSkeleton batch="list" count={6} />}>
            <ProgressDashboard />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSkeleton batch="card" count={3} />}>
            <MaterialSelector />
          </Suspense>
        );
    }
  };
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen relative bg-slate-50 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(14,165,233,0.16),transparent_36%),radial-gradient(circle_at_88%_12%,rgba(13,148,136,0.16),transparent_34%),radial-gradient(circle_at_78%_82%,rgba(245,158,11,0.10),transparent_30%)]" />
          <div className="absolute top-24 -left-20 w-80 h-80 rounded-full bg-sky-300/20 blur-3xl animate-float-slow" />
          <div className="absolute bottom-20 -right-16 w-72 h-72 rounded-full bg-teal-300/20 blur-3xl animate-float-slow" />
        </div>

        <Header />
        <Navigation />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Progress Section */}
          <section className="mb-6 rounded-3xl border border-white/70 bg-white/80 backdrop-blur-sm shadow-xl px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold">Circular Intelligence Dashboard</p>
                  <p className="text-lg text-slate-900 font-bold">Build, compare, and optimize impact scenarios</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 font-semibold border border-sky-200">
                  Material: {selectedMaterial?.name || 'Not selected'}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                  Analyses: {analysisResults.length}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Target className="w-3.5 h-3.5" /> Workflow Progress
                </span>
                <span className="font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </section>

          {renderActiveTab()}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
