import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PatientRegistrationForm from '../components/Registration/PatientRegistrationForm.jsx';

import '@testing-library/jest-dom';

describe('PatientRegistrationForm', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render the patient registration form fields and actions', () => {
    render(<PatientRegistrationForm />);

    expect(screen.getByRole('heading', { name: /Patient Registration/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sex/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Address \*$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register Patient/i })).toBeInTheDocument();
  });

  it('should show validation errors when required fields are missing', () => {
    render(<PatientRegistrationForm />);

    fireEvent.click(screen.getByRole('button', { name: /Register Patient/i }));

    expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Birth date is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Sex is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact number is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/Patient registered successfully/i)).not.toBeInTheDocument();
  });

  it('should calculate age when a birth date is entered', () => {
    render(<PatientRegistrationForm />);

    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '2000-01-01' } });

    expect(screen.getByLabelText(/Age/i)).toHaveValue(26);
  });

  it('should submit valid patient data and reset the form', () => {
    render(<PatientRegistrationForm />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Dela Cruz' } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: '2000-01-01' } });
    fireEvent.change(screen.getByLabelText(/Sex/i), { target: { value: 'Male' } });
    fireEvent.change(screen.getByLabelText(/Contact Number/i), { target: { value: '09123456789' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'juan@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Address \*$/i), { target: { value: 'Manila City' } });
    fireEvent.change(screen.getByLabelText(/Emergency Contact/i), { target: { value: 'Maria Dela Cruz' } });
    fireEvent.change(screen.getByLabelText(/Medical History/i), { target: { value: 'None' } });

    fireEvent.click(screen.getByRole('button', { name: /Register Patient/i }));

    expect(console.log).toHaveBeenCalledWith('Patient Registration Payload:');
    expect(console.log).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: 'Juan',
        last_name: 'Dela Cruz',
        birth_date: '2000-01-01',
        age: 26,
        sex: 'Male',
        contact_number: '09123456789',
        email: 'juan@example.com',
        address: 'Manila City',
        emergency_contact: 'Maria Dela Cruz',
        medical_history: 'None',
      })
    );
    expect(screen.getByText(/Patient registered successfully/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Contact Number/i)).toHaveValue('');
  });

  it('should clear typed data and validation messages when reset is clicked', () => {
    render(<PatientRegistrationForm />);

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'Juan' } });
    fireEvent.click(screen.getByRole('button', { name: /Register Patient/i }));

    expect(screen.getByLabelText(/First Name/i)).toHaveValue('Juan');
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

    expect(screen.getByLabelText(/First Name/i)).toHaveValue('');
    expect(screen.queryByText(/Last name is required/i)).not.toBeInTheDocument();
  });
});
