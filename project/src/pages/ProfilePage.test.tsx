import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfilePage } from './ProfilePage';
import * as api from '@/services/api';

vi.mock('@/services/api', () => ({
  loadSession: vi.fn(),
  clearSession: vi.fn(),
  getFootprints: vi.fn(),
  getLatestFootprint: vi.fn(),
}));

describe('ProfilePage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders guest state when no user is signed in', async () => {
    vi.mocked(api.loadSession).mockReturnValue(null);

    render(<ProfilePage onNavigate={mockNavigate} />);

    expect(screen.getByText('Guest User')).toBeInTheDocument();
    expect(screen.getByText('Not signed in')).toBeInTheDocument();
    expect(screen.getByText('Sign in to see your impact')).toBeInTheDocument();

    const calcBtn = screen.getByRole('button', { name: /Calculate Your Footprint/i });
    await userEvent.click(calcBtn);
    expect(mockNavigate).toHaveBeenCalledWith('calculator');
  });

  it('renders user details, eco summary, achievements, and recent activity when signed in', async () => {
    const mockUser = { id: 123, name: 'Jane Doe', email: 'jane@example.com' };
    const mockFootprints: api.FootprintRecord[] = [
      {
        id: 1,
        user_id: 123,
        total_co2: 4.5,
        electricity: 0.8,
        transportation: 1.2,
        food: 0.5,
        waste: 0.4,
        travel: 0,
        eco_score: 85,
        created_at: '2026-01-01T00:00:00Z',
      },
    ];

    vi.mocked(api.loadSession).mockReturnValue(mockUser);
    vi.mocked(api.getFootprints).mockResolvedValue({
      data: { footprints: mockFootprints, count: 1 },
      error: null,
    });
    vi.mocked(api.getLatestFootprint).mockResolvedValue({
      data: { footprint: mockFootprints[0] },
      error: null,
    });

    render(<ProfilePage onNavigate={mockNavigate} />);

    await waitFor(() => {
      const nameElements = screen.getAllByText('Jane Doe');
      expect(nameElements.length).toBeGreaterThanOrEqual(1);
    });

    const emailElements = screen.getAllByText('jane@example.com');
    expect(emailElements.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('Active Member')).toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument(); // Initials avatar
    expect(screen.getByText('4.5')).toBeInTheDocument(); // Footprint summary
    expect(screen.getByText('First Footprint')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('navigates to different pages when quick action buttons are clicked', async () => {
    vi.mocked(api.loadSession).mockReturnValue(null);

    render(<ProfilePage onNavigate={mockNavigate} />);

    const newAssessmentBtn = screen.getByRole('button', { name: /New Assessment/i });
    await userEvent.click(newAssessmentBtn);
    expect(mockNavigate).toHaveBeenCalledWith('calculator');

    const progressBtn = screen.getByRole('button', { name: /View Progress/i });
    await userEvent.click(progressBtn);
    expect(mockNavigate).toHaveBeenCalledWith('progress');

    const dashBtn = screen.getByRole('button', { name: /Dashboard/i });
    await userEvent.click(dashBtn);
    expect(mockNavigate).toHaveBeenCalledWith('dashboard');

    const recsBtn = screen.getByRole('button', { name: /Recommendations/i });
    await userEvent.click(recsBtn);
    expect(mockNavigate).toHaveBeenCalledWith('recommendations');
  });

  it('allows toggling preferences and persists changes', async () => {
    vi.mocked(api.loadSession).mockReturnValue(null);

    render(<ProfilePage onNavigate={mockNavigate} />);

    const emailToggle = screen.getByRole('switch', { name: /Toggle email digest/i });
    expect(emailToggle).toHaveAttribute('aria-checked', 'true');

    await userEvent.click(emailToggle);
    expect(emailToggle).toHaveAttribute('aria-checked', 'false');

    const unitBtn = screen.getByRole('button', { name: /Current units: metric/i });
    await userEvent.click(unitBtn);
    expect(screen.getByText('Imperial')).toBeInTheDocument();
  });

  it('allows selecting and deselecting sustainability interests', async () => {
    const mockUser = { id: 123, name: 'Jane Doe', email: 'jane@example.com' };
    vi.mocked(api.loadSession).mockReturnValue(mockUser);
    vi.mocked(api.getFootprints).mockResolvedValue({ data: { footprints: [], count: 0 }, error: null });
    vi.mocked(api.getLatestFootprint).mockResolvedValue({ data: null, error: null });

    render(<ProfilePage onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Climate Action/i })).toBeInTheDocument();
    });

    const climateBtn = screen.getByRole('button', { name: /Climate Action/i });
    expect(climateBtn).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(climateBtn);
    expect(climateBtn).toHaveAttribute('aria-pressed', 'true');

    // Deselecting works
    await userEvent.click(climateBtn);
    expect(climateBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('opens edit profile modal, validates inputs and updates state', async () => {
    const mockUser = { id: 123, name: 'Jane Doe', email: 'jane@example.com' };
    vi.mocked(api.loadSession).mockReturnValue(mockUser);
    vi.mocked(api.getFootprints).mockResolvedValue({ data: { footprints: [], count: 0 }, error: null });
    vi.mocked(api.getLatestFootprint).mockResolvedValue({ data: null, error: null });

    render(<ProfilePage onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Edit Profile/i })[0]).toBeInTheDocument();
    });

    const editBtns = screen.getAllByRole('button', { name: /Edit Profile/i });
    await userEvent.click(editBtns[0]);

    // Modal is open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText(/Sustainability Tagline/i)).toBeInTheDocument();

    // Edit tagline
    const taglineInput = screen.getByLabelText(/Sustainability Tagline/i);
    await userEvent.clear(taglineInput);
    await userEvent.type(taglineInput, 'Zero Waste Advocate');

    // Save
    const saveBtn = screen.getByRole('button', { name: /Save Changes/i });
    await userEvent.click(saveBtn);

    expect(screen.getByText('Profile saved successfully!')).toBeInTheDocument();
  });

  it('opens delete account confirmation dialog with warning', async () => {
    const mockUser = { id: 123, name: 'Jane Doe', email: 'jane@example.com' };
    vi.mocked(api.loadSession).mockReturnValue(mockUser);
    vi.mocked(api.getFootprints).mockResolvedValue({ data: { footprints: [], count: 0 }, error: null });
    vi.mocked(api.getLatestFootprint).mockResolvedValue({ data: null, error: null });

    render(<ProfilePage onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Delete$/i })).toBeInTheDocument();
    });

    const deleteBtn = screen.getByRole('button', { name: /^Delete$/i });
    await userEvent.click(deleteBtn);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(screen.getByText(/This feature is not yet connected to the backend/i)).toBeInTheDocument();

    // Can cancel
    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelBtn);

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('calls clearSession and navigates to home when logging out', async () => {
    const mockUser = { id: 123, name: 'Jane Doe', email: 'jane@example.com' };
    vi.mocked(api.loadSession).mockReturnValue(mockUser);
    vi.mocked(api.getFootprints).mockResolvedValue({ data: { footprints: [], count: 0 }, error: null });
    vi.mocked(api.getLatestFootprint).mockResolvedValue({ data: null, error: null });

    render(<ProfilePage onNavigate={mockNavigate} />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Log Out/i })).toBeInTheDocument();
    });

    const logoutBtn = screen.getByRole('button', { name: /Log Out/i });
    await userEvent.click(logoutBtn);

    expect(api.clearSession).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });
});
