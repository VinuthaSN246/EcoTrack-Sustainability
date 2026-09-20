import { useEffect, useState, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  Award,
  Bell,
  Bike,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Droplets,
  Edit3,
  Flame,
  Heart,
  Key,
  Leaf,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Recycle,
  Ruler,
  Save,
  Settings,
  Shield,
  Sprout,
  Star,
  Target,
  Trash2,
  TrendingDown,
  TreePine,
  Trophy,
  User,
  UserCheck,
  X,
  Zap,
} from 'lucide-react';
import {
  clearSession,
  getFootprints,
  getLatestFootprint,
  loadSession,
  type FootprintRecord,
  type User as UserType,
} from '@/services/api';
import { calculateEcoScore, getScoreBand } from '@/services/ecoScore';

/* ───────── Types ───────── */

interface ProfilePageProps {
  onNavigate: (page: 'home' | 'calculator' | 'dashboard' | 'progress' | 'recommendations') => void;
}

interface ProfileSettings {
  emailDigest: boolean;
  reductionReminders: boolean;
  darkMode: boolean;
  units: 'metric' | 'imperial';
}

interface ProfileInfo {
  fullName: string;
  email: string;
  location: string;
  status: string;
  tagline: string;
  avatarUrl: string;
}

interface ActivityItem {
  id: string;
  icon: typeof Leaf;
  text: string;
  date: string;
  iconBg: string;
  iconColor: string;
}

interface AchievementDef {
  id: string;
  icon: typeof Leaf;
  label: string;
  description: string;
  bg: string;
  color: string;
}

/* ───────── localStorage helpers ───────── */

const SETTINGS_KEY = 'ecotrack_profile_settings';
const PROFILE_KEY = 'ecotrack_profile_info';
const INTERESTS_KEY = 'ecotrack_interests';

function loadSettings(): ProfileSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw) as ProfileSettings;
  } catch { /* ignore */ }
  return { emailDigest: true, reductionReminders: true, darkMode: false, units: 'metric' };
}

function saveSettings(s: ProfileSettings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

function loadProfile(user: UserType | null): ProfileInfo {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as ProfileInfo;
  } catch { /* ignore */ }
  return {
    fullName: user?.name ?? '',
    email: user?.email ?? '',
    location: '',
    status: '',
    tagline: 'Learning, building and growing sustainably 🌱',
    avatarUrl: '',
  };
}

function saveProfile(p: ProfileInfo) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

function loadInterests(): string[] {
  try {
    const raw = localStorage.getItem(INTERESTS_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch { /* ignore */ }
  return [];
}

function saveInterests(i: string[]) {
  try { localStorage.setItem(INTERESTS_KEY, JSON.stringify(i)); } catch { /* ignore */ }
}

/* ───────── Achievement definitions ───────── */

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'first_footprint', icon: Sprout, label: 'First Footprint', description: 'Completed your first carbon footprint calculation.', bg: '#eaf7ed', color: '#118865' },
  { id: 'footprint_reducer', icon: TrendingDown, label: 'Footprint Reducer', description: 'Reduced your estimated footprint compared with a previous calculation.', bg: '#eaf5f5', color: '#1594a1' },
  { id: 'waste_warrior', icon: Recycle, label: 'Waste Warrior', description: 'Completed waste-related sustainability actions.', bg: '#f8f4e9', color: '#e0932a' },
  { id: 'green_traveler', icon: Bike, label: 'Green Traveler', description: 'Used or explored sustainable transportation options.', bg: '#edf3fb', color: '#4a7fc1' },
  { id: 'energy_saver', icon: Zap, label: 'Energy Saver', description: 'Improved your energy-saving habits.', bg: '#fef8ec', color: '#d4941f' },
];

/* ───────── Interest definitions ───────── */

const INTEREST_DEFS = [
  { id: 'climate_action', emoji: '🌱', label: 'Climate Action' },
  { id: 'energy', emoji: '⚡', label: 'Energy Conservation' },
  { id: 'waste', emoji: '♻️', label: 'Waste Reduction' },
  { id: 'transport', emoji: '🚲', label: 'Sustainable Transportation' },
  { id: 'water', emoji: '💧', label: 'Water Conservation' },
  { id: 'food', emoji: '🌾', label: 'Sustainable Food' },
];

/* ═══════════════════════════════════════════════════════
   ProfilePage Component
   ═══════════════════════════════════════════════════════ */

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  /* ── State ── */
  const [user, setUser] = useState<UserType | null>(() => loadSession());
  const [records, setRecords] = useState<FootprintRecord[]>([]);
  const [latestRecord, setLatestRecord] = useState<FootprintRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<ProfileSettings>(loadSettings);
  const [profile, setProfile] = useState<ProfileInfo>(() => loadProfile(user));
  const [interests, setInterests] = useState<string[]>(loadInterests);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProfileInfo>(profile);
  const [editErrors, setEditErrors] = useState<Partial<Record<keyof ProfileInfo, string>>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const editNameRef = useRef<HTMLInputElement>(null);

  /* ── Data loading ── */
  useEffect(() => {
    const u = loadSession();
    setUser(u);
    if (!u) { setLoading(false); return; }

    Promise.all([
      getFootprints(u.id),
      getLatestFootprint(u.id),
    ]).then(([allRes, latestRes]) => {
      setLoading(false);
      if (allRes.data && !allRes.error) setRecords(allRes.data.footprints);
      if (latestRes.data && !latestRes.error) setLatestRecord(latestRes.data.footprint);
    });
  }, []);

  /* Sync profile when user loads */
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  /* ── Derived data ── */
  const totalAssessments = records.length;
  const latestTotal = latestRecord?.total_co2 ?? 0;
  const latestEcoScore = latestRecord?.eco_score ?? (latestTotal > 0 ? calculateEcoScore(latestTotal) : 0);
  const scoreBand = getScoreBand(latestEcoScore);

  const sorted = [...records].sort(
    (a, b) => new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime(),
  );

  const bestEcoScore = records.length > 0 ? Math.max(...records.map((r) => r.eco_score)) : 0;
  const firstDate = sorted.length > 0 && sorted[0].created_at
    ? new Date(sorted[0].created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  const improvement = sorted.length >= 2
    ? ((sorted[0].total_co2 - sorted[sorted.length - 1].total_co2) / sorted[0].total_co2 * 100)
    : 0;

  /* ── Achievements (derived from real data) ── */
  const unlockedIds = new Set<string>();
  if (records.length >= 1) unlockedIds.add('first_footprint');
  if (sorted.length >= 2 && sorted[sorted.length - 1].total_co2 < sorted[0].total_co2) unlockedIds.add('footprint_reducer');
  if (records.some((r) => r.waste < 0.5)) unlockedIds.add('waste_warrior');
  if (records.some((r) => r.transportation < 1.5)) unlockedIds.add('green_traveler');
  if (records.some((r) => r.electricity < 1.0)) unlockedIds.add('energy_saver');

  /* ── Recent activity (derived from real records) ── */
  const recentActivities: ActivityItem[] = [];
  const recentSorted = [...records].sort(
    (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
  );
  for (const r of recentSorted.slice(0, 5)) {
    recentActivities.push({
      id: `calc-${r.id}`,
      icon: Leaf,
      text: `Carbon footprint calculated — ${r.total_co2.toFixed(2)} t CO₂e`,
      date: r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '',
      iconBg: '#eaf7ed',
      iconColor: '#118865',
    });
  }

  /* ── Initials ── */
  const displayName = profile.fullName || user?.name || 'Guest User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'G';

  /* ── Handlers ── */
  const handleToggle = (key: keyof ProfileSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveSettings(updated);
      return updated;
    });
  };

  const handleUnitToggle = () => {
    setSettings((prev) => {
      const updated = { ...prev, units: prev.units === 'metric' ? 'imperial' as const : 'metric' as const };
      saveSettings(updated);
      return updated;
    });
  };

  const handleLogout = () => {
    clearSession();
    onNavigate('home');
  };

  const handleInterestToggle = (id: string) => {
    setInterests((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      saveInterests(next);
      return next;
    });
  };

  /* ── Edit profile ── */
  const openEdit = useCallback(() => {
    setEditForm({ ...profile });
    setEditErrors({});
    setSaveSuccess(false);
    setEditOpen(true);
    setTimeout(() => editNameRef.current?.focus(), 100);
  }, [profile]);

  const validateEdit = (): boolean => {
    const errs: Partial<Record<keyof ProfileInfo, string>> = {};
    if (!editForm.fullName.trim()) errs.fullName = 'Name is required';
    if (!editForm.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email.trim())) errs.email = 'Enter a valid email';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = () => {
    if (!validateEdit()) return;
    const updated = { ...editForm, fullName: editForm.fullName.trim(), email: editForm.email.trim() };
    setProfile(updated);
    saveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => { setEditOpen(false); setSaveSuccess(false); }, 1200);
  };

  /* ═══════ RENDER ═══════ */

  return (
    <div className="calc-page">
      {/* ── Hero ── */}
      <div className="calc-hero">
        <div className="container">
          <div className="calc-hero-inner">
            <div className="pill">
              <span className="pulse-dot" />
              YOUR PROFILE
            </div>
            <h1 className="calc-title">
              My <em>Profile</em>
            </h1>
            <p className="calc-intro">
              Manage your profile, view your sustainability impact, track achievements, and customize your preferences.
            </p>
          </div>
        </div>
      </div>

      <div className="calc-body">
        <div className="container">

          {/* ══════════ 1. PROFILE HEADER ══════════ */}
          <div className="profile-card" style={{ marginBottom: 24 }}>
            <div className="profile-card-inner">
              <div className="pro-avatar-wrap">
                <div className="profile-avatar pro-avatar-lg" aria-hidden="true">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="" className="pro-avatar-img" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{displayName}</h2>
                {profile.tagline && (
                  <p className="pro-tagline">"{profile.tagline}"</p>
                )}
                <p className="profile-email">
                  <Mail size={13} style={{ verticalAlign: 'text-bottom', marginRight: 5, opacity: 0.6 }} />
                  {profile.email || user?.email || 'Not signed in'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                  {user && (
                    <span className="profile-member-badge">
                      <Shield size={12} />
                      Active Member
                    </span>
                  )}
                  <button type="button" className="pro-edit-btn" onClick={openEdit}>
                    <Edit3 size={13} />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════ 2. ECO SUMMARY ══════════ */}
          <div style={{ marginBottom: 28 }}>
            <h3 className="dashboard-section-title">
              <Leaf size={20} style={{ verticalAlign: 'text-bottom', marginRight: 8, color: 'var(--green)' }} />
              Eco Summary
            </h3>

            {loading ? (
              <div className="progress-loading">
                <Loader2 size={28} className="spin" />
                <span>Loading impact data…</span>
              </div>
            ) : !user ? (
              <div className="progress-empty">
                <div className="progress-empty-icon"><User size={28} /></div>
                <h3 className="progress-empty-title">Sign in to see your impact</h3>
                <p className="progress-empty-text">
                  Create an account or sign in to track your carbon footprint over time and see your personal impact summary.
                </p>
                <button type="button" className="button" onClick={() => onNavigate('calculator')}>
                  Calculate Your Footprint
                </button>
              </div>
            ) : totalAssessments === 0 ? (
              <div className="progress-empty">
                <div className="progress-empty-icon"><Target size={28} /></div>
                <h3 className="progress-empty-title">No footprint data yet</h3>
                <p className="progress-empty-text">
                  Calculate your first footprint to see your sustainability statistics.
                </p>
                <button type="button" className="button" onClick={() => onNavigate('calculator')}>
                  Calculate My Footprint
                </button>
              </div>
            ) : (
              <div className="profile-impact-grid">
                {/* Eco Score */}
                <div className="dash-metric-card dash-metric-primary">
                  <div className="dash-metric-icon"><Sprout size={22} /></div>
                  <span className="dash-metric-label">Eco Score</span>
                  <span className="dash-metric-value">
                    {latestEcoScore}
                    <small>/ 100</small>
                  </span>
                </div>
                {/* Carbon Footprint */}
                <div className="dash-metric-card">
                  <div className="dash-metric-icon" style={{ background: '#eaf5f5', color: '#1594a1' }}>
                    <Leaf size={22} />
                  </div>
                  <span className="dash-metric-label">Carbon Footprint</span>
                  <span className="dash-metric-value">
                    {latestTotal.toFixed(1)}
                    <small>t CO₂e/year</small>
                  </span>
                </div>
                {/* Improvement */}
                <div className="dash-metric-card">
                  <div className="dash-metric-icon" style={{ background: improvement > 0 ? '#eaf7ed' : '#fef3f0', color: improvement > 0 ? '#118865' : '#d4562f' }}>
                    <TrendingDown size={22} />
                  </div>
                  <span className="dash-metric-label">Improvement</span>
                  <span className="dash-metric-value">
                    {improvement > 0 ? `${Math.round(improvement)}%` : '—'}
                    <small>{improvement > 0 ? 'reduction' : sorted.length < 2 ? 'Need 2+ assessments' : 'No improvement yet'}</small>
                  </span>
                </div>
                {/* Achievements */}
                <div className="dash-metric-card">
                  <div className="dash-metric-icon" style={{ background: '#f8f4e9', color: '#e0932a' }}>
                    <Trophy size={22} />
                  </div>
                  <span className="dash-metric-label">Achievements</span>
                  <span className="dash-metric-value">
                    {unlockedIds.size}
                    <small>unlocked</small>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ══════════ 3. PERSONAL INFORMATION ══════════ */}
          {user && (
            <div style={{ marginBottom: 28 }}>
              <h3 className="dashboard-section-title">
                <UserCheck size={20} style={{ verticalAlign: 'text-bottom', marginRight: 8, color: 'var(--green)' }} />
                About You
              </h3>
              <div className="dash-card">
                <div className="pro-info-grid">
                  <div className="pro-info-item">
                    <span className="pro-info-label">Full Name</span>
                    <span className="pro-info-value">{profile.fullName || '—'}</span>
                  </div>
                  <div className="pro-info-item">
                    <span className="pro-info-label">Email</span>
                    <span className="pro-info-value">{profile.email || '—'}</span>
                  </div>
                  <div className="pro-info-item">
                    <span className="pro-info-label">Location</span>
                    <span className="pro-info-value">{profile.location || 'Not set'}</span>
                  </div>
                  <div className="pro-info-item">
                    <span className="pro-info-label">Status</span>
                    <span className="pro-info-value">{profile.status || 'Not set'}</span>
                  </div>
                </div>
                <button type="button" className="pro-edit-btn" style={{ marginTop: 20 }} onClick={openEdit}>
                  <Edit3 size={13} />
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* ══════════ 4. SUSTAINABILITY INTERESTS ══════════ */}
          {user && (
            <div style={{ marginBottom: 28 }}>
              <h3 className="dashboard-section-title">
                <Heart size={20} style={{ verticalAlign: 'text-bottom', marginRight: 8, color: 'var(--green)' }} />
                Sustainability Interests
              </h3>
              <div className="dash-card">
                <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: 13 }}>
                  Select the areas you care about most. This helps us personalize your recommendations.
                </p>
                <div className="pro-interests-grid">
                  {INTEREST_DEFS.map((int) => {
                    const selected = interests.includes(int.id);
                    return (
                      <button
                        key={int.id}
                        type="button"
                        className={`pro-interest-chip ${selected ? 'pro-interest-selected' : ''}`}
                        onClick={() => handleInterestToggle(int.id)}
                        aria-pressed={selected}
                      >
                        <span className="pro-interest-emoji">{int.emoji}</span>
                        <span>{int.label}</span>
                        {selected && <Check size={14} className="pro-interest-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════ 5. ACHIEVEMENTS ══════════ */}
          {user && (
            <div style={{ marginBottom: 28 }}>
              <div className="progress-achievements-header">
                <div className="progress-achievements-header-left">
                  <div className="progress-achievements-icon"><Trophy size={24} /></div>
                  <div>
                    <h3 className="dashboard-section-title" style={{ marginBottom: 4 }}>Achievements</h3>
                    <p className="progress-achievements-subtitle">
                      {unlockedIds.size > 0
                        ? `${unlockedIds.size} of ${ACHIEVEMENT_DEFS.length} unlocked`
                        : 'Complete sustainability activities to unlock achievements.'}
                    </p>
                  </div>
                </div>
              </div>

              {totalAssessments === 0 ? (
                <div className="progress-empty" style={{ padding: '50px 30px' }}>
                  <div className="progress-empty-icon"><Award size={28} /></div>
                  <h3 className="progress-empty-title">No achievements yet</h3>
                  <p className="progress-empty-text">
                    Complete sustainability activities to unlock achievements.
                  </p>
                  <button type="button" className="button" onClick={() => onNavigate('calculator')}>
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="progress-achievements-grid">
                  {ACHIEVEMENT_DEFS.map((ach) => {
                    const unlocked = unlockedIds.has(ach.id);
                    const Icon = ach.icon;
                    return (
                      <div
                        key={ach.id}
                        className={`achievement-card ${unlocked ? 'achievement-unlocked' : 'achievement-locked'}`}
                      >
                        <div className="achievement-icon" style={{ background: ach.bg, color: ach.color }}>
                          <Icon size={22} />
                        </div>
                        <div className="achievement-info">
                          <span className="achievement-label">{ach.label}</span>
                          <span className="achievement-desc">{ach.description}</span>
                        </div>
                        {unlocked && (
                          <div className="achievement-badge"><Check size={14} /></div>
                        )}
                        {!unlocked && (
                          <div className="achievement-badge" style={{ background: '#f0f5f2', color: '#b4cdc4' }}>
                            <Lock size={12} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════ 6. SUSTAINABILITY JOURNEY ══════════ */}
          {user && (
            <div style={{ marginBottom: 28 }}>
              <h3 className="dashboard-section-title">
                <Target size={20} style={{ verticalAlign: 'text-bottom', marginRight: 8, color: 'var(--green)' }} />
                Your Sustainability Journey
              </h3>

              {totalAssessments === 0 ? (
                <div className="progress-empty" style={{ padding: '50px 30px' }}>
                  <div className="progress-empty-icon"><Sprout size={28} /></div>
                  <h3 className="progress-empty-title">Your journey starts here</h3>
                  <p className="progress-empty-text">
                    Your sustainability journey starts with your first footprint calculation.
                  </p>
                  <button type="button" className="button" onClick={() => onNavigate('calculator')}>
                    Calculate My Footprint
                  </button>
                </div>
              ) : (
                <div className="pro-journey-grid">
                  <div className="pro-journey-card">
                    <div className="pro-journey-icon" style={{ background: '#eaf7ed', color: '#118865' }}>
                      <Calendar size={20} />
                    </div>
                    <span className="pro-journey-label">First Calculation</span>
                    <span className="pro-journey-value">{firstDate ?? '—'}</span>
                  </div>
                  <div className="pro-journey-card">
                    <div className="pro-journey-icon" style={{ background: '#eaf5f5', color: '#1594a1' }}>
                      <Target size={20} />
                    </div>
                    <span className="pro-journey-label">Calculations</span>
                    <span className="pro-journey-value">{totalAssessments}</span>
                  </div>
                  <div className="pro-journey-card">
                    <div className="pro-journey-icon" style={{ background: '#eaf7ed', color: '#118865' }}>
                      <Award size={20} />
                    </div>
                    <span className="pro-journey-label">Current Eco Score</span>
                    <span className="pro-journey-value" style={{ color: scoreBand.color }}>{latestEcoScore}</span>
                  </div>
                  <div className="pro-journey-card">
                    <div className="pro-journey-icon" style={{ background: '#f8f4e9', color: '#e0932a' }}>
                      <Star size={20} />
                    </div>
                    <span className="pro-journey-label">Best Eco Score</span>
                    <span className="pro-journey-value">{bestEcoScore > 0 ? bestEcoScore : '—'}</span>
                  </div>
                  <div className="pro-journey-card">
                    <div className="pro-journey-icon" style={{ background: improvement > 0 ? '#eaf7ed' : '#f0f5f2', color: improvement > 0 ? '#118865' : '#82a098' }}>
                      <TrendingDown size={20} />
                    </div>
                    <span className="pro-journey-label">Improvement</span>
                    <span className="pro-journey-value">{improvement > 0 ? `${Math.round(improvement)}%` : '—'}</span>
                  </div>
                  <div className="pro-journey-card">
                    <div className="pro-journey-icon" style={{ background: '#edf3fb', color: '#4a7fc1' }}>
                      <Trophy size={20} />
                    </div>
                    <span className="pro-journey-label">Achievements</span>
                    <span className="pro-journey-value">{unlockedIds.size} / {ACHIEVEMENT_DEFS.length}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════ 7. RECENT ACTIVITY ══════════ */}
          {user && (
            <div style={{ marginBottom: 28 }}>
              <h3 className="dashboard-section-title">
                <Clock size={20} style={{ verticalAlign: 'text-bottom', marginRight: 8, color: 'var(--green)' }} />
                Recent Activity
              </h3>

              {recentActivities.length === 0 ? (
                <div className="progress-empty" style={{ padding: '50px 30px' }}>
                  <div className="progress-empty-icon"><Clock size={28} /></div>
                  <h3 className="progress-empty-title">No recent activity</h3>
                  <p className="progress-empty-text">
                    Your recent sustainability activity will appear here.
                  </p>
                </div>
              ) : (
                <div className="pro-activity-list">
                  {recentActivities.map((act) => {
                    const Icon = act.icon;
                    return (
                      <div key={act.id} className="pro-activity-item">
                        <div className="pro-activity-icon" style={{ background: act.iconBg, color: act.iconColor }}>
                          <Icon size={18} />
                        </div>
                        <div className="pro-activity-info">
                          <span className="pro-activity-text">{act.text}</span>
                          <span className="pro-activity-date">{act.date}</span>
                        </div>
                        <Check size={16} className="pro-activity-check" />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ══════════ 8. ACCOUNT SETTINGS ══════════ */}
          <div style={{ marginBottom: 28 }}>
            <h3 className="dashboard-section-title">
              <Settings size={20} style={{ verticalAlign: 'text-bottom', marginRight: 8, color: 'var(--green)' }} />
              {user ? 'Account Settings' : 'Preferences'}
            </h3>

            <div className="dash-card">
              {/* Edit Profile */}
              {user && (
                <div className="profile-setting-row">
                  <div className="profile-setting-info">
                    <div className="profile-setting-icon" style={{ background: '#eaf7ed', color: 'var(--green)' }}>
                      <Edit3 size={18} />
                    </div>
                    <div>
                      <strong>Edit Profile</strong>
                      <span>Update your name, email, and personal details</span>
                    </div>
                  </div>
                  <button type="button" className="profile-unit-btn" onClick={openEdit}>Edit</button>
                </div>
              )}

              {/* Notification Preferences */}
              <div className="profile-setting-row">
                <div className="profile-setting-info">
                  <div className="profile-setting-icon" style={{ background: '#eaf7ed', color: 'var(--green)' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <strong>Email Digest</strong>
                    <span>Weekly summary of your eco impact</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`profile-toggle ${settings.emailDigest ? 'profile-toggle-on' : ''}`}
                  onClick={() => handleToggle('emailDigest')}
                  role="switch"
                  aria-checked={settings.emailDigest}
                  aria-label="Toggle email digest"
                />
              </div>

              <div className="profile-setting-row">
                <div className="profile-setting-info">
                  <div className="profile-setting-icon" style={{ background: '#eaf5f5', color: '#1594a1' }}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <strong>Reduction Reminders</strong>
                    <span>Tips and nudges to reduce your footprint</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`profile-toggle ${settings.reductionReminders ? 'profile-toggle-on' : ''}`}
                  onClick={() => handleToggle('reductionReminders')}
                  role="switch"
                  aria-checked={settings.reductionReminders}
                  aria-label="Toggle reduction reminders"
                />
              </div>

              {/* Privacy */}
              <div className="profile-setting-row">
                <div className="profile-setting-info">
                  <div className="profile-setting-icon" style={{ background: '#f2eff9', color: '#8b6fc0' }}>
                    <Shield size={18} />
                  </div>
                  <div>
                    <strong>Privacy Settings</strong>
                    <span>Manage your data and visibility</span>
                  </div>
                </div>
                <span className="pro-coming-soon-badge">Coming Soon</span>
              </div>

              {/* Change Password */}
              {user && (
                <div className="profile-setting-row">
                  <div className="profile-setting-info">
                    <div className="profile-setting-icon" style={{ background: '#f8f4e9', color: '#e0932a' }}>
                      <Key size={18} />
                    </div>
                    <div>
                      <strong>Change Password</strong>
                      <span>Update your account password</span>
                    </div>
                  </div>
                  <span className="pro-coming-soon-badge">Coming Soon</span>
                </div>
              )}

              {/* Units */}
              <div className="profile-setting-row">
                <div className="profile-setting-info">
                  <div className="profile-setting-icon" style={{ background: '#f8f4e9', color: '#e0932a' }}>
                    <Ruler size={18} />
                  </div>
                  <div>
                    <strong>Units</strong>
                    <span>Switch between metric and imperial</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="profile-unit-btn"
                  onClick={handleUnitToggle}
                  aria-label={`Current units: ${settings.units}. Click to switch.`}
                >
                  {settings.units === 'metric' ? 'Metric' : 'Imperial'}
                </button>
              </div>

              {/* Dark Mode */}
              <div className="profile-setting-row">
                <div className="profile-setting-info">
                  <div className="profile-setting-icon" style={{ background: '#f2eff9', color: '#8b6fc0' }}>
                    <Moon size={18} />
                  </div>
                  <div>
                    <strong>Dark Mode</strong>
                    <span>Coming soon — switch to dark theme</span>
                  </div>
                </div>
                <button
                  type="button"
                  className={`profile-toggle ${settings.darkMode ? 'profile-toggle-on' : ''}`}
                  onClick={() => handleToggle('darkMode')}
                  role="switch"
                  aria-checked={settings.darkMode}
                  aria-label="Toggle dark mode"
                  disabled
                />
              </div>

              {/* Sign Out */}
              {user && (
                <div className="profile-setting-row">
                  <div className="profile-setting-info">
                    <div className="profile-setting-icon" style={{ background: '#fef3f0', color: '#e85b5b' }}>
                      <LogOut size={18} />
                    </div>
                    <div>
                      <strong>Sign Out</strong>
                      <span>Log out of your account</span>
                    </div>
                  </div>
                  <button type="button" className="profile-logout-btn" style={{ padding: '8px 18px', fontSize: 12 }} onClick={handleLogout}>
                    <LogOut size={14} />
                    Log Out
                  </button>
                </div>
              )}

              {/* Delete Account */}
              {user && (
                <div className="profile-setting-row profile-setting-row-last">
                  <div className="profile-setting-info">
                    <div className="profile-setting-icon" style={{ background: '#fef3f0', color: '#e85b5b' }}>
                      <Trash2 size={18} />
                    </div>
                    <div>
                      <strong style={{ color: '#e85b5b' }}>Delete Account</strong>
                      <span>Permanently delete your account and data</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="pro-danger-btn"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ══════════ Quick Actions ══════════ */}
          <div style={{ marginBottom: 48 }}>
            <h3 className="dashboard-section-title">Quick Actions</h3>
            <div className="profile-actions-grid">
              <button type="button" className="profile-action-card" onClick={() => onNavigate('calculator')}>
                <div className="profile-action-icon" style={{ background: '#eaf7ed', color: 'var(--green)' }}>
                  <Leaf size={20} />
                </div>
                <div className="profile-action-text">
                  <strong>New Assessment</strong>
                  <span>Calculate your carbon footprint</span>
                </div>
                <ChevronRight size={18} className="profile-action-arrow" />
              </button>

              <button type="button" className="profile-action-card" onClick={() => onNavigate('progress')}>
                <div className="profile-action-icon" style={{ background: '#eaf5f5', color: '#1594a1' }}>
                  <Award size={20} />
                </div>
                <div className="profile-action-text">
                  <strong>View Progress</strong>
                  <span>Track your journey over time</span>
                </div>
                <ChevronRight size={18} className="profile-action-arrow" />
              </button>

              <button type="button" className="profile-action-card" onClick={() => onNavigate('dashboard')}>
                <div className="profile-action-icon" style={{ background: '#f8f4e9', color: '#e0932a' }}>
                  <Settings size={20} />
                </div>
                <div className="profile-action-text">
                  <strong>Dashboard</strong>
                  <span>View detailed breakdown</span>
                </div>
                <ChevronRight size={18} className="profile-action-arrow" />
              </button>

              <button type="button" className="profile-action-card" onClick={() => onNavigate('recommendations')}>
                <div className="profile-action-icon" style={{ background: '#edf3fb', color: '#4a7fc1' }}>
                  <Flame size={20} />
                </div>
                <div className="profile-action-text">
                  <strong>Recommendations</strong>
                  <span>Get personalized sustainability tips</span>
                </div>
                <ChevronRight size={18} className="profile-action-arrow" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════ EDIT PROFILE MODAL ══════════ */}
      {editOpen && (
        <div className="auth-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditOpen(false); }}>
          <div className="auth-modal" style={{ maxWidth: 480 }} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
            <button type="button" className="auth-close" onClick={() => setEditOpen(false)} aria-label="Close">
              <X size={18} />
            </button>

            <div className="auth-modal-header">
              <div className="auth-modal-icon"><Edit3 size={24} /></div>
              <h2 id="edit-profile-title" className="auth-modal-title">Edit Profile</h2>
              <p className="auth-modal-subtitle">Update your personal details and sustainability tagline.</p>
            </div>

            {saveSuccess && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: '#eaf7ed', color: '#118865', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                <Check size={16} />
                Profile saved successfully!
              </div>
            )}

            <div className="auth-form">
              {/* Full Name */}
              <div className="auth-field">
                <label htmlFor="edit-name">Full Name</label>
                <input
                  ref={editNameRef}
                  id="edit-name"
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Your name"
                />
                {editErrors.fullName && <p className="field-error">{editErrors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="auth-field">
                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                />
                {editErrors.email && <p className="field-error">{editErrors.email}</p>}
              </div>

              {/* Tagline */}
              <div className="auth-field">
                <label htmlFor="edit-tagline">Sustainability Tagline</label>
                <input
                  id="edit-tagline"
                  type="text"
                  value={editForm.tagline}
                  onChange={(e) => setEditForm((p) => ({ ...p, tagline: e.target.value }))}
                  placeholder="e.g. Learning, building and growing sustainably 🌱"
                />
              </div>

              {/* Location */}
              <div className="auth-field">
                <label htmlFor="edit-location">Location</label>
                <input
                  id="edit-location"
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>

              {/* Status */}
              <div className="auth-field">
                <label htmlFor="edit-status">Student / Professional Status</label>
                <input
                  id="edit-status"
                  type="text"
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                  placeholder="e.g. Student, Software Engineer"
                />
              </div>

              <button
                type="button"
                className="button auth-submit"
                onClick={handleSaveProfile}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ DELETE CONFIRM DIALOG ══════════ */}
      {deleteConfirmOpen && (
        <div className="auth-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteConfirmOpen(false); }}>
          <div className="auth-modal" style={{ maxWidth: 420 }} role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc">
            <button type="button" className="auth-close" onClick={() => setDeleteConfirmOpen(false)} aria-label="Close">
              <X size={18} />
            </button>

            <div className="auth-modal-header">
              <div className="auth-modal-icon" style={{ background: '#fef3f0', color: '#e85b5b' }}>
                <AlertTriangle size={24} />
              </div>
              <h2 id="delete-title" className="auth-modal-title">Delete Account?</h2>
              <p id="delete-desc" className="auth-modal-subtitle">
                This action would permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: '#f8f4e9', color: '#b8860b', fontSize: 12, lineHeight: 1.5, marginBottom: 20 }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>This feature is not yet connected to the backend. No data will be deleted.</span>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="button button-ghost"
                style={{ flex: 1 }}
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pro-danger-btn-full"
                style={{ flex: 1 }}
                onClick={() => setDeleteConfirmOpen(false)}
              >
                <Trash2 size={14} />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
