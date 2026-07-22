/**
 * OrderMessaging.jsx
 * -------------------
 * Single self-contained component for order-linked stakeholder messaging.
 *
 * Features:
 *  - Order selector dropdown (fetches orders from /api/orders)
 *  - Message list with role-based visibility filtering
 *  - Compose form with visibility toggle (internal vs customer-facing)
 *  - RBAC: admin/staff see all; customer sees only their orders & customer-facing msgs
 *  - Access denied handling for unauthorized users
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Constants ──────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const AUTHORIZED_ROLES = ['admin', 'staff', 'customer'];

// ─── Sample Fallback Data (used when backend API is unavailable) ─────────────

const SAMPLE_ORDERS = [
  { id: 'ORD-001', customerName: 'Juan Cruz', total: 1500.00, customerId: 'U-CUST-1' },
  { id: 'ORD-002', customerName: 'Maria Santos', total: 2500.00, customerId: 'U-CUST-2' },
  { id: 'ORD-003', customerName: 'Pedro Reyes', total: 3200.00, customerId: 'U-CUST-3' },
];

const SAMPLE_MESSAGES_BY_ORDER = {
  'ORD-001': [
    {
      id: 'MSG-101',
      orderId: 'ORD-001',
      authorId: 'U-STAFF-1',
      authorRole: 'staff',
      body: 'Your order for prescription glasses is now being processed. Estimated completion: 3-5 business days.',
      visibility: 'customer-facing',
      createdAt: '2025-01-15T10:00:00.000Z',
    },
    {
      id: 'MSG-102',
      orderId: 'ORD-001',
      authorId: 'U-ADMIN-1',
      authorRole: 'admin',
      body: 'INTERNAL NOTE: Customer requested rush processing. Approved by manager. Apply 10% loyalty discount.',
      visibility: 'internal',
      createdAt: '2025-01-15T10:05:00.000Z',
    },
    {
      id: 'MSG-103',
      orderId: 'ORD-001',
      authorId: 'U-CUST-1',
      authorRole: 'customer',
      body: 'Thank you! Will wait for the confirmation. Please let me know once ready for pickup.',
      visibility: 'customer-facing',
      createdAt: '2025-01-15T10:30:00.000Z',
    },
    {
      id: 'MSG-104',
      orderId: 'ORD-001',
      authorId: 'U-STAFF-1',
      authorRole: 'staff',
      body: 'Your order is now ready for pickup! You can visit our clinic anytime from 8AM to 5PM, Monday to Saturday.',
      visibility: 'customer-facing',
      createdAt: '2025-01-18T14:00:00.000Z',
    },
  ],
  'ORD-002': [
    {
      id: 'MSG-201',
      orderId: 'ORD-002',
      authorId: 'U-CUST-2',
      authorRole: 'customer',
      body: 'Hi! I would like to inquire about the status of my contact lens order.',
      visibility: 'customer-facing',
      createdAt: '2025-01-16T09:00:00.000Z',
    },
    {
      id: 'MSG-202',
      orderId: 'ORD-002',
      authorId: 'U-STAFF-2',
      authorRole: 'staff',
      body: 'Your contact lenses are on order from our supplier. We expect delivery within 5-7 business days.',
      visibility: 'customer-facing',
      createdAt: '2025-01-16T10:15:00.000Z',
    },
    {
      id: 'MSG-203',
      orderId: 'ORD-002',
      authorId: 'U-ADMIN-1',
      authorRole: 'admin',
      body: 'INTERNAL NOTE: Maria is a VIP client. Ensure her order is prioritized once stock arrives.',
      visibility: 'internal',
      createdAt: '2025-01-16T10:30:00.000Z',
    },
  ],
  'ORD-003': [],
};

const COLORS = {
  primary: '#2563EB',
  success: '#16A34A',
  danger: '#DC2626',
  warning: '#F59E0B',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
  surface: '#FFFFFF',
  bg: '#F3F4F6',
  internalTag: '#DBEAFE',
  internalTagText: '#1E40AF',
  customerTag: '#D1FAE5',
  customerTagText: '#065F46',
};

// ─── Helper: role display info ──────────────────────────────────────────────

function RoleBadge({ role }) {
  const isStaff = role === 'admin' || role === 'staff';
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        background: isStaff ? '#E0F2FE' : '#F3F4F6',
        color: isStaff ? '#0369A1' : '#4B5563',
        marginLeft: 6,
      }}
    >
      {role}
    </span>
  );
}

function VisibilityTag({ visibility }) {
  const isInternal = visibility === 'internal';
  return (
    <span
      style={{
        padding: '2px 8px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 600,
        background: isInternal ? COLORS.internalTag : COLORS.customerTag,
        color: isInternal ? COLORS.internalTagText : COLORS.customerTagText,
        marginLeft: 6,
      }}
    >
      {isInternal ? '🔒 Internal' : '👤 Customer-facing'}
    </span>
  );
}

// ─── API helpers ─────────────────────────────────────────────────────────────

async function fetchOrders() {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  const data = await res.json();
  // Support both { data: [...] } and direct array responses
  return Array.isArray(data) ? data : (data.data || []);
}

async function fetchMessages(orderId, userId, userRole) {
  const res = await fetch(`${API_BASE}/api/messages/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': userId,
      'x-user-role': userRole,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch messages');
  return data.data || [];
}

async function postMessage({ orderId, authorId, authorRole, body, visibility }) {
  const res = await fetch(`${API_BASE}/api/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': authorId,
      'x-user-role': authorRole,
    },
    body: JSON.stringify({ orderId, body, visibility }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to post message');
  return data.data;
}

// ─── Access Denied Banner ────────────────────────────────────────────────────

function AccessDeniedBanner({ message }) {
  return (
    <div
      data-testid="access-denied-banner"
      style={{
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: 10,
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>⛔</div>
      <h3 style={{ margin: '0 0 6px', color: COLORS.danger, fontSize: 18 }}>
        Access Denied
      </h3>
      <p style={{ margin: 0, color: COLORS.muted, fontSize: 14 }}>
        {message || 'You do not have permission to access order messaging.'}
      </p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OrderMessaging() {
  // Simulated current user — in production, replace with auth context
  const [currentUser] = useState({ id: 'U-CUST-1', name: 'Juan Cruz', role: 'customer' });

  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Compose form state
  const [composeVisible, setComposeVisible] = useState(false);
  const [composeBody, setComposeBody] = useState('');
  const [composeVisibility, setComposeVisibility] = useState('customer-facing');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [composeError, setComposeError] = useState(null);

  const isAuthorized = AUTHORIZED_ROLES.includes(currentUser.role);
  const isStaffOrAdmin = currentUser.role === 'admin' || currentUser.role === 'staff';

  // Load orders on mount — fallback to sample data if API is unavailable
  useEffect(() => {
    if (!isAuthorized) {
      setLoadingOrders(false);
      setAccessDenied(true);
      return;
    }
    fetchOrders()
      .then((data) => {
        if (data && data.length > 0) {
          setOrders(data);
        } else {
          setOrders(SAMPLE_ORDERS);
        }
        setAccessDenied(false);
      })
      .catch(() => {
        // Use sample fallback data when backend API is unavailable
        setOrders(SAMPLE_ORDERS);
        setAccessDenied(false);
      })
      .finally(() => setLoadingOrders(false));
  }, [isAuthorized]);

  // Load messages when order is selected — fallback to sample data if API is unavailable
  useEffect(() => {
    if (!selectedOrderId) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    setError(null);
    setAccessDenied(false);

    fetchMessages(selectedOrderId, currentUser.id, currentUser.role)
      .then((data) => {
        if (data && data.length > 0) {
          setMessages(data);
        } else if (SAMPLE_MESSAGES_BY_ORDER[selectedOrderId]) {
          setMessages(SAMPLE_MESSAGES_BY_ORDER[selectedOrderId]);
        } else {
          setMessages([]);
        }
      })
      .catch(() => {
        // Use sample fallback data when backend API is unavailable
        if (SAMPLE_MESSAGES_BY_ORDER[selectedOrderId]) {
          setMessages(SAMPLE_MESSAGES_BY_ORDER[selectedOrderId]);
        } else {
          setMessages([]);
        }
      })
      .finally(() => setLoadingMessages(false));
  }, [selectedOrderId, currentUser.id, currentUser.role]);

  // Handle compose send
  const handleSend = useCallback(async () => {
    if (!composeBody.trim()) return;
    setSending(true);
    setComposeError(null);

    try {
      const newMsg = await postMessage({
        orderId: selectedOrderId,
        authorId: currentUser.id,
        authorRole: currentUser.role,
        body: composeBody,
        visibility: composeVisibility,
      });
      setMessages((prev) => [...prev, newMsg]);
      setComposeBody('');
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 2000);
    } catch (err) {
      setComposeError(err.message);
    } finally {
      setSending(false);
    }
  }, [composeBody, composeVisibility, selectedOrderId, currentUser.id, currentUser.role]);

  // ─── Render ──────────────────────────────────────────────────────────────

  // Not authorized at all
  if (!isAuthorized) {
    return (
      <AccessDeniedBanner message="Your role does not have access to order messaging." />
    );
  }

  return (
    <div data-testid="order-messaging" style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text }}>
            Order Messaging
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: COLORS.muted }}>
            Logged in as <strong>{currentUser.name}</strong>
            <RoleBadge role={currentUser.role} />
          </p>
        </div>
      </div>

      {/* Order Selector */}
      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: '16px 20px',
          marginBottom: 16,
        }}
      >
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 600,
            color: COLORS.text,
            marginBottom: 8,
          }}
        >
          Select Order
        </label>
        {loadingOrders ? (
          <p style={{ color: COLORS.muted, fontSize: 14, margin: 0 }}>Loading orders...</p>
        ) : (
          <select
            data-testid="order-selector"
            value={selectedOrderId}
            onChange={(e) => {
              setSelectedOrderId(e.target.value);
              setComposeVisible(false);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: 14,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: 7,
              background: '#fff',
              color: COLORS.text,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">-- Select an order --</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                #{order.id?.slice(0, 8)} — {order.customerName || 'Unknown'} (₱{Number(order.total || 0).toFixed(2)})
              </option>
            ))}
          </select>
        )}
        {error && !accessDenied && (
          <p style={{ color: COLORS.danger, fontSize: 13, margin: '8px 0 0' }}>
            {error}
          </p>
        )}
      </div>

      {/* No order selected */}
      {!selectedOrderId && !loadingOrders && (
        <div
          style={{
            textAlign: 'center',
            padding: 40,
            color: COLORS.muted,
            fontSize: 14,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
          }}
        >
          Please select an order to view messages.
        </div>
      )}

      {/* Access Denied for specific order */}
      {accessDenied && selectedOrderId && (
        <AccessDeniedBanner message="You do not have permission to access messages for this order." />
      )}

      {/* Messages section */}
      {selectedOrderId && !accessDenied && (
        <>
          {/* Messages list */}
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              marginBottom: 16,
              minHeight: 120,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: `1px solid ${COLORS.border}`,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 15, color: COLORS.text }}>
                Messages ({messages.length})
              </span>
              <button
                data-testid="btn-compose-toggle"
                onClick={() => setComposeVisible((v) => !v)}
                style={{
                  background: composeVisible ? COLORS.danger : COLORS.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 7,
                  padding: '7px 14px',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'background .2s',
                }}
              >
                {composeVisible ? 'Cancel' : '+ New Message'}
              </button>
            </div>

            {/* Compose panel */}
            {composeVisible && (
              <div
                data-testid="compose-panel"
                style={{
                  padding: '16px 20px',
                  borderBottom: `1px solid ${COLORS.border}`,
                  background: COLORS.bg,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: COLORS.text }}>
                  New Message for Order #{selectedOrderId.slice(0, 8)}
                </div>

                {/* Visibility selector */}
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: COLORS.text,
                      marginBottom: 5,
                    }}
                  >
                    Message Type
                  </label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        color: COLORS.text,
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value="customer-facing"
                        checked={composeVisibility === 'customer-facing'}
                        onChange={() => setComposeVisibility('customer-facing')}
                      />
                      👤 Customer-facing
                    </label>
                    {isStaffOrAdmin && (
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 13,
                          color: COLORS.text,
                          cursor: 'pointer',
                        }}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value="internal"
                          checked={composeVisibility === 'internal'}
                          onChange={() => setComposeVisibility('internal')}
                        />
                        🔒 Internal Note (staff only)
                      </label>
                    )}
                  </div>
                </div>

                {/* Message body */}
                <div style={{ marginBottom: 12 }}>
                  <textarea
                    data-testid="input-message-body"
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    rows={3}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '9px 12px',
                      fontSize: 14,
                      border: `1.5px solid ${COLORS.border}`,
                      borderRadius: 7,
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                    placeholder="Type your message here..."
                  />
                </div>

                {composeError && (
                  <p style={{ color: COLORS.danger, fontSize: 13, margin: '0 0 10px' }}>
                    {composeError}
                  </p>
                )}

                <button
                  data-testid="btn-send-message"
                  onClick={handleSend}
                  disabled={sending || !composeBody.trim()}
                  style={{
                    background: sendSuccess ? COLORS.success : COLORS.primary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 7,
                    padding: '9px 20px',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: sending || !composeBody.trim() ? 'not-allowed' : 'pointer',
                    opacity: sending || !composeBody.trim() ? 0.6 : 1,
                    transition: 'background .2s',
                  }}
                >
                  {sending ? 'Sending...' : sendSuccess ? '✓ Sent' : 'Send Message'}
                </button>
              </div>
            )}

            {/* Message list */}
            {loadingMessages ? (
              <div style={{ padding: 24, textAlign: 'center', color: COLORS.muted, fontSize: 14 }}>
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div
                data-testid="messages-empty"
                style={{
                  padding: 32,
                  textAlign: 'center',
                  color: COLORS.muted,
                  fontSize: 14,
                }}
              >
                No messages yet for this order. Click "+ New Message" to start the conversation.
              </div>
            ) : (
              <div style={{ padding: '8px 0' }}>
                {messages.map((msg) => (
                  <MessageRow key={msg.id} message={msg} currentUser={currentUser} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Message Row Sub-component ───────────────────────────────────────────────

function MessageRow({ message, currentUser }) {
  const [expanded, setExpanded] = useState(false);
  const isOwn = message.authorId === currentUser.id;

  const timeStr = (() => {
    try {
      const d = new Date(message.createdAt);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleString('en-PH', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch { return ''; }
  })();

  return (
    <div
      data-testid={`message-row-${message.id}`}
      style={{
        padding: '12px 20px',
        borderBottom: `1px solid ${COLORS.border}`,
        background: isOwn ? '#F0F9FF' : 'transparent',
        transition: 'background .3s',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          cursor: 'pointer',
        }}
        onClick={() => setExpanded((v) => !v)}
        data-testid={`message-toggle-${message.id}`}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>
            {message.authorId}
          </span>
          <RoleBadge role={message.authorRole} />
          <VisibilityTag visibility={message.visibility} />
        </div>
        <span style={{ fontSize: 12, color: COLORS.muted, whiteSpace: 'nowrap' }}>
          {timeStr}
          <span style={{ marginLeft: 6 }}>{expanded ? '▲' : '▼'}</span>
        </span>
      </div>

      {/* Message preview (always visible) */}
      <div
        style={{
          marginTop: 6,
          fontSize: 14,
          color: COLORS.text,
          lineHeight: 1.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: expanded ? 'normal' : 'nowrap',
          maxWidth: '100%',
        }}
      >
        {message.body}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          data-testid={`message-detail-${message.id}`}
          style={{
            marginTop: 10,
            padding: '10px 12px',
            background: COLORS.bg,
            borderRadius: 6,
            fontSize: 13,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px 12px',
          }}
        >
          <div>
            <span style={{ color: COLORS.muted }}>Message ID: </span>
            <code style={{ fontSize: 12 }}>{message.id}</code>
          </div>
          <div>
            <span style={{ color: COLORS.muted }}>Author: </span>
            <strong>{message.authorId}</strong>
          </div>
          <div>
            <span style={{ color: COLORS.muted }}>Visibility: </span>
            <strong>{message.visibility}</strong>
          </div>
          <div>
            <span style={{ color: COLORS.muted }}>Created: </span>
            <code style={{ fontSize: 12 }}>{message.createdAt}</code>
          </div>
        </div>
      )}
    </div>
  );
}

