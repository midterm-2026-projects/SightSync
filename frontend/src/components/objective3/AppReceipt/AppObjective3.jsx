/**
 * src/components/objective3/AppReceipt/AppObjective3.jsx
 *
 * Combined Root Component
 * - Notification System (Live Timeline Feed)
 * - Objective 3 (Payments Panel & Stakeholder Updates)
 */

import React, { useMemo, useState } from "react";

// Notification System (Nasa parent folder na "objective3")
import { NotificationInterface } from "../NotificationInterface";
import { NOTIFICATION_TYPES } from "../NotificationTypes";

// Objective 3 Components (Nasa parent folder na "objective3")
import PaymentsPanel from "../PaymentsPanel";
import Compose from "../Compose";
import CommunicationLogs from "../CommunicationLogs";
import { AUTHORIZED_ROLES } from "../receiptConstants";

// -----------------------------------------------------
// Demo Notifications Seed Data
// -----------------------------------------------------
const now = Date.now();

const DEMO_NOTIFICATIONS = [
  {
    type: NOTIFICATION_TYPES.SYSTEM_MESSAGE,
    message: "Scheduled maintenance completed successfully",
    timestamp: new Date(now - 3 * 60000).toISOString(),
  },
  {
    type: NOTIFICATION_TYPES.PAYMENT_ALERT,
    message: "Payment of $59.00 received",
    timestamp: new Date(now - 2 * 60000).toISOString(),
  },
  {
    type: NOTIFICATION_TYPES.ORDER_UPDATE,
    message: "Order #1042 has shipped",
    timestamp: new Date(now - 1 * 60000).toISOString(),
  },
];

// =====================================================
// Main Combined App Component
// =====================================================
export default function AppObjective3() {
  // =======================================
  // Role & Authorization State
  // =======================================
  const [currentUser, setCurrentUser] = useState({
    id: "u-001",
    name: "Admin",
    role: "admin",
  });

  const isAuthorized = useMemo(
    () => AUTHORIZED_ROLES.includes(currentUser?.role),
    [currentUser]
  );

  // =======================================
  // Communication Logs State
  // =======================================
  const [logs, setLogs] = useState([
    {
      id: "log-001",
      subject: "Welcome",
      content: "Objective 3 module is ready.",
      recipients: ["staff", "admin"],
      sender_id: "u-001",
      created_at: new Date().toISOString(),
    },
  ]);

  const [newId, setNewId] = useState(null);

  const handleSend = (payload) => {
    const newLog = {
      id: `log-${Date.now()}`,
      subject: payload.subject,
      content: payload.content,
      recipients: payload.recipients,
      sender_id: currentUser.id,
      created_at: new Date().toISOString(),
    };

    setLogs((prev) => [newLog, ...prev]);
    setNewId(newLog.id);

    // I-clear ang highlight animation marker pagkatapos ng 2.5 segundo
    setTimeout(() => setNewId(null), 2500);
  };

  return (
    <div
      style={{
        display: "grid",
        gap: 24,
        padding: 24,
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* =======================================
          1. Notification Center Section
      ======================================= */}
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <NotificationInterface
          userId="demo-user"
          initialNotifications={DEMO_NOTIFICATIONS}
        />
      </section>

      {/* =======================================
          2. Objective 3 Header & Role Switcher
      ======================================= */}
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                color: "#0f172a",
              }}
            >
              Objective 3 — Transactions & Communication
            </h2>
            <div style={{ marginTop: 6, color: "#64748b", fontSize: 13 }}>
              Payments + Digital Receipts + Stakeholder Updates
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#64748b", fontSize: 13 }}>Role:</span>
            <select
              aria-label="current user role"
              value={currentUser.role}
              onChange={(e) =>
                setCurrentUser((u) => ({ ...u, role: e.target.value }))
              }
              style={{
                padding: "8px 10px",
                border: "1px solid #cbd5e1",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <option value="admin">admin</option>
              <option value="staff">staff</option>
              <option value="customer">customer</option>
            </select>
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                padding: "6px 10px",
                borderRadius: 999,
                border: `1px solid ${isAuthorized ? "#16a34a" : "#dc2626"}`,
                color: isAuthorized ? "#16a34a" : "#dc2626",
                background: isAuthorized ? "#dcfce7" : "#fee2e2",
              }}
            >
              {isAuthorized ? "AUTHORIZED" : "DENIED"}
            </span>
          </div>
        </div>
      </section>

      {/* =======================================
          3. Payments Panel
      ======================================= */}
      <PaymentsPanel />

      {/* =======================================
          4. Stakeholder Communication Section
      ======================================= */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <Compose currentUser={currentUser} onSend={handleSend} />
        <CommunicationLogs
          currentUser={currentUser}
          logs={logs}
          newId={newId}
        />
      </section>
    </div>
  );
}