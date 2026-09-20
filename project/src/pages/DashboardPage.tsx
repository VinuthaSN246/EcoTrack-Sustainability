import { useEffect, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Brain,
  Car,
  Check,
  Clock,
  Gauge,
  Globe,
  Home,
  Leaf,
  Lightbulb,
  Loader2,
  LogIn,
  LogOut,
  Minus,
  Plane,
  Recycle,
  Save,
  Sprout,
  TrendingDown,
  TrendingUp,
  User as UserIcon,
  Utensils,
  X,
  Zap,
} from 'lucide-react';
import type { FormData } from '@/types';
import { calculateFromFormData, mapFormData, type CarbonResult } from '@/services/carbonCalculator';
import {
  calculateEcoScore,
  getHighestCategory,
  getLowestCategory,
  getScoreBand,
  getTopInsight,
} from '@/services/ecoScore';
import {
  generateRecommendations,
  type Priority,
} from '@/services/recommendationEngine';
import {
  fetchMLPrediction,
  type MLPredictionResult,
} from '@/services/mlPrediction';
import {
  loadSession,
  saveSession,
  clearSession,
  registerUser,
  loginUser,
  saveFootprint,
  getFootprints,
  type User,
  type FootprintRecord,
} from '@/services/api';

interface DashboardPageProps {
  data: FormData | null;
  previousTotal: number | null;
  onNavigate: (page: 'home' | 'calculator' | 'results' | 'dashboard' | 'progress' | 'profile' | 'recommendations') => void;
}

interface AuthFormState {
  mode: 'login' | 'register';
  name: string;
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
}

export function DashboardPage({ data, previousTotal, onNavigate }: DashboardPageProps) {
  if (!data) {
    return (
      <div className="calc-page">
        <div className="calc-hero">
          <div className="container">
            <div className="calc-hero-inner">
              <div className="pill">
                <span className="pulse-dot" />
                DASHBOARD
              </div>
              <h1 className="calc-title">
                Your <em>Eco Dashboard</em>
              </h1>
              <p className="calc-intro">
                Calculate your carbon footprint to unlock detailed breakdowns, AI insights, and ML predictions.
              </p>
            </div>
          </div>
        </div>
        <div className="calc-body">
          <div className="container">
            <div className="progress-empty" style={{ margin: '40px auto', maxWidth: 540 }}>
              <div className="progress-empty-icon"><Gauge size={32} /></div>
              <h3 className="progress-empty-title">No calculation data yet</h3>
              <p className="progress-empty-text">
                Complete your quick 5-step carbon footprint assessment to view your personalized analytics, ML benchmark, and reduction insights.
              </p>
              <button type="button" className="button" onClick={() => onNavigate('calculator')}>
                Start Carbon Calculator
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardContent data={data} previousTotal={previousTotal} onNavigate={onNavigate} />;
}

function DashboardContent({ data, previousTotal, onNavigate }: { data: FormData; previousTotal: number | null; onNavigate: (page: 'home' | 'calculator' | 'results' | 'dashboard' | 'progress' | 'profile' | 'recommendations') => void }) {
  const result: CarbonResult = calculateFromFormData(data);
  const lifestyle = mapFormData(data);
  const { headline: recHeadline, recommendations } = generateRecommendations(result, lifestyle);
  const recSectionRef = useRef<HTMLElement>(null);
  const ecoScore = calculateEcoScore(result.totalCO2);
  const scoreBand = getScoreBand(ecoScore);
  const insight = getTopInsight(result);
  const highest = getHighestCategory(result);
  const lowest = getLowestCategory(result);

  const change = previousTotal !== null ? result.totalCO2 - previousTotal : null;

  // ML prediction state
  const [mlPrediction, setMlPrediction] = useState<MLPredictionResult | null>(null);
  const [mlLoading, setMlLoading] = useState(true);
  const [mlError, setMlError] = useState<string | null>(null);

  // User session + history state
  const [user, setUser] = useState<User | null>(() => loadSession());
  const [authOpen, setAuthOpen] = useState(false);
  const [authForm, setAuthForm] = useState<AuthFormState>({
    mode: 'login', name: '', email: '', password: '', error: null, loading: false,
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [history, setHistory] = useState<FootprintRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMlLoading(true);
    setMlError(null);
    fetchMLPrediction(data).then(({ prediction, error }) => {
      if (cancelled) return;
      setMlPrediction(prediction);
      setMlError(error);
      setMlLoading(false);
    });
    return () => { cancelled = true; };
  }, [data]);

  // Load history when user changes
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    getFootprints(user.id).then(({ data: d, error }) => {
      setHistoryLoading(false);
      if (d && !error) {
        setHistory(d.footprints);
      }
    });
  }, [user]);

  const mlDiff = mlPrediction ? mlPrediction.predictedCO2 - result.totalCO2 : null;
  const mlDiffPct = mlPrediction && result.totalCO2 > 0 ? (Math.abs(mlDiff!) / result.totalCO2) * 100 : null;

  const greetingName = user?.name ?? 'there';

  // ── Auth handlers ─────────────────────────────────
  function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthForm((p) => ({ ...p, loading: true, error: null }));
    const fn = authForm.mode === 'register'
      ? registerUser(authForm.name, authForm.email, authForm.password)
      : loginUser(authForm.email, authForm.password);
    fn.then(({ data: d, error }) => {
      if (d && !error) {
        saveSession(d.user);
        setUser(d.user);
        setAuthOpen(false);
        setAuthForm((p) => ({ ...p, loading: false, error: null }));
      } else {
        setAuthForm((p) => ({ ...p, loading: false, error: error ?? 'Authentication failed' }));
      }
    });
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    setHistory([]);
  }

  // ── Save footprint handler ──────────────────────
  function handleSaveFootprint() {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setSaveStatus('saving');
    setSaveError(null);
    saveFootprint(user.id, data).then(({ data: d, error }) => {
      if (d && !error) {
        setSaveStatus('saved');
        setHistory((prev) => [d.footprint, ...prev]);
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setSaveError(error ?? 'Save failed');
      }
    });
  }

  const chartData = [
    { name: 'Transport', value: result.transportationCO2, fill: '#118865' },
    { name: 'Electricity', value: result.electricityCO2, fill: '#1594a1' },
    { name: 'Food', value: result.foodCO2, fill: '#e0932a' },
    { name: 'Waste', value: result.wasteCO2, fill: '#8b6fc0' },
    { name: 'Travel', value: result.travelCO2, fill: '#d65b5b' },
  ];

  const categoryIcons: Record<string, typeof Car> = {
    Transportation: Car,
    Electricity: Home,
    Food: Utensils,
    Waste: Recycle,
    'Air Travel': Plane,
  };

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 800;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * ecoScore));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [ecoScore]);

  return (
    <div className="calc-page">
      <div className="calc-hero dashboard-hero">
        <div className="container">
          <div className="calc-hero-inner">
            <p className="section-eyebrow">
              <span />
              Dashboard
            </p>
            <h1 className="calc-title">
              Good morning, {greetingName}
            </h1>
            <p className="calc-intro">
              Here's your sustainability overview.
            </p>
          </div>
        </div>
      </div>

      <div className="container calc-body">
        {/* Metric cards row */}
        <div className="dashboard-metrics">
          {/* Annual footprint */}
          <div className="dash-metric-card dash-metric-primary">
            <div className="dash-metric-icon">
              <Globe size={24} />
            </div>
            <p className="dash-metric-label">Estimated Annual Footprint</p>
            <div className="dash-metric-value">
              {result.totalCO2.toFixed(2)}
              <small>tonnes CO₂e / yr</small>
            </div>
          </div>

          {/* Eco Score */}
          <div className="dash-metric-card">
            <div className="dash-metric-icon dash-metric-icon-score" style={{ background: `${scoreBand.color}15`, color: scoreBand.color }}>
              <Gauge size={24} />
            </div>
            <p className="dash-metric-label">Eco Score</p>
            <div className="dash-metric-value">
              <span style={{ color: scoreBand.color }}>{animatedScore}</span>
              <small>/ 100 · {scoreBand.label}</small>
            </div>
          </div>

          {/* Change from previous */}
          <div className="dash-metric-card">
            <div className="dash-metric-icon">
              {change !== null && change < 0 ? <TrendingDown size={24} /> : change !== null && change > 0 ? <TrendingUp size={24} /> : <Minus size={24} />}
            </div>
            <p className="dash-metric-label">Change from Previous</p>
            <div className="dash-metric-value">
              {change !== null ? (
                <>
                  {change > 0 ? '+' : ''}{change.toFixed(2)}
                  <small>tonnes CO₂e</small>
                </>
              ) : (
                <>
                  —
                  <small>first calculation</small>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Chart + Insight */}
        <div className="dashboard-chart-row">
          <div className="dash-card dash-chart-card">
            <h2 className="results-card-title">Carbon Breakdown</h2>
            <p className="results-card-subtitle">Emissions by category (tonnes CO₂e/yr)</p>
            <div className="dash-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 16, right: 12, left: -16, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
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
                    cursor={{ fill: '#f0f5f2' }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #d9e9e1',
                      fontSize: '12px',
                      fontFamily: 'DM Sans',
                      boxShadow: '0 8px 20px rgba(20,78,48,.08)',
                    }}
                    formatter={(value) => [`${Number(value).toFixed(2)} t CO₂e`, 'Emissions']}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                    {chartData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dash-card dash-insight-card">
            <div className="dash-insight-icon">
              <Lightbulb size={22} />
            </div>
            <h2 className="results-card-title">Key Insight</h2>
            <p className="dash-insight-text">{insight.text}</p>
            <div className="dash-insight-pct">
              <span className="dash-insight-pct-number">{insight.percentage}%</span>
              <span className="dash-insight-pct-label">of your total emissions</span>
            </div>
          </div>
        </div>

        {/* Sustainability summary cards */}
        <div className="dashboard-summary-row">
          <h2 className="dashboard-section-title">Sustainability Summary</h2>
          <div className="dashboard-summary-grid">
            <div className="dash-summary-card">
              <div className="dash-summary-icon" style={{ background: '#fef3f0', color: '#d4562f' }}>
                <TrendingUp size={20} />
              </div>
              <small>Highest Emission Category</small>
              <strong>{highest.name}</strong>
              <span>{highest.value.toFixed(2)} t CO₂e</span>
            </div>
            <div className="dash-summary-card">
              <div className="dash-summary-icon" style={{ background: '#eaf7ed', color: '#118865' }}>
                <TrendingDown size={20} />
              </div>
              <small>Lowest Emission Category</small>
              <strong>{lowest.name}</strong>
              <span>{lowest.value.toFixed(2)} t CO₂e</span>
            </div>
            <div className="dash-summary-card">
              <div className="dash-summary-icon" style={{ background: '#eaf5f5', color: '#1594a1' }}>
                <Globe size={20} />
              </div>
              <small>Total Estimated CO₂e</small>
              <strong>{result.totalCO2.toFixed(2)} t</strong>
              <span>per year</span>
            </div>
            <div className="dash-summary-card">
              <div className="dash-summary-icon" style={{ background: `${scoreBand.color}15`, color: scoreBand.color }}>
                <Gauge size={20} />
              </div>
              <small>Eco Score</small>
              <strong style={{ color: scoreBand.color }}>{ecoScore} / 100</strong>
              <span>{scoreBand.label}</span>
            </div>
          </div>
        </div>

        {/* Category pie chart */}
        <div className="dashboard-pie-row">
          <div className="dash-card dash-pie-card">
            <h2 className="results-card-title">Emission Distribution</h2>
            <p className="results-card-subtitle">Percentage contribution by category</p>
            <div className="dash-pie-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={88}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {chartData.map((entry, idx) => (
                      <Cell key={`pie-cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #d9e9e1',
                      fontSize: '12px',
                      fontFamily: 'DM Sans',
                      boxShadow: '0 8px 20px rgba(20,78,48,.08)',
                    }}
                    formatter={(value, _name, item) => {
                      const v = Number(value);
                      const total = result.totalCO2;
                      const p = total > 0 ? ((v / total) * 100).toFixed(1) : '0';
                      const name = (item as { payload?: { name?: string } })?.payload?.name ?? '';
                      return [`${v.toFixed(2)} t (${p}%)`, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="dash-pie-center-label">
              <strong>{result.totalCO2.toFixed(1)}</strong>
              <small>t CO₂e</small>
            </div>
          </div>

          <div className="dash-card dash-legend-card">
            <h2 className="results-card-title">Category Details</h2>
            <p className="results-card-subtitle">Breakdown of your emissions</p>
            <div className="dash-legend-list">
              {chartData.map((item) => {
                const Icon = categoryIcons[item.name === 'Transport' ? 'Transportation' : item.name === 'Travel' ? 'Air Travel' : item.name] ?? Leaf;
                const pctVal = item.name === 'Transport' ? result.categoryPercentages.transportation
                  : item.name === 'Electricity' ? result.categoryPercentages.electricity
                  : item.name === 'Food' ? result.categoryPercentages.food
                  : item.name === 'Waste' ? result.categoryPercentages.waste
                  : result.categoryPercentages.travel;
                return (
                  <div className="dash-legend-item" key={item.name}>
                    <span className="dash-legend-icon" style={{ background: `${item.fill}15`, color: item.fill }}>
                      <Icon size={16} />
                    </span>
                    <span className="dash-legend-name">{item.name}</span>
                    <span className="dash-legend-value">{item.value.toFixed(2)} t</span>
                    <span className="dash-legend-pct">{pctVal}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="dashboard-actions-row">
          <button type="button" className="button" onClick={() => onNavigate('calculator')}>
            <Leaf size={16} /> Recalculate
          </button>
          <button
            type="button"
            className={`button ${saveStatus === 'saved' ? 'button-saved' : 'button-ghost'}`}
            onClick={handleSaveFootprint}
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <><Loader2 size={16} className="spin" /> Saving...</>
            ) : saveStatus === 'saved' ? (
              <><Check size={16} /> Saved!</>
            ) : saveStatus === 'error' ? (
              <><X size={16} /> Save Failed</>
            ) : (
              <><Save size={16} /> {user ? 'Save Calculation' : 'Sign In to Save'}</>
            )}
          </button>
          <button type="button" className="button button-ghost" onClick={() => recSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            <Lightbulb size={16} /> View Recommendations
          </button>
          <button type="button" className="button button-ghost" onClick={() => onNavigate('progress')}>
            <TrendingUp size={16} /> View Progress
          </button>
          {user ? (
            <button type="button" className="button button-ghost dash-logout-btn" onClick={handleLogout}>
              <LogOut size={16} /> Sign Out
            </button>
          ) : (
            <button type="button" className="button button-ghost" onClick={() => setAuthOpen(true)}>
              <LogIn size={16} /> Sign In
            </button>
          )}
        </div>

        {/* Footprint History */}
        {user && history.length > 0 && (
          <section className="dashboard-history-section">
            <h2 className="dashboard-section-title">Your Footprint History</h2>
            <div className="dashboard-history-list">
              {history.map((rec) => (
                <div className="history-item" key={rec.id}>
                  <div className="history-item-icon">
                    <Clock size={18} />
                  </div>
                  <div className="history-item-info">
                    <span className="history-item-total">{rec.total_co2.toFixed(2)} t CO₂e</span>
                    <span className="history-item-date">
                      {rec.created_at ? new Date(rec.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </span>
                  </div>
                  <div className="history-item-score" style={{ color: rec.eco_score >= 70 ? '#118865' : rec.eco_score >= 50 ? '#e0932a' : '#d4562f' }}>
                    {rec.eco_score}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ML Prediction Comparison */}
        <section className="dashboard-ml-section">
          <div className="dashboard-ml-header">
            <div className="dashboard-ml-header-left">
              <div className="dashboard-ml-bot-icon">
                <Brain size={24} />
              </div>
              <div>
                <h2 className="dashboard-section-title">ML-Based Estimate</h2>
                <p className="dashboard-recs-headline">
                  A Random Forest regression model predicts your footprint from lifestyle patterns.
                </p>
              </div>
            </div>
            <span className="dashboard-recs-badge">Machine Learning</span>
          </div>

          <div className="dashboard-ml-grid">
            {/* ML Prediction card */}
            <div className="dash-card dash-ml-card">
              <div className="dash-ml-card-top">
                <div className="dash-ml-icon">
                  <Brain size={20} />
                </div>
                <span className="dash-ml-tag">ML-Based Estimate</span>
              </div>
              {mlLoading ? (
                <div className="dash-ml-loading">
                  <Loader2 size={28} className="spin" />
                  <span>Predicting with ML model...</span>
                </div>
              ) : mlError ? (
                <div className="dash-ml-error">
                  <Zap size={20} />
                  <span>{mlError}</span>
                </div>
              ) : mlPrediction ? (
                <>
                  <div className="dash-ml-value">
                    {mlPrediction.predictedCO2.toFixed(2)}
                    <small>tonnes CO₂e / yr</small>
                  </div>
                  <div className="dash-ml-meta">
                    <span>Model: <strong>{mlPrediction.modelName}</strong></span>
                    <span>R²: <strong>{mlPrediction.r2.toFixed(3)}</strong></span>
                    <span>MAE: <strong>{mlPrediction.mae.toFixed(3)} t</strong></span>
                  </div>
                </>
              ) : null}
            </div>

            {/* Comparison card */}
            <div className="dash-card dash-ml-compare-card">
              <div className="dash-ml-card-top">
                <div className="dash-ml-icon dash-ml-icon-calc">
                  <Globe size={20} />
                </div>
                <span className="dash-ml-tag">Calculator-Based Estimate</span>
              </div>
              <div className="dash-ml-value">
                {result.totalCO2.toFixed(2)}
                <small>tonnes CO₂e / yr</small>
              </div>
              {mlDiff !== null && mlPrediction ? (
                <div className="dash-ml-comparison">
                  <div className="dash-ml-diff">
                    {mlDiff > 0 ? (
                      <><TrendingUp size={16} /> ML predicts {mlDiff.toFixed(2)} t more</>
                    ) : mlDiff < 0 ? (
                      <><TrendingDown size={16} /> ML predicts {Math.abs(mlDiff).toFixed(2)} t less</>
                    ) : (
                      <><Minus size={16} /> Both estimates match</>
                    )}
                  </div>
                  {mlDiffPct !== null && (
                    <div className="dash-ml-diff-pct">
                      Difference: {mlDiffPct.toFixed(1)}% {mlDiffPct < 10 ? '(close agreement)' : '(moderate divergence)'}
                    </div>
                  )}
                  <p className="dash-ml-explanation">
                    The calculator uses fixed emission factors; the ML model learns patterns from a
                    {mlPrediction ? ` ${mlPrediction.modelName}` : ''} trained on 5,000 lifestyle profiles.
                    Close agreement increases confidence; divergence highlights where lifestyle patterns
                    differ from average profiles.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="dashboard-recs-disclaimer">
            <Sprout size={16} />
            <p>The ML model is a Random Forest regressor trained on a synthetic dataset derived from established emission factors (DEFRA 2023, IEA, EPA, Poore &amp; Nemecek 2018) with 5% noise. It achieves R² = {mlPrediction?.r2.toFixed(3) ?? '0.93'} and MAE = {mlPrediction?.mae.toFixed(3) ?? '0.33'} t CO₂e. This is a real ML model — not a rule-based system. However, the training data is synthetic, so predictions approximate the calculator rather than capturing real-world variability.</p>
          </div>
        </section>

        {/* AI Sustainability Insights */}
        <section className="dashboard-recs-section" ref={recSectionRef}>
          <div className="dashboard-recs-header">
            <div className="dashboard-recs-header-left">
              <div className="dashboard-recs-bot-icon">
                <Lightbulb size={24} />
              </div>
              <div>
                <h2 className="dashboard-section-title">Your Sustainability Insights</h2>
                <p className="dashboard-recs-headline">{recHeadline}</p>
              </div>
            </div>
            <span className="dashboard-recs-badge">Rule-Based Analysis</span>
          </div>

          <div className="dashboard-recs-grid">
            {recommendations.map((rec, idx) => (
              <RecommendationCard key={rec.id} recommendation={rec} index={idx} categoryIcons={categoryIcons} />
            ))}
          </div>

          <div className="dashboard-recs-disclaimer">
            <Sprout size={16} />
            <p>These recommendations are generated by a transparent rule-based engine that analyses your carbon breakdown and lifestyle inputs. This is not a machine-learning model — every recommendation follows a deterministic rule tied to your actual data.</p>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="dashboard-disclaimer">
          <Sprout size={18} />
          <p>Results are estimates based on the inputs and emission factors used by this application.</p>
        </div>
      </div>

      {/* Auth Modal */}
      {authOpen && (
        <div className="auth-overlay" onClick={() => setAuthOpen(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="auth-close" onClick={() => setAuthOpen(false)} aria-label="Close">
              <X size={20} />
            </button>
            <div className="auth-modal-header">
              <div className="auth-modal-icon">
                <UserIcon size={24} />
              </div>
              <h2 className="auth-modal-title">
                {authForm.mode === 'register' ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="auth-modal-subtitle">
                {authForm.mode === 'register'
                  ? 'Save your calculations and track progress over time.'
                  : 'Welcome back! Sign in to view your saved history.'}
              </p>
            </div>
            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authForm.mode === 'register' && (
                <div className="auth-field">
                  <label htmlFor="auth-name">Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    value={authForm.name}
                    onChange={(e) => setAuthForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                  />
                </div>
              )}
              <div className="auth-field">
                <label htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="At least 6 characters"
                  required
                  autoComplete={authForm.mode === 'register' ? 'new-password' : 'current-password'}
                  minLength={6}
                />
              </div>
              {authForm.error && (
                <p className="auth-error">{authForm.error}</p>
              )}
              <button type="submit" className="button auth-submit" disabled={authForm.loading}>
                {authForm.loading ? (
                  <><Loader2 size={16} className="spin" /> Please wait...</>
                ) : authForm.mode === 'register' ? (
                  <><UserIcon size={16} /> Create Account</>
                ) : (
                  <><LogIn size={16} /> Sign In</>
                )}
              </button>
            </form>
            <button
              type="button"
              className="auth-toggle"
              onClick={() => setAuthForm((p) => ({
                ...p,
                mode: p.mode === 'login' ? 'register' : 'login',
                error: null,
              }))}
            >
              {authForm.mode === 'register'
                ? 'Already have an account? Sign in'
                : "Don't have an account? Register"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const priorityStyles: Record<Priority, { bg: string; color: string; label: string }> = {
  High: { bg: '#fef3f0', color: '#d4562f', label: 'High' },
  Medium: { bg: '#fff8ec', color: '#e0932a', label: 'Medium' },
  Low: { bg: '#eaf7ed', color: '#118865', label: 'Low' },
};

interface RecommendationCardProps {
  recommendation: import('@/services/recommendationEngine').Recommendation;
  index: number;
  categoryIcons: Record<string, typeof Car>;
}

function RecommendationCard({ recommendation: rec, index, categoryIcons }: RecommendationCardProps) {
  const Icon = categoryIcons[rec.category] ?? Leaf;
  const ps = priorityStyles[rec.priority];

  return (
    <article className="rec-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="rec-card-top">
        <div className="rec-card-icon">
          <Icon size={20} />
        </div>
        <span className="rec-priority-badge" style={{ background: ps.bg, color: ps.color }}>
          {ps.label} Priority
        </span>
      </div>
      <h3 className="rec-card-title">{rec.title}</h3>
      <p className="rec-card-explanation">{rec.explanation}</p>
      <div className="rec-card-action">
        <Leaf size={14} />
        <span>{rec.action}</span>
      </div>
      {rec.estimatedImpact !== null && (
        <div className="rec-card-impact">
          <TrendingDown size={15} />
          <span>Est. potential saving: <strong>{rec.estimatedImpact.toFixed(2)} t CO₂e/yr</strong></span>
        </div>
      )}
    </article>
  );
}
