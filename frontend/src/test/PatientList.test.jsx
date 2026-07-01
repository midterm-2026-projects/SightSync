import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import PatientList from '../components/Management/PatientList';

import '@testing-library/jest-dom';

const patients = [
  {
    id: 1,
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    age: 26,
    sex: 'Male',
    contactNumber: '09123456789',
    status: 'Active',
  },
  {
    id: 2,
    firstName: 'Maria',
    lastName: 'Santos',
    age: 31,
    sex: 'Female',
    contactNumber: '09987654321',
    status: 'Pending',
  },
];

describe('PatientList', () => {
  it('renders patient rows and supports filtering by query', async () => {
    const user = userEvent.setup();
    const onSelectPatient = vi.fn();

    render(<PatientList patients={patients} onSelectPatient={onSelectPatient} />);

    expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/search patients/i), 'Juan');

    expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument();
  });

  it('calls onSelectPatient when a row is clicked', async () => {
    const user = userEvent.setup();
    const onSelectPatient = vi.fn();

    render(<PatientList patients={patients} onSelectPatient={onSelectPatient} />);

    await user.click(screen.getByText('Maria Santos'));

    expect(onSelectPatient).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));
  });
});
