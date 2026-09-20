import {
  ArrowRight,
  Car,
  Home,
  Info,
  Leaf,
  Plane,
  Recycle,
  Sparkles,
  Sprout,
  TrendingDown,
  Utensils,
  Zap,
} from 'lucide-react';
import type { FormData } from '@/types';
import { calculateFromFormData } from '@/services/carbonCalculator';
import {
  CALCULATION_DISCLAIMER,
  categoryMetadata,
  globalAveragePerCapita,
} from '@/data/emissionFactors';

interface ResultsPageProps {
  data: FormData;
  onNavigate: (page: 'home' | 'calculator') => void;
  onGoDashboard: () => void;
}

export function ResultsPage({ data, onNavigate, onGoDashboard }: ResultsPageProps) {
  const result = calculateFromFormData(data);

  // 5 distinct categories as requested
  const categoryCards = [
    {
      id: 'transportation',
      label: 'Transportation',
      icon: Car,
      value: result.transportationCO2,
      pct: result.categoryPercentages.transportation,
      color: '#118865',
      bgColor: '#eaf7ed',
      subtext: `${data.transportType || 'Transit'} • ${data.dailyDistance || '0'} km/day (${data.travelDays || '0'} d/wk)`,
      source: categoryMetadata.transportation.source,
    },
    {
      id: 'electricity',
      label: 'Electricity',
      icon: Zap,
      value: result.electricityCO2,
      pct: result.categoryPercentages.electricity,
      color: '#1594a1',
      bgColor: '#e6f7f9',
      subtext: `${data.electricity || '0'} kWh/mo • ${data.homeType || 'Household'}`,
      source: categoryMetadata.electricity.source,
    },
    {
      id: 'food',
      label: 'Food',
      icon: Utensils,
      value: result.foodCO2,
      pct: result.categoryPercentages.food,
      color: '#e0932a',
      bgColor: '#fdf4e7',
      subtext: `${data.dietType || 'Diet'} • Waste: ${data.foodWaste || 'Average'}`,
      source: categoryMetadata.food.source,
    },
    {
      id: 'waste',
      label: 'Waste',
      icon: Recycle,
      value: result.wasteCO2,
      pct: result.categoryPercentages.waste,
      color: '#8b6fc0',
      bgColor: '#f2eff9',
      subtext: `${data.wastePerWeek || '0'} kg/wk • Recycling: ${data.recycling || 'None'}`,
      source: categoryMetadata.waste.source,
    },
    {
      id: 'travel',
      label: 'Travel',
      icon: Plane,
      value: result.travelCO2,
      pct: result.categoryPercentages.travel,
      color: '#d65b5b',
      bgColor: '#fdf0f0',
      subtext: `${data.flightsPerYear === '0' ? 'No flights' : `${data.flightsPerYear || '0'} flights/yr`}`,
      source: categoryMetadata.travel.source,
    },
  ];

  const maxVal = Math.max(...categoryCards.map((c) => c.value), 0.01);
  const avgGlobal = globalAveragePerCapita;
  const diffFromGlobal = result.totalCO2 > 0 ? ((result.totalCO2 - avgGlobal) / avgGlobal) * 100 : 0;

  return (
    <div className="calc-page">
      {/* Hero title */}
      <div className="calc-hero">
        <div className="container">
          <div className="calc-hero-inner">
            <p className="section-eyebrow">
              <span />
              Calculation Results
            </p>
            <h1 className="calc-title">
              Your Estimated<br />
              <em>Carbon Footprint</em>
            </h1>
            <p className="calc-intro">
              Based on your everyday habits, here is your estimated greenhouse gas impact across key lifestyle areas.
            </p>
          </div>
        </div>
      </div>

      <div className="container calc-body">
        <div className="results-layout">
          {/* 1. Large Total Value Card */}
          <section className="results-total-card" aria-label="Total estimated emissions">
            <div className="results-total-icon">
              <Leaf size={28} />
            </div>
            <p className="section-eyebrow results-eyebrow">
              <span />
              Your Estimated Carbon Footprint
            </p>
            <div className="results-total-number">
              {result.totalCO2.toFixed(1)}{' '}
              <small>tonnes CO₂e/year</small>
            </div>
            <div className="results-comparison">
              {diffFromGlobal > 0 ? (
                <span className="comparison-badge comparison-above">
                  <TrendingDown size={14} /> {diffFromGlobal.toFixed(0)}% above global average ({avgGlobal} t)
                </span>
              ) : diffFromGlobal < 0 ? (
                <span className="comparison-badge comparison-below">
                  <Sparkles size={14} /> {Math.abs(diffFromGlobal).toFixed(0)}% below global average ({avgGlobal} t)
                </span>
              ) : (
                <span className="comparison-badge comparison-equal">
                  <Leaf size={14} /> Right at the global per-capita average ({avgGlobal} t)
                </span>
              )}
            </div>
          </section>

          {/* 2. Then show cards: Transportation, Electricity, Food, Waste, Travel */}
          <section aria-label="Emissions by Category">
            <h2 className="results-card-title" style={{ marginBottom: 14 }}>
              Emissions by Category
            </h2>
            <div className="category-cards-grid">
              {categoryCards.map((card) => {
                const Icon = card.icon;
                const relativeWidth = (card.value / maxVal) * 100;
                return (
                  <article className="category-card" key={card.id}>
                    <div className="category-card-header">
                      <div
                        className="category-card-icon"
                        style={{ background: card.bgColor, color: card.color }}
                      >
                        <Icon size={19} />
                      </div>
                      <span
                        className="category-badge"
                        style={{ background: card.bgColor, color: card.color }}
                      >
                        {card.pct}%
                      </span>
                    </div>
                    <h3 className="category-card-title">{card.label}</h3>
                    <div className="category-card-value">
                      {card.value.toFixed(2)}
                      <small>tonnes CO₂e/year</small>
                    </div>
                    <p className="category-card-subtext">{card.subtext}</p>
                    <div className="category-card-bar">
                      <div
                        className="category-card-bar-fill"
                        style={{ width: `${relativeWidth}%`, background: card.color }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 3. Simple Visual Chart: Distribution Bar */}
          <section className="chart-card" aria-label="Footprint distribution breakdown">
            <h2 className="results-card-title">Footprint Distribution</h2>
            <p className="results-card-subtitle">
              Visual proportion of each category contributing to your total annual emissions
            </p>

            <div className="distribution-bar">
              {categoryCards.map((cat) => {
                if (result.totalCO2 <= 0) return null;
                const share = cat.pct;
                if (share <= 0) return null;
                return (
                  <div
                    key={cat.id}
                    className="distribution-segment"
                    style={{
                      width: `${share}%`,
                      background: cat.color,
                    }}
                    title={`${cat.label}: ${cat.value.toFixed(2)} tonnes (${share}%)`}
                  />
                );
              })}
            </div>

            <div className="chart-legend">
              {categoryCards.map((cat) => (
                <div className="legend-item" key={cat.id}>
                  <span className="legend-dot" style={{ background: cat.color }} />
                  <span>
                    <strong>{cat.label}:</strong> {cat.value.toFixed(2)} t ({cat.pct}%)
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Methodology & Disclaimer Card */}
          <div className="results-disclaimer-box" role="note">
            <Info size={20} />
            <div>
              <p>
                <strong>Disclaimer: </strong>
                {CALCULATION_DISCLAIMER}
              </p>
              <small>
                Calculations reference published greenhouse gas emission factors from UK DEFRA / BEIS (2023), International Energy Agency (IEA 2023), Poore & Nemecek (Science 2018), UNEP, and US EPA.
              </small>
            </div>
          </div>

          {/* 5. Lifestyle Snapshot Summary */}
          <section className="results-summary-card" aria-label="Lifestyle inputs summary">
            <h2 className="results-card-title">Lifestyle Snapshot</h2>
            <p className="results-card-subtitle">Summary of inputs used for this calculation</p>
            <div className="summary-grid">
              <div className="summary-item">
                <Car size={18} />
                <span>
                  <small>Daily Transport</small>
                  <strong>{data.transportType || '—'} ({data.dailyDistance || '0'} km)</strong>
                </span>
              </div>
              <div className="summary-item">
                <Zap size={18} />
                <span>
                  <small>Electricity</small>
                  <strong>{data.electricity || '—'} kWh/mo</strong>
                </span>
              </div>
              <div className="summary-item">
                <Home size={18} />
                <span>
                  <small>Home Type</small>
                  <strong>{data.homeType || '—'}</strong>
                </span>
              </div>
              <div className="summary-item">
                <Utensils size={18} />
                <span>
                  <small>Diet & Food Waste</small>
                  <strong>{data.dietType || '—'} (Waste: {data.foodWaste || '—'})</strong>
                </span>
              </div>
              <div className="summary-item">
                <Recycle size={18} />
                <span>
                  <small>Waste & Recycling</small>
                  <strong>{data.wastePerWeek || '0'} kg/wk ({data.recycling || '—'})</strong>
                </span>
              </div>
              <div className="summary-item">
                <Plane size={18} />
                <span>
                  <small>Annual Flights</small>
                  <strong>{data.flightsPerYear === '0' ? 'None' : data.flightsPerYear || '—'}</strong>
                </span>
              </div>
            </div>
          </section>

          {/* 6. Navigation Actions */}
          <div className="results-note-card">
            <div className="results-note-icon">
              <Sprout size={22} />
            </div>
            <div>
              <p className="results-note-text">
                Ready to track your progress over time or test different daily habits?
              </p>
              <div className="results-note-actions">
                <button type="button" className="button button-light" onClick={onGoDashboard}>
                  View Dashboard <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => onNavigate('calculator')}
                >
                  Recalculate
                </button>
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => onNavigate('home')}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
