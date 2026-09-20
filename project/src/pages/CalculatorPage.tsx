import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  Home,
  Leaf,
  Plane,
  Recycle,
  Utensils,
} from 'lucide-react';
import type { FormData, FormErrors } from '@/types';
import { initialFormData } from '@/types';
import { OptionCard } from '@/components/ui/OptionCard';

type Page = 'home' | 'calculator' | 'results';

interface CalculatorProps {
  onComplete: (data: FormData) => void;
  onNavigate: (page: Page) => void;
}

const sections = [
  {
    id: 'transport',
    title: 'Transportation',
    icon: Car,
    description: 'How do you get around day to day?',
  },
  {
    id: 'electricity',
    title: 'Electricity',
    icon: Home,
    description: 'How does your home use energy?',
  },
  {
    id: 'food',
    title: 'Food',
    icon: Utensils,
    description: 'What does your diet look like?',
  },
  {
    id: 'waste',
    title: 'Waste',
    icon: Recycle,
    description: 'How much do you throw away?',
  },
  {
    id: 'flights',
    title: 'Air Travel',
    icon: Plane,
    description: 'How often do you fly?',
  },
];

const transportOptions = [
  'Car',
  'Motorcycle',
  'Bus',
  'Train',
  'Bicycle',
  'Walking',
  'Electric Vehicle',
];

const homeOptions = ['Apartment', 'Independent House', 'Other'];
const dietOptions = ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Mixed'];
const frequencyOptions = ['Rarely', 'Sometimes', 'Often'];
const recyclingOptions = ['Never', 'Sometimes', 'Often'];
const flightsOptions = ['0', '1-2', '3-5', '6+'];

function validateSection(step: number, data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (step === 0) {
    if (!data.transportType) errors.transportType = 'Please select your primary transportation.';
    if (!data.dailyDistance) errors.dailyDistance = 'Please enter your average daily distance.';
    else if (isNaN(Number(data.dailyDistance)) || Number(data.dailyDistance) < 0)
      errors.dailyDistance = 'Enter a valid number (0 or more).';
    if (!data.travelDays) errors.travelDays = 'Please enter your travel days per week.';
    else if (isNaN(Number(data.travelDays)) || Number(data.travelDays) < 0 || Number(data.travelDays) > 7)
      errors.travelDays = 'Enter a number between 0 and 7.';
  }

  if (step === 1) {
    if (!data.electricity) errors.electricity = 'Please enter your monthly electricity usage.';
    else if (isNaN(Number(data.electricity)) || Number(data.electricity) < 0)
      errors.electricity = 'Enter a valid number (0 or more).';
    if (!data.homeType) errors.homeType = 'Please select your home type.';
  }

  if (step === 2) {
    if (!data.dietType) errors.dietType = 'Please select your diet type.';
    if (!data.foodWaste) errors.foodWaste = 'Please select your food waste frequency.';
  }

  if (step === 3) {
    if (!data.wastePerWeek) errors.wastePerWeek = 'Please enter your weekly waste.';
    else if (isNaN(Number(data.wastePerWeek)) || Number(data.wastePerWeek) < 0)
      errors.wastePerWeek = 'Enter a valid number (0 or more).';
    if (!data.recycling) errors.recycling = 'Please select your recycling habit.';
  }

  if (step === 4) {
    if (!data.flightsPerYear) errors.flightsPerYear = 'Please select your flight frequency.';
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

export function CalculatorPage({ onComplete, onNavigate }: CalculatorProps) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState(false);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (touched) {
      setErrors(validateSection(step, { ...data, [key]: value }));
    }
  };

  const handleNext = () => {
    const sectionErrors = validateSection(step, data);
    setErrors(sectionErrors);
    setTouched(true);
    if (Object.keys(sectionErrors).length === 0) {
      setTouched(false);
      if (step < sections.length - 1) {
        setStep(step + 1);
      }
    }
  };

  const handlePrev = () => {
    setTouched(false);
    setErrors({});
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    const sectionErrors = validateSection(step, data);
    setErrors(sectionErrors);
    setTouched(true);
    if (Object.keys(sectionErrors).length === 0) {
      onComplete(data);
    }
  };

  const current = sections[step];
  const CurrentIcon = current.icon;
  const progress = ((step + 1) / sections.length) * 100;

  return (
    <div className="calc-page">
      <div className="calc-hero">
        <div className="container">
          <div className="calc-hero-inner">
            <p className="section-eyebrow">
              <span />
              Carbon Footprint Calculator
            </p>
            <h1 className="calc-title">
              Calculate Your<br />
              <em>Carbon Footprint</em>
            </h1>
            <p className="calc-intro">
              Tell us about your everyday activities. We'll estimate your environmental impact.
            </p>
          </div>
        </div>
      </div>

      <div className="container calc-body">
        <div className="calc-layout">
          {/* Progress sidebar */}
          <aside className="calc-sidebar">
            <div className="progress-header">
              <span className="progress-label">Progress</span>
              <span className="progress-count">
                Step {step + 1} of {sections.length}
              </span>
            </div>
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <ul className="step-nav">
              {sections.map((s, i) => {
                const StepIcon = s.icon;
                const isComplete = i < step;
                const isCurrent = i === step;
                return (
                  <li
                    key={s.id}
                    className={`step-nav-item ${isCurrent ? 'step-nav-current' : ''} ${isComplete ? 'step-nav-complete' : ''}`}
                  >
                    <span className="step-nav-icon">
                      {isComplete ? <Check size={15} /> : <StepIcon size={16} />}
                    </span>
                    <span className="step-nav-text">
                      <small>{String(i + 1).padStart(2, '0')}</small>
                      {s.title}
                    </span>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Form panel */}
          <div className="calc-form-panel">
            <div className="form-section-header">
              <div className="form-section-icon">
                <CurrentIcon size={22} />
              </div>
              <div>
                <h2 className="form-section-title">{current.title}</h2>
                <p className="form-section-desc">{current.description}</p>
              </div>
            </div>

            {/* Section 1: Transportation */}
            {step === 0 && (
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Primary transportation type</label>
                  <p className="field-help">What do you use most often to get around?</p>
                  <div className="option-grid">
                    {transportOptions.map((opt) => (
                      <OptionCard
                        key={opt}
                        label={opt}
                        selected={data.transportType === opt}
                        onClick={() => update('transportType', opt as FormData['transportType'])}
                      />
                    ))}
                  </div>
                  <FieldError message={errors.transportType} />
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label className="field-label">Average distance per day (km)</label>
                    <p className="field-help">How far do you typically travel in a day?</p>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className={`field-input ${errors.dailyDistance ? 'input-error' : ''}`}
                      placeholder="e.g. 15"
                      value={data.dailyDistance}
                      onChange={(e) => update('dailyDistance', e.target.value)}
                    />
                    <FieldError message={errors.dailyDistance} />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Travel days per week</label>
                    <p className="field-help">How many days do you use this transport?</p>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      step="1"
                      className={`field-input ${errors.travelDays ? 'input-error' : ''}`}
                      placeholder="e.g. 5"
                      value={data.travelDays}
                      onChange={(e) => update('travelDays', e.target.value)}
                    />
                    <FieldError message={errors.travelDays} />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Electricity */}
            {step === 1 && (
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Monthly electricity consumption (kWh)</label>
                  <p className="field-help">Check your electric bill for this number.</p>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className={`field-input ${errors.electricity ? 'input-error' : ''}`}
                    placeholder="e.g. 300"
                    value={data.electricity}
                    onChange={(e) => update('electricity', e.target.value)}
                  />
                  <FieldError message={errors.electricity} />
                </div>

                <div className="field-group">
                  <label className="field-label">Home type</label>
                  <p className="field-help">What kind of home do you live in?</p>
                  <div className="option-grid option-grid-3">
                    {homeOptions.map((opt) => (
                      <OptionCard
                        key={opt}
                        label={opt}
                        selected={data.homeType === opt}
                        onClick={() => update('homeType', opt as FormData['homeType'])}
                      />
                    ))}
                  </div>
                  <FieldError message={errors.homeType} />
                </div>
              </div>
            )}

            {/* Section 3: Food */}
            {step === 2 && (
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Diet type</label>
                  <p className="field-help">What does your typical diet look like?</p>
                  <div className="option-grid option-grid-4">
                    {dietOptions.map((opt) => (
                      <OptionCard
                        key={opt}
                        label={opt}
                        selected={data.dietType === opt}
                        onClick={() => update('dietType', opt as FormData['dietType'])}
                      />
                    ))}
                  </div>
                  <FieldError message={errors.dietType} />
                </div>

                <div className="field-group">
                  <label className="field-label">Food waste frequency</label>
                  <p className="field-help">How often do you throw away uneaten food?</p>
                  <div className="option-grid option-grid-3">
                    {frequencyOptions.map((opt) => (
                      <OptionCard
                        key={opt}
                        label={opt}
                        selected={data.foodWaste === opt}
                        onClick={() => update('foodWaste', opt as FormData['foodWaste'])}
                      />
                    ))}
                  </div>
                  <FieldError message={errors.foodWaste} />
                </div>
              </div>
            )}

            {/* Section 4: Waste */}
            {step === 3 && (
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Estimated waste per week (kg)</label>
                  <p className="field-help">A typical household produces 5–15 kg per week.</p>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className={`field-input ${errors.wastePerWeek ? 'input-error' : ''}`}
                    placeholder="e.g. 8"
                    value={data.wastePerWeek}
                    onChange={(e) => update('wastePerWeek', e.target.value)}
                  />
                  <FieldError message={errors.wastePerWeek} />
                </div>

                <div className="field-group">
                  <label className="field-label">Recycling habit</label>
                  <p className="field-help">How often do you recycle your waste?</p>
                  <div className="option-grid option-grid-3">
                    {recyclingOptions.map((opt) => (
                      <OptionCard
                        key={opt}
                        label={opt}
                        selected={data.recycling === opt}
                        onClick={() => update('recycling', opt as FormData['recycling'])}
                      />
                    ))}
                  </div>
                  <FieldError message={errors.recycling} />
                </div>
              </div>
            )}

            {/* Section 5: Air Travel */}
            {step === 4 && (
              <div className="form-fields">
                <div className="field-group">
                  <label className="field-label">Flights per year</label>
                  <p className="field-help">How many round-trip flights do you take in a year?</p>
                  <div className="option-grid option-grid-4">
                    {flightsOptions.map((opt) => (
                      <OptionCard
                        key={opt}
                        label={opt === '0' ? 'None' : opt}
                        selected={data.flightsPerYear === opt}
                        onClick={() => update('flightsPerYear', opt as FormData['flightsPerYear'])}
                      />
                    ))}
                  </div>
                  <FieldError message={errors.flightsPerYear} />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="form-nav">
              <button
                type="button"
                className="button button-ghost"
                onClick={handlePrev}
                disabled={step === 0}
              >
                <ArrowLeft size={16} /> Previous
              </button>
              {step < sections.length - 1 ? (
                <button type="button" className="button" onClick={handleNext}>
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" className="button" onClick={handleSubmit}>
                  <Leaf size={16} /> Calculate My Footprint
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
