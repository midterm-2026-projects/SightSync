
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import AppLayout from '../components/AppLayout.jsx';

import '@testing-library/jest-dom';

describe('AppLayout Structural Framework', () => {

  it('should render the foundational core layout text nodes, metadata, and navigation elements', () => {
    render(
      <AppLayout>
        {(currentTab) => <div>Current: {currentTab}</div>}
      </AppLayout>
    );

    // Validate structure and headers
    expect(screen.getByText('SightSync')).toBeInTheDocument();
    expect(screen.getByText('Clinic Management Suite')).toBeInTheDocument();
    expect(screen.getByText('Patient & Appointment Management')).toBeInTheDocument();

    // Check metadata content
    expect(screen.getByText(/SightSync 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Status: Frontend Init/i)).toBeInTheDocument();

    // Check all navigation buttons exist structurally
    expect(screen.getByRole('button', { name: /Dashboard Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Patient Management/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Appointment Schedules/i })).toBeInTheDocument();
  });

  it('should update the active runtime selection state to "patients" when Patient Management is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AppLayout>
        {(currentTab) => <div data-testid="view-state">Current: {currentTab}</div>}
      </AppLayout>
    );

    const viewContainer = screen.getByTestId('view-state');
    expect(viewContainer).toHaveTextContent('Current: dashboard');

    // Click on the patient management option
    const patientButton = screen.getByRole('button', { name: /Patient Management/i });
    await user.click(patientButton);

    // State callback structure should react instantly
    expect(viewContainer).toHaveTextContent('Current: patients');
  });

  it('should update the active runtime selection state to "appointments" when Appointment Schedules is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AppLayout>
        {(currentTab) => <div data-testid="view-state">Current: {currentTab}</div>}
      </AppLayout>
    );

    const viewContainer = screen.getByTestId('view-state');

    // Click on the appointment management option
    const appointmentButton = screen.getByRole('button', { name: /Appointment Schedules/i });
    await user.click(appointmentButton);

    // State should change to appointments
    expect(viewContainer).toHaveTextContent('Current: appointments');
  });

  it('should allow alternating state selections seamlessly across multiple clicks', async () => {
    const user = userEvent.setup();

    render(
      <AppLayout>
        {(currentTab) => <div data-testid="view-state">Current: {currentTab}</div>}
      </AppLayout>
    );

    const viewContainer = screen.getByTestId('view-state');
    const dashboardButton = screen.getByRole('button', { name: /Dashboard Overview/i });
    const patientButton = screen.getByRole('button', { name: /Patient Management/i });
    const appointmentButton = screen.getByRole('button', { name: /Appointment Schedules/i });

    // Go to patients
    await user.click(patientButton);
    expect(viewContainer).toHaveTextContent('Current: patients');

    // Go to appointments
    await user.click(appointmentButton);
    expect(viewContainer).toHaveTextContent('Current: appointments');

    // Return back to dashboard
    await user.click(dashboardButton);
    expect(viewContainer).toHaveTextContent('Current: dashboard');
  });

});