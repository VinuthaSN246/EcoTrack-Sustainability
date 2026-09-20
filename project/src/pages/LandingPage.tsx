import {
  ArrowRight,
  BarChart3,
  CarFront,
  Check,
  ChevronDown,
  CircleCheck,
  Factory,
  Leaf,
  MessageCircle,
  Recycle,
  Sparkles,
  Sprout,
  Trash2,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    eyebrow: '01 / Calculate',
    title: 'See your footprint clearly',
    description:
      'Estimate the impact of everyday choices with a simple, thoughtful experience built around your lifestyle.',
    className: 'feature-card-mint',
  },
  {
    icon: Sparkles,
    eyebrow: '02 / Understand',
    title: 'Find what matters most',
    description:
      'Understand the moments that shape your footprint, so your next sustainable choice feels more achievable.',
    className: 'feature-card-sky',
  },
  {
    icon: Sprout,
    eyebrow: '03 / Improve',
    title: 'Make progress that lasts',
    description:
      'Get practical ideas tailored to your routines and build momentum one small change at a time.',
    className: 'feature-card-cream',
  },
];

const steps = [
  'Tell us about your everyday habits',
  'See your estimated carbon footprint',
  'Get ideas made for your lifestyle',
  'Keep growing your positive impact',
];



function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <div className="section-heading">
      <p className="section-eyebrow">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
}

export function LandingPage({ onNavigate }: { onNavigate: (page: 'calculator') => void }) {
  return (
    <div className="site-shell" id="top">
      <main>
        <section className="hero container">
          <div className="hero-copy">
            <div className="pill">
              <span className="pulse-dot" /> AI FOR A SUSTAINABLE FUTURE
            </div>
            <h1>
              Small choices.
              <br />
              <em>Big impact.</em>
            </h1>
            <p className="hero-description">
              Understand your carbon footprint, discover where your impact comes from, and get personalized ideas to live more sustainably.
            </p>
            <div className="hero-actions">
              <button type="button" className="button" onClick={() => onNavigate('calculator')}>
                Calculate My Footprint <ArrowRight size={17} />
              </button>
              <a href="#how-it-works" className="button button-ghost">
                Learn how it works <ChevronDown size={16} />
              </a>
            </div>
            <div className="hero-note">
              <CircleCheck size={16} /> No judgment. Just better next steps.
            </div>
          </div>

          <div className="hero-illustration">
            <img
              src="/hero-sustainability.png"
              alt="Eco sustainability globe illustration"
              width={580}
              height={387}
              loading="eager"
            />
          </div>
        </section>

        <section className="stats-strip container" aria-label="EcoTrack impact highlights">
          <div className="stat-item">
            <strong>01</strong>
            <span>
              <b>Carbon awareness</b>
              <small>starts with clarity</small>
            </span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <strong>02</strong>
            <span>
              <b>Sustainable choices</b>
              <small>become easier to see</small>
            </span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <strong>03</strong>
            <span>
              <b>Personal insights</b>
              <small>make change feel possible</small>
            </span>
          </div>
        </section>

        <section className="section container" id="features">
          <SectionHeading
            eyebrow="A clearer way forward"
            title={
              <>
                A better relationship
                <br />
                <em>with your impact.</em>
              </>
            }
            description="Sustainability is not about perfection. It is about knowing where to begin, and having the right support to keep going."
          />
          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className={`feature-card ${feature.className}`} key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={22} />
                  </div>
                  <p className="card-eyebrow">{feature.eyebrow}</p>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button type="button" className="card-link" onClick={() => onNavigate('calculator')}>
                    Explore <ArrowRight size={15} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="container how-grid">
            <div className="how-copy">
              <SectionHeading
                eyebrow="How it works"
                title={
                  <>
                    Make room for
                    <br />
                    <em>better habits.</em>
                  </>
                }
                description="A simple starting point for a more considered way of living. No spreadsheets, no overwhelm, just useful insight."
              />
              <button type="button" className="text-link section-link" onClick={() => onNavigate('calculator')}>
                See how it starts <ArrowRight size={15} />
              </button>
            </div>
            <div className="steps-list">
              {steps.map((step, index) => (
                <div className="step" key={step}>
                  <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
                  <p>{step}</p>
                  <Check className="step-check" size={17} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="about-section container" id="about">
          <div className="about-card">
            <div className="about-icon">
              <MessageCircle size={22} />
            </div>
            <p className="section-eyebrow">
              <span />
              Why EcoTrack
            </p>
            <h2>
              Progress feels better
              <br />
              <em>when it is personal.</em>
            </h2>
            <p>
              EcoTrack turns everyday data into a little more direction, helping you make choices that feel good for your life and lighter on the planet.
            </p>
            <div className="about-signature">
              <span className="signature-line" />
              Thoughtfully designed for real life
            </div>
          </div>
          <div className="about-aside">
            <div className="aside-orb">
              <Recycle size={29} />
            </div>
            <p>Every small shift is a signal that a more sustainable future is already being built.</p>
          </div>
        </section>

        <section className="cta-section container" id="start">
          <div className="cta-card">
            <div className="cta-leaf">
              <Leaf size={24} />
            </div>
            <p className="section-eyebrow">
              <span />
              Your next step
            </p>
            <h2>
              Ready to understand
              <br />
              <em>your impact?</em>
            </h2>
            <p>Start with curiosity. Leave with a clearer path forward.</p>
            <button type="button" className="button button-light" onClick={() => onNavigate('calculator')}>
              Start Your Eco Journey <ArrowRight size={17} />
            </button>
            <div className="cta-decoration decoration-one" />
            <div className="cta-decoration decoration-two" />
          </div>
        </section>
      </main>
    </div>
  );
}
