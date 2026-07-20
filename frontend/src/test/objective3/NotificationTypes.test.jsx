/**
 * src/test/objective3/NotificationTypes.test.jsx
 *
 * Test suite para sa NotificationTypes utility nang walang NotificationTable.
 * Gumagamit na lamang ito ng pure JavaScript data arrays para sa pagsusuri.
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useNotificationTypes, NOTIFICATION_TYPES } from '../../components/objective3/NotificationTypes';

// Mock notifications array na katumbas ng nilalaman ng table dati
const mockNotifications = [
  { id: 1, userId: 'u1', type: 'order_update', message: 'Order shipped', timestamp: '2026-07-15T10:00:00Z' },
  { id: 2, userId: 'u1', type: 'payment_alert', message: 'Payment ok', timestamp: '2026-07-15T10:01:00Z' },
  { id: 3, userId: 'u2', type: 'system_message', message: 'Maintenance window', timestamp: '2026-07-15T10:02:00Z' },
  { id: 4, userId: 'u2', type: 'order_update', message: 'Order delivered', timestamp: '2026-07-15T10:03:00Z' },
];

function setup() {
  const { result: typesResult } = renderHook(() => useNotificationTypes());
  return { typesResult };
}

describe('NotificationTypes - categorization', () => {
  it('should expose exactly the three required types', () => {
    const { typesResult } = setup();
    const types = typesResult.current.getTypes();
    expect(types).toEqual(expect.arrayContaining(['order_update', 'payment_alert', 'system_message']));
    expect(types.length).toBe(3);
  });

  it('should categorize notifications by type correctly', () => {
    const { typesResult } = setup();
    const grouped = typesResult.current.categorize(mockNotifications);
    expect(grouped[NOTIFICATION_TYPES.ORDER_UPDATE]).toHaveLength(2);
    expect(grouped[NOTIFICATION_TYPES.PAYMENT_ALERT]).toHaveLength(1);
    expect(grouped[NOTIFICATION_TYPES.SYSTEM_MESSAGE]).toHaveLength(1);
  });

  it('should retrieve notifications filtered by a specific type', () => {
    const { typesResult } = setup();
    const orderUpdates = typesResult.current.getByType('order_update', mockNotifications);
    expect(orderUpdates).toHaveLength(2);
    orderUpdates.forEach((n) => expect(n.type).toBe('order_update'));
  });

  it('should throw when looking up an invalid type', () => {
    const { typesResult } = setup();
    // Dapat magbato pa rin ng error kapag hindi valid ang type kahit walang database
    expect(() => typesResult.current.getByType('bogus_type', mockNotifications)).toThrow();
  });
});