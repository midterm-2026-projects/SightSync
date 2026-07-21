import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PatientList from '../../components/objective1/Management/PatientList';
import { getPatients } from '../../components/objective1/api/patientApi';

// Mock API and Mapper
vi.mock('../../components/objective1/api/patientApi', () => ({
  getPatients: vi.fn(),
}));

const mockRawPatients = [
  { id: 1, first_name: 'Juan', last_name: 'Dela Cruz', age: 26, sex: 'Male', contact_number: '09171234567', status: 'Active' },
  { id: 2, first_name: 'Maria', last_name: 'Santos', age: 30, sex: 'Female', contact_number: '09189876543', status: 'Inactive' },
];

describe('PatientList Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders loading state initially and then displays patient records', async () => {
    getPatients.mockResolvedValueOnce({ data: mockRawPatients });

    render(<PatientList onSelectPatient={vi.fn()} />);

    // Verify loading message is shown
    expect(screen.getByText(/loading patient records/i)).toBeInTheDocument();

    // Wait for API resolution and table population
    await waitFor(() => {
      expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    });

    expect(screen.queryByText(/loading patient records/i)).not.toBeInTheDocument();
  });

  it('handles error state when API call fails and allows retry', async () => {
    getPatients.mockRejectedValueOnce(new Error('Network Error'));

    render(<PatientList onSelectPatient={vi.fn()} />);

    // Wait for error banner
    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
      expect(screen.getByText('Could not load data.')).toBeInTheDocument();
    });

    // Mock successful retry
    getPatients.mockResolvedValueOnce({ data: mockRawPatients });

    // Click "Try Again"
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));

    // Verify data loads successfully
    await waitFor(() => {
      expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    });
  });

  it('filters rows based on search input query', async () => {
    getPatients.mockResolvedValueOnce({ data: mockRawPatients });

    render(<PatientList onSelectPatient={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    });

    // Type "Maria" into search box
    const searchInput = screen.getByRole('textbox', { name: /search patients/i });
    fireEvent.change(searchInput, { target: { value: 'Maria' } });

    // "Maria" should be visible, "Juan" should be filtered out
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.queryByText('Juan Dela Cruz')).not.toBeInTheDocument();
  });

  it('filters rows based on status dropdown selection', async () => {
    getPatients.mockResolvedValueOnce({ data: mockRawPatients });

    render(<PatientList onSelectPatient={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    });

    // Select "Inactive" filter
    const statusSelect = screen.getByRole('combobox', { name: /filter by status/i });
    fireEvent.change(statusSelect, { target: { value: 'Inactive' } });

    // Only Maria (Inactive) should remain
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.queryByText('Juan Dela Cruz')).not.toBeInTheDocument();
  });

  it('triggers onSelectPatient callback with patient data when a row is clicked', async () => {
    const handleSelect = vi.fn();
    getPatients.mockResolvedValueOnce({ data: mockRawPatients });

    render(<PatientList onSelectPatient={handleSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    });

    // Click Juan's row
    fireEvent.click(screen.getByText('Juan Dela Cruz').closest('tr'));

    // Assert callback received original patient object
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(mockRawPatients[0]);
  });

  it('displays empty state message when search yields no matches', async () => {
    getPatients.mockResolvedValueOnce({ data: mockRawPatients });

    render(<PatientList onSelectPatient={vi.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    });

    const searchInput = screen.getByRole('textbox', { name: /search patients/i });
    fireEvent.change(searchInput, { target: { value: 'NonExistentName' } });

    expect(screen.getByText('No patients found.')).toBeInTheDocument();
  });
});