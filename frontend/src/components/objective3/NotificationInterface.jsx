/**
 * src/components/objective3/NotificationInterface.jsx
 *
 * Deliverable: "notification interface"
 *
 * Ang real, rendered notification UI: isang live timeline feed na may type
 * filters. Ang feed-state hook (real-time push + newest-first sort) ay
 * direkta nang gumagamit ng React useState nang walang database o hiwalay na table layer.
 *
 * Acceptance criteria covered:
 *  - Displays messages in real-time (pushing a notification updates
 *    React state immediately, no refresh needed).
 *  - Feed is sorted newest to oldest.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNotificationTypes, NOTIFICATION_TYPE_META } from "./NotificationTypes";
import { NotificationCard } from "./NotificationCard";

// Helper utility para sa pag-format ng display time
function formatNotification(record) {
  return { ...record, displayTime: new Date(record.timestamp).toLocaleString() };
}

// Helper utility para sa pag-sort mula pinakabago hanggang pinakauna
function sortNewestFirst(records) {
  return [...records].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Custom Hook: useNotificationFeed (Database-Free)
 * Direkta nang gumagawa ng IDs at nag-iimbak ng notifications sa React state.
 */
export function useNotificationFeed() {
  const [feed, setFeed] = useState([]);

  const pushNotification = useCallback((data) => {
    // 1. Validasyon ng uri (tulad ng ginagawa ng table hook dati)
    const validTypes = ['order_update', 'payment_alert', 'system_message'];
    if (data.type && !validTypes.includes(data.type)) {
      throw new Error(`Invalid notification type: ${data.type}`);
    }

    // 2. Validasyon sa mga required fields
    if (!data.userId || !data.message) {
      throw new Error("Missing required fields: userId and message are required.");
    }

    // 3. Pag-generate ng random/unique ID at timestamp kapag wala pa
    const record = {
      id: data.id || `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      type: data.type,
      message: data.message,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    setFeed((prev) => sortNewestFirst([...prev, record]));
    return formatNotification(record);
  }, []);

  const loadFeed = useCallback((userId, initialRecords = []) => {
    const filtered = userId 
      ? initialRecords.filter(r => r.userId === userId) 
      : initialRecords;
    setFeed(sortNewestFirst(filtered));
  }, []);

  return { 
    feed: feed.map(formatNotification), 
    pushNotification, 
    loadFeed 
  };
}

const SAMPLE_MESSAGES = {
  order_update: 'Order #1042 has shipped',
  payment_alert: 'Payment of $59.00 received',
  system_message: 'Scheduled maintenance at 10 PM',
};

export function NotificationInterface({ userId = 'demo-user', initialNotifications = [] }) {
  // Inalis na ang useNotificationTable hook dito
  const types = useNotificationTypes(); 
  const { feed, pushNotification } = useNotificationFeed();
  const [activeFilter, setActiveFilter] = useState('all');
  const seeded = useRef(false);

  // Pag-seed ng mga paunang notifications nang hindi gumagamit ng database table
  useEffect(() => {
    if (seeded.current || initialNotifications.length === 0) return;
    seeded.current = true;
    initialNotifications.forEach(({ type, message, timestamp }) => {
      pushNotification({ userId, type, message, timestamp });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleFeed = useMemo(() => {
    if (activeFilter === 'all') return feed;
    return feed.filter((n) => n.type === activeFilter);
  }, [feed, activeFilter]);

  const newestId = feed[0]?.id;

  function simulateIncoming() {
    const availableTypes = types.getTypes();
    const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    pushNotification({ userId, type, message: SAMPLE_MESSAGES[type] });
  }

  return (
    <div>
      <p className="ni-eyebrow">Live feed</p>
      <h1 className="ni-title">Notifications</h1>

      <div className="ni-filters">
        <button
          className="ni-filter"
          data-active={activeFilter === 'all'}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        {types.getTypes().map((type) => (
          <button
            key={type}
            className="ni-filter"
            data-active={activeFilter === type}
            onClick={() => setActiveFilter(type)}
          >
            {NOTIFICATION_TYPE_META[type].label}
          </button>
        ))}
      </div>

      {visibleFeed.length === 0 ? (
        <p className="ni-empty">No notifications yet.</p>
      ) : (
        <div className="ni-timeline" data-testid="notification-timeline">
          {visibleFeed.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isNewest={notification.id === newestId}
            />
          ))}
        </div>
      )}

      <button className="ni-simulate" onClick={simulateIncoming}>
        Simulate incoming notification
      </button>
    </div>
  );
}

export default NotificationInterface;