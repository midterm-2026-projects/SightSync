
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import AppLayout from '../components/AppLayout.jsx';

import '@testing-library/jest-dom';

describe('AppLayout Structural Framework', () => {
  
  it('should render the foundational core layout text nodes and navigation elements', () => {
    render(
      <AppLayout>
        {(currentTab) => <div>Current: {currentTab}</div>}
      </AppLayout>
    );

    // Validate structure is printed onto the Virtual DOM
    expect(screen.getByText('SightSync')).toBeInTheDocument();
    expect(screen.getByText('Patient & Appointment Management')).toBeInTheDocument();
    
    // Check navigation buttons exist structurally
    expect(screen.getByRole('button', { name: /Dashboard Overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Patient Management/i })).toBeInTheDocument();
  });

  it('should update the active runtime selection state when a navigation element is clicked', async () => {
    const user = userEvent.setup();

    render(
      <AppLayout>
        {(currentTab) => <div data-testid="view-state">Current: {currentTab}</div>}
      </AppLayout>
    );

    // Initial state should be dashboard
    const viewContainer = screen.getByTestId('view-state');
    expect(viewContainer).toHaveTextContent('Current: dashboard');

    // Click on the patient management option
    const patientButton = screen.getByRole('button', { name: /Patient Management/i });
    await user.click(patientButton);

    // State callback structure should react instantly
    expect(viewContainer).toHaveTextContent('Current: patients');
  });

});