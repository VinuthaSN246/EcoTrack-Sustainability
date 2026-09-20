import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertCircle,
  Award,
  Bike,
  Check,
  Download,
  Leaf,
  Loader2,
  LogIn,
  LogOut,
  Minus,
  Recycle,
  RefreshCw,
  Search,
  Shield,
  Sliders,
  Sparkles,
  Sprout,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  User as UserIcon,
  X,
  Zap,
} from 'lucide-react';
import {
  clearSession,
  getFootprints,
  loadSession,
  loginUser,
  registerUser,
  saveFootprint,
  saveSession,
  type FootprintRecord,
  type User,
} from '@/services/api';
import { calculateFromFormData } from '@/services/carbonCalculator';
import { calculateEcoScore } from '@/services/ecoScore';
import type { FormData } from '@/types';

interface ProgressPageProps {
  onNavigate: (page: 'home' | 'calculator' | 'results' | 'dashboard' | 'progress' | 'profile' | 'recommendations') => void;
}

interface Achievement {
  id: string;
  icon: typeof Leaf;
  label: string;
  description: string;
  unlocked: boolean;
  progressText: string;
  progressPct: number;
  bg: string;
  color: string;
}

const DEMO_RECORDS: FootprintRecord[] = [
  {
    id: 901,
    user_id: 1,
    transportation: 4.4,
    electricity: 2.8,
    food: 2.3,
    waste: 0.9,
    travel: 1.6,
    total_co2: 12.0,
    eco_score: 41,
    created_at: new Date(Date.now() - 110 * 86400000).toISOString(),
  },
  {
    id: 902,
    user_id: 1,
    transportation: 3.6,
    electricity: 2.3,
    food: 1.9,
    waste: 0.7,
    travel: 1.2,
    total_co2: 9.7,
    eco_score: 55,
    created_at: new Date(Date.now() - 75 * 86400000).toISOString(),
  },
  {
    id: 903,
    user_id: 1,
    transportation: 2.7,
    electricity: 1.7,
    food: 1.6,
    waste: 0.5,
    travel: 0.8,
    total_co2: 7.3,
    eco_score: 71,
    created_at: new Date(Date.now() - 40 * 86400000).toISOString(),
  },
  {
    id: 904,
    user_id: 1,
    transportation: 2.0,
    electricity: 1.3,
    food: 1.2,
    waste: 0.4,
    travel: 0.5,
    total_co2: 5.4,
    eco_score: 84,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

export function ProgressPage({ onNavigate }: ProgressPageProps) {
  const [user, setUser] = useState<User | null>(() => loadSession());
  const [records, setRecords] = useState<FootprintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDemoData, setUseDemoData] = useState(false);

  // Interactive controls state
  const [timeframe, setTimeframe] = useState<'all' | '6m' | '30d'>('all');
  const [chartView, setChartView] = useState<'trend' | 'score' | 'breakdown'>('trend');
  const [targetReduction, setTargetReduction] = useState(20);
  const [achievementFilter, setAchievementFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localFootprintBannerDismissed, setLocalFootprintBannerDismissed] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Auth modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authForm, setAuthForm] = useState({
    mode: 'login' as 'login' | 'register',
    name: '',
    email: '',
    password: '',
    loading: false,
    error: null as string | null,
  });

  // Local storage calculation detection
  const localFormData = useMemo<FormData | null>(() => {
    try {
      const raw = localStorage.getItem('ecotrack_form_data');
      return raw ? (JSON.parse(raw) as FormData) : null;
    } catch {
      return null;
    }
  }, []);

  const localCalc = useMemo(() => {
    if (!localFormData) return null;
    const res = calculateFromFormData(localFormData);
    const score = calculateEcoScore(res.totalCO2);
    return { res, score };
  }, [localFormData]);

  // Load real records
  const loadUserRecords = (u: User | null) => {
    if (!u) {
      setLoading(false);
      setRecords([]);
      return;
    }
    setLoading(true);
    getFootprints(u.id).then(({ data, error }) => {
      setLoading(false);
      if (data && !error && data.footprints.length > 0) {
        setRecords(data.footprints);
      } else {
        setRecords([]);
      }
    });
  };

  useEffect(() => {
    const u = loadSession();
    setUser(u);
    loadUserRecords(u);
  }, []);

  // Active dataset: demo or real
  const activeRecords = useMemo(() => {
    if (useDemoData) return DEMO_RECORDS;
    if (records.length > 0) return records;
    return [];
  }, [useDemoData, records]);

  // Filtered by timeframe and sorted oldest -> newest
  const sortedRecords = useMemo(() => {
    const sorted = [...activeRecords].sort(
      (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime(),
    );

    if (timeframe === 'all') return sorted;

    const now = Date.now();
    const days = timeframe === '30d' ? 30 : 180;
    const cutoff = now - days * 86400000;
    return sorted.filter((r) => new Date(r.created_at ?? 0).getTime() >= cutoff);
  }, [activeRecords, timeframe]);

  // Key stats
  const latest = sortedRecords.length > 0 ? sortedRecords[sortedRecords.length - 1] : null;
  const previous = sortedRecords.length > 1 ? sortedRecords[sortedRecords.length - 2] : null;

  const footprintChange = latest && previous ? latest.total_co2 - previous.total_co2 : null;
  const scoreChange = latest && previous ? latest.eco_score - previous.eco_score : null;
  const improvementPct =
    latest && previous && previous.total_co2 > 0
      ? ((previous.total_co2 - latest.total_co2) / previous.total_co2) * 100
      : null;
  const co2Reduction = footprintChange !== null ? Math.max(0, -footprintChange) : null;

  // Target simulator metrics
  const targetCO2 = latest ? Math.max(0.5, Number((latest.total_co2 * (1 - targetReduction / 100)).toFixed(2))) : 4.0;
  const targetSavedCO2 = latest ? Number((latest.total_co2 - targetCO2).toFixed(2)) : 1.2;
  const estimatedAnnualSavings = Math.round(targetSavedCO2 * 180); // ~$180 saved per ton reduced in energy & fuel
  const treesEquivalent = Math.round(targetSavedCO2 * 45); // ~45 trees per ton CO2

  // Chart data
  const chartData = useMemo(() => {
    return sortedRecords.map((r) => ({
      date: r.created_at
        ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '—',
      fullDate: r.created_at ? new Date(r.created_at).toLocaleDateString() : '—',
      footprint: Number(r.total_co2.toFixed(2)),
      score: r.eco_score,
      transportation: Number(r.transportation.toFixed(2)),
      electricity: Number(r.electricity.toFixed(2)),
      food: Number(r.food.toFixed(2)),
      waste: Number(r.waste.toFixed(2)),
      travel: Number(r.travel.toFixed(2)),
    }));
  }, [sortedRecords]);

  // Achievements
  const achievements: Achievement[] = useMemo(() => {
    const count = sortedRecords.length;
    const currentScore = latest?.eco_score ?? 0;
    const currentTransport = latest?.transportation ?? 99;
    const currentWaste = latest?.waste ?? 99;

    return [
      {
        id: 'first',
        icon: Sprout,
        label: 'First Footprint',
        description: 'Logged your baseline carbon assessment',
        unlocked: count >= 1,
        progressText: count >= 1 ? 'Unlocked' : '0/1 assessment',
        progressPct: count >= 1 ? 100 : 0,
        bg: '#eaf7ed',
        color: '#118865',
      },
      {
        id: 'reduced',
        icon: TrendingDown,
        label: 'Carbon Reducer',
        description: 'Achieved a lower footprint than your prior assessment',
        unlocked: footprintChange !== null && footprintChange < 0,
        progressText: footprintChange !== null && footprintChange < 0 ? 'Achieved' : 'Need consecutive reduction',
        progressPct: footprintChange !== null && footprintChange < 0 ? 100 : 40,
        bg: '#eaf5f5',
        color: '#1594a1',
      },
      {
        id: 'master',
        icon: Award,
        label: 'Eco Master',
        description: 'Attain an Eco Score of 75 or higher',
        unlocked: currentScore >= 75,
        progressText: `${currentScore}/75 points`,
        progressPct: Math.min(100, Math.round((currentScore / 75) * 100)),
        bg: '#f8f4e9',
        color: '#e0932a',
      },
      {
        id: 'consistent',
        icon: Trophy,
        label: 'Consistent Tracker',
        description: 'Save 3 or more footprint calculations',
        unlocked: count >= 3,
        progressText: `${Math.min(3, count)}/3 recorded`,
        progressPct: Math.min(100, Math.round((count / 3) * 100)),
        bg: '#edf4f8',
        color: '#2979ff',
      },
      {
        id: 'commuter',
        icon: Bike,
        label: 'Clean Commuter',
        description: 'Keep transportation footprint below 2.2 tonnes/yr',
        unlocked: latest !== null && currentTransport <= 2.2,
        progressText: latest ? `${currentTransport.toFixed(1)} t (goal <= 2.2)` : 'No data',
        progressPct: latest ? Math.min(100, Math.round((2.2 / Math.max(0.1, currentTransport)) * 100)) : 0,
        bg: '#eaf7ed',
        color: '#118865',
      },
      {
        id: 'zero-waste',
        icon: Recycle,
        label: 'Low Waste Hero',
        description: 'Maintain waste emissions under 0.5 tonnes/yr',
        unlocked: latest !== null && currentWaste <= 0.5,
        progressText: latest ? `${currentWaste.toFixed(2)} t (goal <= 0.5)` : 'No data',
        progressPct: latest ? Math.min(100, Math.round((0.5 / Math.max(0.1, currentWaste)) * 100)) : 0,
        bg: '#f4fbf0',
        color: '#43a047',
      },
    ];
  }, [sortedRecords, latest, footprintChange]);

  const filteredAchievements = useMemo(() => {
    if (achievementFilter === 'unlocked') return achievements.filter((a) => a.unlocked);
    if (achievementFilter === 'locked') return achievements.filter((a) => !a.unlocked);
    return achievements;
  }, [achievements, achievementFilter]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Filtered history table rows
  const filteredHistory = useMemo(() => {
    const list = [...sortedRecords].reverse();
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((r) => {
      const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString() : '';
      return (
        dateStr.toLowerCase().includes(q) ||
        r.total_co2.toString().includes(q) ||
        r.eco_score.toString().includes(q)
      );
    });
  }, [sortedRecords, searchQuery]);

  // CSV Export
  const handleExportCSV = () => {
    if (sortedRecords.length === 0) return;
    const headers = ['Date', 'Transportation (t)', 'Electricity (t)', 'Food (t)', 'Waste (t)', 'Travel (t)', 'Total CO2e (t)', 'Eco Score'];
    const rows = sortedRecords.map((r) => [
      r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '—',
      r.transportation.toFixed(2),
      r.electricity.toFixed(2),
      r.food.toFixed(2),
      r.waste.toFixed(2),
      r.travel.toFixed(2),
      r.total_co2.toFixed(2),
      r.eco_score,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecotrack_progress_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Auth Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthForm((p) => ({ ...p, loading: true, error: null }));
    const fn =
      authForm.mode === 'register'
        ? registerUser(authForm.name, authForm.email, authForm.password)
        : loginUser(authForm.email, authForm.password);

    fn.then(({ data, error }) => {
      if (data && !error) {
        saveSession(data.user);
        setUser(data.user);
        setAuthOpen(false);
        setUseDemoData(false);
        setAuthForm((p) => ({ ...p, loading: false, error: null }));
        loadUserRecords(data.user);
      } else {
        setAuthForm((p) => ({ ...p, loading: false, error: error ?? 'Authentication failed' }));
      }
    });
  };

  // Quick Demo Login
  const handleQuickDemoLogin = () => {
    setAuthForm((p) => ({ ...p, loading: true, error: null }));
    loginUser('test@ecotrack.com', 'password123').then(({ data, error }) => {
      if (data && !error) {
        saveSession(data.user);
        setUser(data.user);
        setAuthOpen(false);
        setUseDemoData(false);
        setAuthForm((p) => ({ ...p, loading: false, error: null }));
        loadUserRecords(data.user);
      } else {
        setAuthForm((p) => ({
          ...p,
          loading: false,
          error: error || 'Could not log in to demo account. Switching to interactive demo mode.',
        }));
        setUseDemoData(true);
        setAuthOpen(false);
      }
    });
  };

  // Save current local calculation
  const handleSaveLocalCalculation = () => {
    if (!localFormData) return;
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setSaveStatus('saving');
    saveFootprint(user.id, localFormData).then(({ data, error }) => {
      if (data && !error) {
        setSaveStatus('saved');
        setRecords((prev) => [data.footprint, ...prev]);
        setLocalFootprintBannerDismissed(true);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    });
  };

  // Logout
  const handleLogout = () => {
    clearSession();
    setUser(null);
    setRecords([]);
    setUseDemoData(false);
  };

  return (
    <div className="calc-page">
      {/* ── Hero ─────────────────────────────────── */}
      <div className="calc-hero dashboard-hero">
        <div className="container">
          <div className="calc-hero-inner">
            <p className="section-eyebrow"><span />Progress &amp; Impact Tracking</p>
            <h1 className="calc-title">Your <em>Sustainability</em> Journey</h1>
            <p className="calc-intro">
              Monitor your carbon reductions, unlock achievements, simulate reduction targets, and celebrate your climate impact over time.
            </p>
          </div>
        </div>
      </div>

      <div className="container calc-body">
        {/* ── Interactive Toolbar ─────────────────────── */}
        <div className="progress-toolbar">
          <div className="progress-toolbar-left">
            <div className="progress-pill-group">
              <button
                type="button"
                className={`progress-pill-btn ${timeframe === 'all' ? 'active' : ''}`}
                onClick={() => setTimeframe('all')}
              >
                All Time
              </button>
              <button
                type="button"
                className={`progress-pill-btn ${timeframe === '6m' ? 'active' : ''}`}
                onClick={() => setTimeframe('6m')}
              >
                Past 6 Months
              </button>
              <button
                type="button"
                className={`progress-pill-btn ${timeframe === '30d' ? 'active' : ''}`}
                onClick={() => setTimeframe('30d')}
              >
                Last 30 Days
              </button>
            </div>

            <div className="progress-pill-group">
              <button
                type="button"
                className={`progress-pill-btn ${chartView === 'trend' ? 'active' : ''}`}
                onClick={() => setChartView('trend')}
              >
                CO₂e Trend
              </button>
              <button
                type="button"
                className={`progress-pill-btn ${chartView === 'score' ? 'active' : ''}`}
                onClick={() => setChartView('score')}
              >
                Eco Score
              </button>
              <button
                type="button"
                className={`progress-pill-btn ${chartView === 'breakdown' ? 'active' : ''}`}
                onClick={() => setChartView('breakdown')}
              >
                Breakdown
              </button>
            </div>
          </div>

          <div className="progress-toolbar-right">
            {/* Demo mode toggle */}
            <button
              type="button"
              className={`button button-small ${useDemoData ? 'button-saved' : 'button-ghost'}`}
              onClick={() => setUseDemoData((prev) => !prev)}
              title="Toggle between your live database records and simulated multi-month progression data"
            >
              <Sparkles size={14} />
              {useDemoData ? 'Viewing Demo Data' : 'Try Demo Mode'}
            </button>

            {/* Auth status / trigger */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="profile-member-badge" style={{ margin: 0 }}>
                  <Shield size={12} /> {user.name}
                </span>
                <button
                  type="button"
                  className="button button-ghost button-small"
                  onClick={handleLogout}
                  title="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="button button-small"
                onClick={() => setAuthOpen(true)}
              >
                <LogIn size={14} /> Sign In
              </button>
            )}
          </div>
        </div>

        {/* ── Detected Local Footprint Banner ────────── */}
        {localCalc && !localFootprintBannerDismissed && (
          <div className="progress-banner">
            <div className="progress-banner-info">
              <Sprout size={20} />
              <div>
                <strong>Recent calculation detected:</strong> {localCalc.res.totalCO2.toFixed(2)} tonnes CO₂e/year (Eco Score {localCalc.score}).
                {user ? ' Save it to your account history to include it in your progress timeline.' : ' Sign in or view demo progress below.'}
              </div>
            </div>
            <div className="progress-banner-actions">
              {user ? (
                <button
                  type="button"
                  className={`button button-small ${saveStatus === 'saved' ? 'button-saved' : ''}`}
                  onClick={handleSaveLocalCalculation}
                  disabled={saveStatus === 'saving' || saveStatus === 'saved'}
                >
                  {saveStatus === 'saving' && <Loader2 size={13} className="spin" />}
                  {saveStatus === 'saved' ? 'Saved to History!' : 'Save to History'}
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-small"
                  onClick={() => setAuthOpen(true)}
                >
                  Sign in &amp; Save
                </button>
              )}
              <button
                type="button"
                className="button-ghost"
                style={{ padding: '6px', border: 'none', cursor: 'pointer' }}
                onClick={() => setLocalFootprintBannerDismissed(true)}
                aria-label="Dismiss banner"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── Empty State / Unauthenticated Callout ──── */}
        {sortedRecords.length === 0 && !loading && (
          <div className="progress-empty">
            <div className="progress-empty-icon">
              <Target size={30} />
            </div>
            <h2 className="progress-empty-title">
              {!user ? 'Track your carbon reductions over time' : 'No recorded calculations found yet'}
            </h2>
            <p className="progress-empty-text">
              {!user
                ? 'Sign in to sync your calculation history across sessions, or toggle Interactive Demo Mode to explore real-time charts and achievements.'
                : 'Calculate your carbon footprint and save it to begin building your personal sustainability progression.'}
            </p>
            <div className="progress-empty-actions">
              <button
                type="button"
                className="button"
                onClick={() => setUseDemoData(true)}
              >
                <Sparkles size={16} /> Explore Demo Progression
              </button>
              {!user ? (
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setAuthOpen(true)}
                >
                  <LogIn size={16} /> Sign In / Register
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => onNavigate('calculator')}
                >
                  <Leaf size={16} /> Run Calculation
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Loading Spinner ─────────────────────────── */}
        {loading && (
          <div className="progress-loading">
            <Loader2 size={32} className="spin" />
            <span>Loading your sustainability progress...</span>
          </div>
        )}

        {/* ── Main Progress Content (when data available) ─ */}
        {sortedRecords.length > 0 && !loading && (
          <>
            {/* Stats row */}
            <div className="progress-stats-row">
              {/* Improvement */}
              <div className="dash-metric-card progress-stat-card">
                <div
                  className="dash-metric-icon"
                  style={{
                    background: improvementPct !== null && improvementPct > 0 ? '#eaf7ed' : '#f0f5f2',
                    color: improvementPct !== null && improvementPct > 0 ? '#118865' : '#65827e',
                  }}
                >
                  {improvementPct !== null && improvementPct > 0 ? <TrendingDown size={22} /> : <Minus size={22} />}
                </div>
                <p className="dash-metric-label">Improvement Rate</p>
                <div className="dash-metric-value">
                  {improvementPct !== null ? (
                    <>
                      {improvementPct > 0 ? '' : '+'}{improvementPct.toFixed(1)}%
                      <small>{improvementPct > 0 ? 'reduction from previous' : 'increase from previous'}</small>
                    </>
                  ) : (
                    <>
                      —<small>need 2+ records to compare</small>
                    </>
                  )}
                </div>
              </div>

              {/* CO2 reduction */}
              <div className="dash-metric-card progress-stat-card">
                <div
                  className="dash-metric-icon"
                  style={{
                    background: co2Reduction !== null && co2Reduction > 0 ? '#eaf7ed' : '#f0f5f2',
                    color: co2Reduction !== null && co2Reduction > 0 ? '#118865' : '#65827e',
                  }}
                >
                  <Leaf size={22} />
                </div>
                <p className="dash-metric-label">CO₂e Reduced</p>
                <div className="dash-metric-value">
                  {co2Reduction !== null ? (
                    <>
                      {co2Reduction.toFixed(2)} t
                      <small>{co2Reduction > 0 ? 'less emissions than prior' : 'no reduction change'}</small>
                    </>
                  ) : (
                    <>
                      —<small>need 2+ records to compare</small>
                    </>
                  )}
                </div>
              </div>

              {/* Eco Score */}
              <div className="dash-metric-card progress-stat-card">
                <div
                  className="dash-metric-icon"
                  style={{
                    background: scoreChange !== null && scoreChange > 0 ? '#eaf7ed' : '#f0f5f2',
                    color: scoreChange !== null && scoreChange > 0 ? '#118865' : '#65827e',
                  }}
                >
                  {scoreChange !== null && scoreChange > 0 ? <TrendingUp size={22} /> : <Minus size={22} />}
                </div>
                <p className="dash-metric-label">Latest Eco Score</p>
                <div className="dash-metric-value">
                  {latest?.eco_score ?? '—'}
                  <small>
                    {scoreChange !== null
                      ? `${scoreChange > 0 ? '+' : ''}${scoreChange} pts vs previous`
                      : 'overall sustainability score'}
                  </small>
                </div>
              </div>

              {/* Total Records */}
              <div className="dash-metric-card progress-stat-card">
                <div className="dash-metric-icon">
                  <Target size={22} />
                </div>
                <p className="dash-metric-label">Logged Entries</p>
                <div className="dash-metric-value">
                  {sortedRecords.length}
                  <small>{useDemoData ? 'demo sample timeline' : 'saved in SQLite database'}</small>
                </div>
              </div>
            </div>

            {/* ── Interactive Target Simulator ──────────── */}
            <div className="progress-goal-simulator">
              <div className="progress-goal-header">
                <h3 className="progress-goal-title">
                  <Sliders size={18} />
                  Interactive Target Reduction Simulator
                </h3>
                <span className="progress-goal-badge">
                  <Target size={14} /> Target: {targetReduction}% Lower ({targetCO2} t CO₂e)
                </span>
              </div>
              <div className="progress-slider-wrap">
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>5%</span>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={5}
                  value={targetReduction}
                  onChange={(e) => setTargetReduction(Number(e.target.value))}
                  className="progress-slider"
                  aria-label="Carbon reduction goal percentage"
                />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)' }}>50%</span>
              </div>
              <div className="progress-goal-metrics">
                <span>
                  Projected Emissions: <strong>{targetCO2} tonnes CO₂e/yr</strong>
                </span>
                <span>
                  Annual Impact: <strong>-{targetSavedCO2} tonnes avoided</strong>
                </span>
                <span>
                  Est. Energy &amp; Fuel Savings: <strong>~${estimatedAnnualSavings}/year</strong>
                </span>
                <span>
                  Equivalent to planting <strong>~{treesEquivalent} trees</strong>
                </span>
              </div>
            </div>

            {/* ── Interactive Charts ─────────────────────── */}
            <div className="progress-charts-row">
              {/* Primary Chart based on view */}
              <div className="dash-card progress-chart-card progress-chart-card-full">
                <div className="progress-chart-header">
                  <div>
                    <h2 className="results-card-title">
                      {chartView === 'trend' && 'Carbon Footprint Timeline'}
                      {chartView === 'score' && 'Eco Score Trajectory'}
                      {chartView === 'breakdown' && 'Emissions Category Evolution'}
                    </h2>
                    <p className="results-card-subtitle">
                      {chartView === 'trend' && `Showing annual tonnes CO₂e with your interactive ${targetReduction}% reduction target line`}
                      {chartView === 'score' && 'Eco score (0–100) progress across your recorded assessments'}
                      {chartView === 'breakdown' && 'Distribution of transport, electricity, food, waste, and travel emissions'}
                    </p>
                  </div>
                </div>

                <div className="progress-chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    {chartView === 'trend' ? (
                      <AreaChart data={chartData} margin={{ top: 20, right: 24, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="progressFootprintGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#118865" stopOpacity={0.28} />
                            <stop offset="100%" stopColor="#118865" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaf3ec" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
                          axisLine={{ stroke: '#d9e9e1' }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
                          axisLine={false}
                          tickLine={false}
                          domain={[0, 'auto']}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #d9e9e1',
                            fontSize: '12px',
                            fontFamily: 'DM Sans',
                            boxShadow: '0 8px 24px rgba(20,78,48,.1)',
                          }}
                          formatter={(value) => [`${Number(value).toFixed(2)} t CO₂e`, 'Footprint']}
                        />
                        <ReferenceLine
                          y={targetCO2}
                          stroke="#0d7a5a"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: `Target Goal: ${targetCO2} t`,
                            fill: '#0d7a5a',
                            fontSize: 11,
                            position: 'insideTopRight',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="footprint"
                          stroke="#118865"
                          strokeWidth={3}
                          fill="url(#progressFootprintGrad)"
                          dot={{ r: 5, fill: '#118865', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 7, fill: '#0d7a5a', strokeWidth: 3, stroke: '#fff' }}
                        />
                      </AreaChart>
                    ) : chartView === 'score' ? (
                      <LineChart data={chartData} margin={{ top: 20, right: 24, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaf3ec" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
                          axisLine={{ stroke: '#d9e9e1' }}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #d9e9e1',
                            fontSize: '12px',
                            fontFamily: 'DM Sans',
                            boxShadow: '0 8px 24px rgba(20,78,48,.1)',
                          }}
                          formatter={(value) => [`${value} / 100`, 'Eco Score']}
                        />
                        <ReferenceLine
                          y={75}
                          stroke="#e0932a"
                          strokeDasharray="3 3"
                          label={{
                            value: 'Eco Master: 75+',
                            fill: '#e0932a',
                            fontSize: 11,
                            position: 'insideTopRight',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#1594a1"
                          strokeWidth={3}
                          dot={{ r: 5, fill: '#1594a1', strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 7, fill: '#0c6974', strokeWidth: 3, stroke: '#fff' }}
                        />
                      </LineChart>
                    ) : (
                      <BarChart data={chartData} margin={{ top: 20, right: 24, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaf3ec" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
                          axisLine={{ stroke: '#d9e9e1' }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: '#82a098', fontFamily: 'DM Sans' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #d9e9e1',
                            fontSize: '12px',
                            fontFamily: 'DM Sans',
                            boxShadow: '0 8px 24px rgba(20,78,48,.1)',
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                        <Bar dataKey="transportation" name="Transport" stackId="a" fill="#118865" />
                        <Bar dataKey="electricity" name="Electricity" stackId="a" fill="#1594a1" />
                        <Bar dataKey="food" name="Food" stackId="a" fill="#e0932a" />
                        <Bar dataKey="waste" name="Waste" stackId="a" fill="#7a9a8c" />
                        <Bar dataKey="travel" name="Travel" stackId="a" fill="#72c84e" />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ── Achievements Section ─────────────────── */}
            <section className="progress-achievements-section">
              <div className="progress-achievements-header">
                <div className="progress-achievements-header-left">
                  <div className="progress-achievements-icon">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h2 className="dashboard-section-title" style={{ margin: 0 }}>
                      Sustainability Achievements
                    </h2>
                    <p className="progress-achievements-subtitle">
                      {unlockedCount} of {achievements.length} badges unlocked
                    </p>
                  </div>
                </div>

                <div className="progress-ach-filter-group">
                  <button
                    type="button"
                    className={`progress-ach-filter-btn ${achievementFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setAchievementFilter('all')}
                  >
                    All ({achievements.length})
                  </button>
                  <button
                    type="button"
                    className={`progress-ach-filter-btn ${achievementFilter === 'unlocked' ? 'active' : ''}`}
                    onClick={() => setAchievementFilter('unlocked')}
                  >
                    Unlocked ({unlockedCount})
                  </button>
                  <button
                    type="button"
                    className={`progress-ach-filter-btn ${achievementFilter === 'locked' ? 'active' : ''}`}
                    onClick={() => setAchievementFilter('locked')}
                  >
                    In Progress ({achievements.length - unlockedCount})
                  </button>
                </div>
              </div>

              <div className="progress-achievements-grid">
                {filteredAchievements.map((ach) => {
                  const Icon = ach.icon;
                  return (
                    <div
                      key={ach.id}
                      className={`achievement-card ${ach.unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
                    >
                      <div
                        className="achievement-icon"
                        style={{
                          background: ach.unlocked ? ach.bg : '#f0f5f2',
                          color: ach.unlocked ? ach.color : '#9cb2ab',
                        }}
                      >
                        <Icon size={22} />
                      </div>
                      <div className="achievement-info">
                        <span className="achievement-label">{ach.label}</span>
                        <span className="achievement-desc">{ach.description}</span>
                        <div className="achievement-progress-track">
                          <div
                            className="achievement-progress-bar"
                            style={{
                              width: `${ach.progressPct}%`,
                              background: ach.unlocked ? ach.color : '#a4c2b8',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: 10, color: '#82a098', marginTop: 4 }}>
                          {ach.progressText}
                        </span>
                      </div>
                      {ach.unlocked && (
                        <div className="achievement-badge" title="Unlocked achievement!">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Calculation History Table ─────────────── */}
            <section className="progress-history-section">
              <div className="progress-history-header-row">
                <h2 className="dashboard-section-title" style={{ margin: 0 }}>
                  Detailed Calculation History
                </h2>
                <div className="progress-history-actions">
                  <div className="progress-search-box">
                    <Search size={14} style={{ color: '#82a098' }} />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="button button-ghost button-small"
                    onClick={handleExportCSV}
                    title="Export records to CSV"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>
              </div>

              <div className="progress-history-table">
                <div className="progress-history-row progress-history-header">
                  <span>Date</span>
                  <span>Transport</span>
                  <span>Electricity</span>
                  <span>Food</span>
                  <span>Waste</span>
                  <span>Travel</span>
                  <span>Total</span>
                  <span>Eco Score</span>
                </div>
                {filteredHistory.map((r) => (
                  <div className="progress-history-row" key={r.id}>
                    <span>
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </span>
                    <span>{r.transportation.toFixed(2)} t</span>
                    <span>{r.electricity.toFixed(2)} t</span>
                    <span>{r.food.toFixed(2)} t</span>
                    <span>{r.waste.toFixed(2)} t</span>
                    <span>{r.travel.toFixed(2)} t</span>
                    <span>
                      <strong>{r.total_co2.toFixed(2)} t</strong>
                    </span>
                    <span
                      style={{
                        color: r.eco_score >= 70 ? '#118865' : r.eco_score >= 50 ? '#e0932a' : '#d4562f',
                        fontWeight: 700,
                      }}
                    >
                      {r.eco_score}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Disclaimer */}
            <div className="dashboard-disclaimer" style={{ marginBottom: 20 }}>
              <Sprout size={18} />
              <p>
                Calculations represent greenhouse gas equivalencies based on verified IPCC emission factors. Continue logging regular assessments to measure long-term sustainability impact.
              </p>
            </div>

            {/* Actions */}
            <div className="dashboard-actions-row">
              <button type="button" className="button" onClick={() => onNavigate('calculator')}>
                <Leaf size={16} /> Log New Calculation
              </button>
              <button type="button" className="button button-ghost" onClick={() => onNavigate('dashboard')}>
                View Impact Dashboard
              </button>
              <button type="button" className="button button-ghost" onClick={() => onNavigate('recommendations')}>
                <Zap size={16} /> Action Recommendations
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── Built-in Authentication Modal ──────────── */}
      {authOpen && (
        <div className="auth-overlay" onClick={() => setAuthOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="auth-close"
              onClick={() => setAuthOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="auth-modal-header">
              <div className="auth-modal-icon">
                <UserIcon size={26} />
              </div>
              <h2 className="auth-modal-title">
                {authForm.mode === 'login' ? 'Sign In to EcoTrack' : 'Create an Account'}
              </h2>
              <p className="auth-modal-subtitle">
                {authForm.mode === 'login'
                  ? 'Access your saved footprint calculations and progress history.'
                  : 'Start tracking your sustainability journey with a personal account.'}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authForm.error && (
                <div className="auth-error">
                  <AlertCircle size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  {authForm.error}
                </div>
              )}

              {authForm.mode === 'register' && (
                <div className="auth-field">
                  <label htmlFor="progress-auth-name">Your Name</label>
                  <input
                    id="progress-auth-name"
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  />
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="progress-auth-email">Email Address</label>
                <input
                  id="progress-auth-email"
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="progress-auth-password">Password</label>
                <input
                  id="progress-auth-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="button auth-submit"
                disabled={authForm.loading}
              >
                {authForm.loading ? (
                  <>
                    <Loader2 size={16} className="spin" /> Please wait...
                  </>
                ) : authForm.mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Quick Demo Login Option */}
              <button
                type="button"
                className="button button-ghost"
                style={{ width: '100%', marginTop: 8 }}
                onClick={handleQuickDemoLogin}
                disabled={authForm.loading}
              >
                <Sparkles size={14} /> Quick Demo Account Login
              </button>

              <button
                type="button"
                className="auth-toggle"
                onClick={() =>
                  setAuthForm((p) => ({
                    ...p,
                    mode: p.mode === 'login' ? 'register' : 'login',
                    error: null,
                  }))
                }
              >
                {authForm.mode === 'login'
                  ? "Don't have an account? Create one"
                  : 'Already have an account? Sign in'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
