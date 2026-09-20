import { useEffect, useState } from 'react';
import {
  Bike,
  Car,
  Home,
  Leaf,
  Lightbulb,
  Loader2,
  Plane,
  Recycle,
  Sprout,
  TrendingDown,
  Utensils,
  Zap,
} from 'lucide-react';
import { loadSession, getLatestFootprint, type FootprintRecord } from '@/services/api';
import { generateRecommendationsFromFormData, type Recommendation, type Priority } from '@/services/recommendationEngine';
import type { FormData } from '@/types';

interface RecommendationsPageProps {
  formData: FormData | null;
  onNavigate: (page: 'home' | 'calculator' | 'dashboard' | 'progress') => void;
}

const priorityStyles: Record<Priority, { bg: string; color: string; border: string; label: string }> = {
  High:   { bg: '#fef3f0', color: '#d4562f', border: '#f4c4b5', label: 'High Priority' },
  Medium: { bg: '#fff8ec', color: '#e0932a', border: '#f3dba5', label: 'Medium Priority' },
  Low:    { bg: '#eaf7ed', color: '#118865', border: '#b5dfc7', label: 'Low Priority' },
};

const categoryIcons: Record<string, React.ElementType> = {
  Transportation: Car,
  Electricity:    Home,
  Food:           Utensils,
  Waste:          Recycle,
  Travel:         Plane,
};

const categoryColors: Record<string, { bg: string; color: string }> = {
  Transportation: { bg: '#eaf7ed', color: '#118865' },
  Electricity:    { bg: '#eaf5f5', color: '#1594a1' },
  Food:           { bg: '#fff8ec', color: '#e0932a' },
  Waste:          { bg: '#f2eff9', color: '#8b6fc0' },
  Travel:         { bg: '#fef3f0', color: '#d4562f' },
};

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const Icon = categoryIcons[rec.category] ?? Leaf;
  const ps = priorityStyles[rec.priority];
  const cc = categoryColors[rec.category] ?? { bg: '#eaf7ed', color: '#118865' };

  return (
    <article
      className="rec-card"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="rec-card-top">
        <div className="rec-card-icon" style={{ background: cc.bg, color: cc.color }}>
          <Icon size={20} />
        </div>
        <span
          className="rec-priority-badge"
          style={{ background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}
        >
          {ps.label}
        </span>
      </div>

      <div className="rec-category-tag" style={{ color: cc.color }}>
        {rec.category}
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
          <span>
            Est. potential saving: <strong>{rec.estimatedImpact.toFixed(2)} t CO₂e/yr</strong>
          </span>
        </div>
      )}
    </article>
  );
}

export function RecommendationsPage({ formData, onNavigate }: RecommendationsPageProps) {
  const [latestRecord, setLatestRecord] = useState<FootprintRecord | null>(null);
  const [dbLoading, setDbLoading] = useState(true);

  // Try to load latest saved footprint from the database for users who don't have local formData
  useEffect(() => {
    const user = loadSession();
    if (!user) {
      setDbLoading(false);
      return;
    }
    getLatestFootprint(user.id).then(({ data, error }) => {
      setDbLoading(false);
      if (data && !error && data.footprint) {
        setLatestRecord(data.footprint);
      }
    });
  }, []);

  // Build recommendations from formData (most accurate, direct from session)
  const recommendations = formData
    ? generateRecommendationsFromFormData(formData).recommendations
    : [];

  const headline = formData
    ? generateRecommendationsFromFormData(formData).headline
    : null;

  const isLoading = !formData && dbLoading;
  const hasNoData = !formData && !dbLoading;

  // Group recs by priority
  const highRecs   = recommendations.filter((r) => r.priority === 'High');
  const mediumRecs = recommendations.filter((r) => r.priority === 'Medium');
  const lowRecs    = recommendations.filter((r) => r.priority === 'Low');

  return (
    <div className="calc-page">
      {/* Hero */}
      <div className="calc-hero dashboard-hero">
        <div className="container">
          <div className="calc-hero-inner">
            <div className="pill">
              <span className="pulse-dot" />
              SUSTAINABILITY INSIGHTS
            </div>
            <h1 className="calc-title">
              Your <em>Recommendations</em>
            </h1>
            <p className="calc-intro">
              Personalised actions based on your carbon footprint breakdown.
            </p>
          </div>
        </div>
      </div>

      <div className="container calc-body">

        {/* Loading */}
        {isLoading && (
          <div className="progress-loading">
            <Loader2 size={32} className="spin" />
            <span>Loading your data…</span>
          </div>
        )}

        {/* No data — prompt to calculate */}
        {hasNoData && (
          <div className="progress-empty">
            <div className="progress-empty-icon">
              <Lightbulb size={32} />
            </div>
            <h2 className="progress-empty-title">No footprint data yet</h2>
            <p className="progress-empty-text">
              Complete the carbon footprint calculator to receive personalised sustainability recommendations tailored to your lifestyle.
            </p>
            <button
              type="button"
              className="button"
              onClick={() => onNavigate('calculator')}
            >
              <Leaf size={16} />
              Calculate My Footprint
            </button>
          </div>
        )}

        {/* Recommendations */}
        {formData && recommendations.length > 0 && (
          <>
            {/* AI Insights header */}
            <section className="dashboard-recs-section" style={{ marginBottom: 32 }}>
              <div className="dashboard-recs-header">
                <div className="dashboard-recs-header-left">
                  <div className="dashboard-recs-bot-icon">
                    <Lightbulb size={24} />
                  </div>
                  <div>
                    <h2 className="dashboard-section-title">🤖 Your Sustainability Insights</h2>
                    <p className="dashboard-recs-headline">{headline}</p>
                  </div>
                </div>
                <span className="dashboard-recs-badge">Rule-Based Analysis</span>
              </div>
            </section>

            {/* Summary chips */}
            <div className="recs-summary-row" style={{ marginBottom: 32 }}>
              {highRecs.length > 0 && (
                <div className="recs-summary-chip" style={{ background: '#fef3f0', color: '#d4562f', border: '1px solid #f4c4b5' }}>
                  <Zap size={14} />
                  {highRecs.length} High Priority
                </div>
              )}
              {mediumRecs.length > 0 && (
                <div className="recs-summary-chip" style={{ background: '#fff8ec', color: '#e0932a', border: '1px solid #f3dba5' }}>
                  <Bike size={14} />
                  {mediumRecs.length} Medium Priority
                </div>
              )}
              {lowRecs.length > 0 && (
                <div className="recs-summary-chip" style={{ background: '#eaf7ed', color: '#118865', border: '1px solid #b5dfc7' }}>
                  <Sprout size={14} />
                  {lowRecs.length} Low Priority
                </div>
              )}
            </div>

            {/* Cards grid */}
            <div className="dashboard-recs-grid" style={{ marginBottom: 32 }}>
              {recommendations.map((rec, idx) => (
                <RecommendationCard key={rec.id} rec={rec} index={idx} />
              ))}
            </div>

            {/* Transparency disclaimer */}
            <div className="dashboard-recs-disclaimer" style={{ marginBottom: 32 }}>
              <Sprout size={16} />
              <p>
                These recommendations are generated by a <strong>transparent, rule-based engine</strong> that analyses your carbon breakdown and lifestyle inputs. This is not a machine-learning model — every recommendation follows a deterministic rule tied to your actual data.
              </p>
            </div>

            {/* DB note if no record saved yet */}
            {!latestRecord && (
              <div className="dashboard-disclaimer" style={{ marginBottom: 16 }}>
                <Leaf size={18} />
                <p>Save your calculation to track your progress and see how your recommendations change over time.</p>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {!isLoading && (
          <div className="dashboard-actions-row">
            <button type="button" className="button" onClick={() => onNavigate('calculator')}>
              <Leaf size={16} /> {formData ? 'Recalculate' : 'Start Calculator'}
            </button>
            <button type="button" className="button button-ghost" onClick={() => onNavigate('dashboard')}>
              View Dashboard
            </button>
            <button type="button" className="button button-ghost" onClick={() => onNavigate('progress')}>
              View Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
