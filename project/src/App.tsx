import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LandingPage } from '@/pages/LandingPage';
import { CalculatorPage } from '@/pages/CalculatorPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProgressPage } from '@/pages/ProgressPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { ChatAssistant } from '@/components/ChatAssistant';
import type { FormData } from '@/types';

type Page = 'home' | 'calculator' | 'results' | 'dashboard' | 'progress' | 'profile' | 'recommendations';

const STORAGE_KEY = 'ecotrack_form_data';
const PREV_TOTAL_KEY = 'ecotrack_prev_total';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [formData, setFormData] = useState<FormData | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as FormData) : null;
    } catch {
      return null;
    }
  });
  const [previousTotal, setPreviousTotal] = useState<number | null>(() => {
    try {
      const prevStored = localStorage.getItem(PREV_TOTAL_KEY);
      return prevStored ? parseFloat(prevStored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleNavigate = (target: Page) => setPage(target);

  const handleCalculateComplete = (data: FormData) => {
    setFormData(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage may be unavailable in some contexts
    }
    setPage('results');
  };

  const handleGoDashboard = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFormData(JSON.parse(stored) as FormData);
      }
      const prevStored = localStorage.getItem(PREV_TOTAL_KEY);
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
      <ChatAssistant />
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;

