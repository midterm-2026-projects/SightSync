/**
 * src/components/objective3/NotificationCard.jsx
 *
 * Presentational sub-component used by NotificationInterface.jsx to
 * render a single timeline entry. Not one of the three counted
 * deliverables — a small supporting piece of the interface.
 */

import React from 'react';
// Palitan ang lumang import nito:
import { NOTIFICATION_TYPE_META } from "./NotificationTypes";

export function NotificationCard({ notification, isNewest }) {
  const meta = NOTIFICATION_TYPE_META[notification.type] || {
    label: notification.type,
    color: '#8b8f99',
  };

  return (
    <div
      className="ni-card"
      data-newest={isNewest ? 'true' : 'false'}
      style={{ '--dot-color': meta.color }}
    >
      <p className="ni-type">{meta.label}</p>
      <p className="ni-message">{notification.message}</p>
      <p className="ni-time">{notification.displayTime}</p>
    </div>
  );
}

export default NotificationCard;