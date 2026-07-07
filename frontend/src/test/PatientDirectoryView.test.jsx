import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import PatientDirectoryView from '../components/Management/PatientDirectoryView';

import '@testing-library/jest-dom';

describe('PatientDirectoryView', () => {
  it('renders the directory and profile panels with the initial patient selected', () => {
    render(<PatientDirectoryView />);

    expect(screen.getByText('Patient Directory')).toBeInTheDocument();
    expect(screen.getByText('Patient Profile')).toBeInTheDocument();
    expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });

  it('filters the directory rows by status and allows selecting a patient', async () => {
    const user = userEvent.setup();
    render(<PatientDirectoryView />);

    const filter = screen.getByLabelText(/filter by status/i);
    await user.selectOptions(filter, 'Pending');

    expect(screen.queryByText('Juan Dela Cruz')).not.toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();

    await user.click(screen.getByText('Maria Santos'));
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });
});
