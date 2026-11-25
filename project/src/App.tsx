import { lazy, Suspense, useEffect, useState } from 'react';
import { getCurrentUser, saveSession } from '@/services/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { ResultsPage } from '@/pages/ResultsPage';
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const ProgressPage = lazy(() => import('@/pages/ProgressPage').then((module) => ({ default: module.ProgressPage })));
import { ProfilePage } from '@/pages/ProfilePage';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { ChatAssistant } from '@/components/ChatAssistant';
import type { FormData } from '@/types';
import { calculateFromFormData } from '@/services/carbonCalculator';

type Page = 'home' | 'calculator' | 'results' | 'dashboard' | 'progress' | 'profile' | 'recommendations';
const pagePaths: Record<Page, string> = { home: '/', calculator: '/calculator', results: '/results', dashboard: '/dashboard', progress: '/progress', profile: '/profile', recommendations: '/recommendations' };
function pageFromPath(path: string): Page {
  return (Object.entries(pagePaths).find(([, value]) => value === path)?.[0] as Page | undefined) ?? 'home';
}

const STORAGE_KEY = 'ecotrack_form_data';
const PREV_TOTAL_KEY = 'ecotrack_prev_total';

function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname));
  const [formData, setFormData] = useState<FormData | null>(() => {
    if (typeof window === 'undefined') return null;
    try { const stored = window.localStorage.getItem(STORAGE_KEY); return stored ? JSON.parse(stored) as FormData : null; } catch { return null; }
  });
  const [previousTotal, setPreviousTotal] = useState<number | null>(() => {
    try {
      const prevStored = window.localStorage.getItem(PREV_TOTAL_KEY);
      return prevStored ? parseFloat(prevStored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.location.pathname !== pagePaths[page]) window.history.pushState({}, '', pagePaths[page]);
  }, [page]);

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        try { setFormData(event.newValue ? JSON.parse(event.newValue) as FormData : null); } catch { setFormData(null); }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    getCurrentUser().then(({ data, error }) => {
      if (!error && data) {
        if (data.user) saveSession(data.user);
        else window.localStorage.removeItem('ecotrack_user');
      }
    });
  }, []);

  const handleNavigate = (target: Page) => setPage(target);

  const handleCalculateComplete = (data: FormData) => {
    if (formData) {
      try { window.localStorage.setItem(PREV_TOTAL_KEY, String(calculateFromFormData(formData).totalCO2)); } catch { /* preference cache only */ }
    }
    setFormData(data);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage may be unavailable in some contexts
    }
    setPage('results');
  };

  const handleGoDashboard = () => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFormData(JSON.parse(stored) as FormData);
      }
      const prevStored = window.localStorage.getItem(PREV_TOTAL_KEY);
      if (prevStored) setPreviousTotal(parseFloat(prevStored));
    } catch {
      // ignore parse errors
    }
    setPage('dashboard');
  };

  return (
    <div className="app-shell">
      <Navbar onNavigate={handleNavigate} onGoDashboard={handleGoDashboard} hasData={!!formData} currentPage={page} />
      {page === 'home' && <LandingPage onNavigate={handleNavigate} />}
      {page === 'calculator' && (
        <CalculatorPage onComplete={handleCalculateComplete} onNavigate={handleNavigate} />
      )}
      {page === 'results' && (
        formData ? (
          <ResultsPage data={formData} onNavigate={handleNavigate} onGoDashboard={handleGoDashboard} />
        ) : (
          <CalculatorPage onComplete={handleCalculateComplete} onNavigate={handleNavigate} />
        )
      )}
      <Suspense fallback={<div className="progress-loading" role="status">Loading page…</div>}>
      {page === 'dashboard' && (
        <DashboardPage data={formData} previousTotal={previousTotal} onNavigate={handleNavigate} />
      )}
      {page === 'progress' && (
        <ProgressPage onNavigate={handleNavigate} />
      )}
      {page === 'profile' && (
        <ProfilePage onNavigate={handleNavigate} />
      )}
      {page === 'recommendations' && (
        <RecommendationsPage formData={formData} onNavigate={handleNavigate} />
      )}
      </Suspense>
      {page !== 'calculator' && !(page === 'results' && !formData) && <ChatAssistant />}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}


export default App;

