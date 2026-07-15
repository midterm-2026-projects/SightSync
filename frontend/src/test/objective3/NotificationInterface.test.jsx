/**
 * src/test/objective3/NotificationInterface.test.jsx
 * 
 * Test suite para sa NotificationInterface component nang walang database connection.
 * Sinisiguro nito na gumagana ang real-time push, sorting (newest-first), at filtering
 * gamit ang direct React state implementation.
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationInterface } from '../../components/objective3/NotificationInterface';

function getCardMessages() {
  const timeline = screen.getByTestId('notification-timeline');
  return within(timeline)
    .getAllByText(/.*/, { selector: '.ni-message' })
    .map((el) => el.textContent);
}

describe('NotificationInterface - real-time, sorted UI', () => {
  it('should render seeded notifications sorted from newest to oldest', () => {
    const now = Date.now();
    render(
      <NotificationInterface
        initialNotifications={[
          { type: 'order_update', message: 'first', timestamp: new Date(now - 3000).toISOString() },
          { type: 'payment_alert', message: 'second', timestamp: new Date(now - 1000).toISOString() },
          { type: 'system_message', message: 'third', timestamp: new Date(now - 2000).toISOString() },
        ]}
      />
    );

    expect(getCardMessages()).toEqual(['second', 'third', 'first']);
  });

  it('should show a real-time update when a notification is simulated, without a page reload', async () => {
    const user = userEvent.setup();
    render(<NotificationInterface />);

    expect(screen.getByText('No notifications yet.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /simulate incoming notification/i }));

    expect(screen.queryByText('No notifications yet.')).not.toBeInTheDocument();
    const timeline = screen.getByTestId('notification-timeline');
    expect(within(timeline).getAllByText(/.*/, { selector: '.ni-message' })).toHaveLength(1);
  });

  it('should insert newly simulated notifications at the top (newest first)', async () => {
    const user = userEvent.setup();
    const now = Date.now();
    render(
      <NotificationInterface
        initialNotifications={[
          { type: 'order_update', message: 'older one', timestamp: new Date(now - 5000).toISOString() },
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: /simulate incoming notification/i }));

    const messages = getCardMessages();
    expect(messages).toHaveLength(2);
    expect(messages[messages.length - 1]).toBe('older one');
  });

  it('should only show notifications of that type when filtering', async () => {
    const user = userEvent.setup();
    const now = Date.now();
    render(
      <NotificationInterface
        initialNotifications={[
          { type: 'order_update', message: 'order msg', timestamp: new Date(now - 2000).toISOString() },
          { type: 'payment_alert', message: 'payment msg', timestamp: new Date(now - 1000).toISOString() },
        ]}
      />
    );

    await user.click(screen.getByRole('button', { name: /payment alert/i }));

    expect(screen.getByText('payment msg')).toBeInTheDocument();
    expect(screen.queryByText('order msg')).not.toBeInTheDocument();
  });
});