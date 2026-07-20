import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PatientProfile from '../../components/objective1/Management/PatientProfile';
import { updatePatient } from '../../components/objective1/api/patientApi';
import { createPatientProfileForm, mapPatientToPayload } from '../../components/objective1/utils/patientMapper';

// Mock dependencies
vi.mock('../../components/objective1/api/patientApi', () => ({
  updatePatient: vi.fn(),
}));

vi.mock('../../components/objective1/utils/patientMapper', () => ({
  createPatientProfileForm: vi.fn(),
  mapPatientToPayload: vi.fn(),
}));

const mockPatient = {
  id: 101,
  first_name: 'Juan',
  last_name: 'Dela Cruz',
  birth_date: '1995-05-15',
  age: 28,
  sex: 'Male',
  status: 'Active',
  contact_number: '09171234567',
  email: 'juan@example.com',
  address: 'Manila',
  emergency_contact: 'Maria Dela Cruz',
  medical_history: 'None',
};

const mockFormInitial = {
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  middleName: '',
  birthDate: '1995-05-15',
  age: '28',
  sex: 'Male',
  status: 'Active',
  contactNumber: '09171234567',
  email: 'juan@example.com',
  address: 'Manila',
  emergencyContact: 'Maria Dela Cruz',
  medicalHistory: 'None',
};

describe('PatientProfile Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    createPatientProfileForm.mockReturnValue(mockFormInitial);
    mapPatientToPayload.mockImplementation((form) => form);
  });

  it('renders default fallback state when no patient is selected', () => {
    render(<PatientProfile patient={null} onProfileUpdate={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /patient profile/i })).toBeInTheDocument();
    expect(
      screen.getByText(/select a patient to inspect or update their profile/i)
    ).toBeInTheDocument();
  });

  it('renders patient profile details in read-only mode by default', () => {
    render(<PatientProfile patient={mockPatient} onProfileUpdate={vi.fn()} />);

    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Dela Cruz')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();

    // Verify "Edit Profile" button is visible and "Cancel" is hidden
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('switches to editing mode when "Edit Profile" is clicked', () => {
    render(<PatientProfile patient={mockPatient} onProfileUpdate={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));

    // Input fields should now be rendered with values
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dela Cruz')).toBeInTheDocument();

    // Buttons should switch to "Save Changes" and "Cancel"
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('cancels editing and resets form values when "Cancel" is clicked', () => {
    render(<PatientProfile patient={mockPatient} onProfileUpdate={vi.fn()} />);

    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));

    // Change first name
    const firstNameInput = screen.getByDisplayValue('Juan');
    fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'ChangedName' } });
    expect(screen.getByDisplayValue('ChangedName')).toBeInTheDocument();

    // Click Cancel
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    // Should return to read-only mode with original data
    expect(screen.queryByDisplayValue('ChangedName')).not.toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });

  it('submits updated profile data successfully and triggers onProfileUpdate', async () => {
    const handleProfileUpdate = vi.fn();
    const mockUpdatedServerResponse = { ...mockPatient, first_name: 'Juan Edited' };
    updatePatient.mockResolvedValueOnce(mockUpdatedServerResponse);

    render(<PatientProfile patient={mockPatient} onProfileUpdate={handleProfileUpdate} />);

    // Click Edit
    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));

    // Edit input
    const firstNameInput = screen.getByDisplayValue('Juan');
    fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'Juan Edited' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    // Verify submission state
    await waitFor(() => {
      expect(updatePatient).toHaveBeenCalledWith(101, expect.objectContaining({ firstName: 'Juan Edited' }));
      expect(handleProfileUpdate).toHaveBeenCalledWith(mockUpdatedServerResponse);
    });

    // Should exit edit mode on success
    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
  });

  it('handles API submission errors gracefully', async () => {
    updatePatient.mockRejectedValueOnce(new Error('Failed to update patient record on server.'));

    render(<PatientProfile patient={mockPatient} onProfileUpdate={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /edit profile/i }));
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Failed to update patient record on server.')
      ).toBeInTheDocument();
    });

    // Should stay in edit mode so user can try again
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('resets form state when a new patient prop is selected', () => {
    const { rerender } = render(
      <PatientProfile patient={mockPatient} onProfileUpdate={vi.fn()} />
    );

    expect(screen.getByText('Juan')).toBeInTheDocument();

    // Select new patient
    const newPatient = { ...mockPatient, id: 102, first_name: 'Maria' };
    createPatientProfileForm.mockReturnValueOnce({
      ...mockFormInitial,
      firstName: 'Maria',
    });

    rerender(<PatientProfile patient={newPatient} onProfileUpdate={vi.fn()} />);

    expect(screen.getByText('Maria')).toBeInTheDocument();
  });
});