import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PatientDirectoryView from '../../components/objective1/Management/PatientDirectoryView.jsx';

// Mock child components to isolate PatientDirectoryView's state logic
vi.mock('../../components/objective1/Management/PatientList', () => ({
  default: ({ onSelectPatient, selectedPatientId }) => (
    <div data-testid="patient-list">
      <button
        data-testid="select-patient-1"
        onClick={() => onSelectPatient({ id: 1, first_name: 'Juan', last_name: 'Dela Cruz' })}
      >
        Select Juan
      </button>
      <button
        data-testid="select-patient-2"
        onClick={() => onSelectPatient({ id: 2, first_name: 'Maria', last_name: 'Santos' })}
      >
        Select Maria
      </button>
      <span data-testid="selected-id">{selectedPatientId ?? 'none'}</span>
    </div>
  ),
}));

vi.mock('../../components/objective1/Management/PatientProfile.jsx', () => ({
  default: ({ patient, onProfileUpdate, onClose }) => (
    <div data-testid="patient-profile">
      {patient ? (
        <div>
          <span data-testid="profile-name">{patient.first_name} {patient.last_name}</span>
          <button
            data-testid="update-profile"
            onClick={() => onProfileUpdate({ first_name: 'Juan Updated' })}
          >
            Update Name
          </button>
          <button data-testid="close-profile" onClick={onClose}>
            Close Profile
          </button>
        </div>
      ) : (
        <span data-testid="no-selection">No Patient Selected</span>
      )}
    </div>
  ),
}));

describe('PatientDirectoryView Component', () => {
  it('renders both PatientList and PatientProfile initially in unselected state', () => {
    render(<PatientDirectoryView />);

    expect(screen.getByTestId('patient-list')).toBeInTheDocument();
    expect(screen.getByTestId('patient-profile')).toBeInTheDocument();
    expect(screen.getByTestId('no-selection')).toBeInTheDocument();
  });

  it('selects a patient when triggered from PatientList', () => {
    render(<PatientDirectoryView />);

    fireEvent.click(screen.getByTestId('select-patient-1'));

    expect(screen.getByTestId('profile-name')).toHaveTextContent('Juan Dela Cruz');
    expect(screen.getByTestId('selected-id')).toHaveTextContent('1');
  });

  it('toggles selection off when clicking the same selected patient again', () => {
    render(<PatientDirectoryView />);

    // First click -> Selects Juan
    fireEvent.click(screen.getByTestId('select-patient-1'));
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Juan Dela Cruz');

    // Second click on Juan -> Deselects
    fireEvent.click(screen.getByTestId('select-patient-1'));
    expect(screen.getByTestId('no-selection')).toBeInTheDocument();
  });

  it('updates selected patient when onClose callback is fired from PatientProfile', () => {
    render(<PatientDirectoryView />);

    fireEvent.click(screen.getByTestId('select-patient-1'));
    expect(screen.getByTestId('profile-name')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-profile'));
    expect(screen.getByTestId('no-selection')).toBeInTheDocument();
  });

  it('updates profile data when onProfileUpdate is called', () => {
    render(<PatientDirectoryView />);

    fireEvent.click(screen.getByTestId('select-patient-1'));
    fireEvent.click(screen.getByTestId('update-profile'));

    expect(screen.getByTestId('profile-name')).toHaveTextContent('Juan Updated Dela Cruz');
  });

  it('resets selected patient to null when clicking outside list and profile', () => {
    render(
      <div>
        <button data-testid="outside-area">Outside Element</button>
        <PatientDirectoryView />
      </div>
    );

    // Select patient
    fireEvent.click(screen.getByTestId('select-patient-1'));
    expect(screen.getByTestId('profile-name')).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId('outside-area'));

    // Should clear selection
    expect(screen.getByTestId('no-selection')).toBeInTheDocument();
  });
});