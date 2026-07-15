/**
 * src/test/objective3/NotificationCard.test.jsx
 *
 * Test suite para sa NotificationCard component gamit ang BDD "it/should" pattern.
 * Gumagamit ng tamang relative path patungo sa standalone component (walang database/table link).
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotificationCard } from '../../components/objective3/NotificationCard';

const baseNotification = {
  id: 1,
  userId: 'u1',
  type: 'order_update',
  message: 'Order #1042 has shipped',
  timestamp: '2026-07-15T10:00:00Z',
  displayTime: new Date('2026-07-15T10:00:00Z').toLocaleString(),
};

describe('NotificationCard', () => {
  it('should render the message and formatted display time', () => {
    render(<NotificationCard notification={baseNotification} isNewest={false} />);

    expect(screen.getByText('Order #1042 has shipped')).toBeInTheDocument();
    expect(screen.getByText(baseNotification.displayTime)).toBeInTheDocument();
  });

  it('should render the correct label for each known type', () => {
    const cases = [
      { type: 'order_update', label: 'Order update' },
      { type: 'payment_alert', label: 'Payment alert' },
      { type: 'system_message', label: 'System message' },
    ];

    cases.forEach(({ type, label }) => {
      const { unmount } = render(
        <NotificationCard notification={{ ...baseNotification, type }} isNewest={false} />
      );
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  it('should fall back to the raw type when metadata is unknown', () => {
    render(
      <NotificationCard
        notification={{ ...baseNotification, type: 'mystery_type' }}
        isNewest={false}
      />
    );
    expect(screen.getByText('mystery_type')).toBeInTheDocument();
  });

  it('should mark the card as newest via data-newest when isNewest is true', () => {
    const { container } = render(<NotificationCard notification={baseNotification} isNewest={true} />);
    const card = container.querySelector('.ni-card');
    expect(card).toHaveAttribute('data-newest', 'true');
  });

  it('should mark the card as not newest via data-newest when isNewest is false', () => {
    const { container } = render(<NotificationCard notification={baseNotification} isNewest={false} />);
    const card = container.querySelector('.ni-card');
    expect(card).toHaveAttribute('data-newest', 'false');
  });
});