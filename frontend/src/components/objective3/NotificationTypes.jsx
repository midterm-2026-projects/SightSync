/**
 * src/components/objective3/NotificationTypes.jsx
 *
 * Deliverable: "notification types"
 *
 * Fixed set of notification categories, their display metadata
 * (label + accent color, used directly by the UI), and a hook for
 * categorizing/filtering notifications by type nang walang database/table layer.
 *
 * Acceptance criteria covered:
 *  - order_update, payment_alert, system_message are correctly
 *    categorized and retrievable.
 */

import { useCallback } from 'react';

export const NOTIFICATION_TYPES = Object.freeze({
  ORDER_UPDATE: 'order_update',
  PAYMENT_ALERT: 'payment_alert',
  SYSTEM_MESSAGE: 'system_message',
});

export const NOTIFICATION_TYPE_META = Object.freeze({
  [NOTIFICATION_TYPES.ORDER_UPDATE]: { label: 'Order update', color: '#5b8def' },
  [NOTIFICATION_TYPES.PAYMENT_ALERT]: { label: 'Payment alert', color: '#f2a93b' },
  [NOTIFICATION_TYPES.SYSTEM_MESSAGE]: { label: 'System message', color: '#9b7bf0' },
});

export function isValidType(type) {
  return Object.values(NOTIFICATION_TYPES).includes(type);
}

export function useNotificationTypes() {
  const getTypes = useCallback(() => Object.values(NOTIFICATION_TYPES), []);

  const categorize = useCallback((records = []) => {
    const grouped = {};
    Object.values(NOTIFICATION_TYPES).forEach((t) => {
      grouped[t] = [];
    });
    records.forEach((r) => {
      if (isValidType(r.type)) grouped[r.type].push(r);
    });
    return grouped;
  }, []);

  const getByType = useCallback(
    (type, records = []) => {
      if (!isValidType(type)) {
        throw new Error(`Invalid type: ${type}`);
      }
      return records.filter((r) => r.type === type);
    },
    []
  );

  return { getTypes, categorize, getByType };
}

export default NOTIFICATION_TYPES;