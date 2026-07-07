import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PatientProfile from '../components/Management/PatientProfile';

import '@testing-library/jest-dom';

const patient = {
  id: 1,
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  middleName: 'Santos',
  birthDate: '2000-01-01',
  age: 26,
  sex: 'Male',
  contactNumber: '09123456789',
  email: 'juan@example.com',
  address: 'Manila City',
  emergencyContact: 'Maria Dela Cruz',
  medicalHistory: 'None',
};

describe('PatientProfile', () => {
  it('shows a placeholder when no patient is selected', () => {
    render(<PatientProfile patient={null} />);

    expect(screen.getByText(/Select a patient to inspect or update/i)).toBeInTheDocument();
  });

  it('toggles into editing mode and saves updates', async () => {
    const user = userEvent.setup();
    const onProfileUpdate = vi.fn();

    render(<PatientProfile patient={patient} onProfileUpdate={onProfileUpdate} />);

    expect(screen.getByText('Juan')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /edit/i }));

    const firstNameInput = screen.getByDisplayValue('Juan');
    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Jose');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onProfileUpdate).toHaveBeenCalledWith(expect.objectContaining({ firstName: 'Jose' }));
  });
});
