import { useState, useCallback } from "react";
import { C, AUTHORIZED_ROLES } from "./receiptConstants";
import { AccessDeniedBanner } from "./AccessDeniedBanner";
import LogRow from "./LogRow";
import Compose from "./Compose";

// Re-export so AppLayout can import both from a single path
export { AccessDeniedBanner };

// Mock sample data para laging may laman ang Communication Logs
const SAMPLE_LOGS = [
  {
    id: "msg-001",
    subject: "Q4 Performance Update",
    content: "The clinic has hit 95% patient satisfaction this quarter. Great work everyone! Let's keep up the momentum for the remaining months.",
    recipients: ["all-staff", "management"],
    senderName: "Dr. Maria Santos",
    senderId: "USR-001",
    senderRole: "admin",
    timestamp: "2025-12-10T09:30:00.000Z",
  },
  {
    id: "msg-002",
    subject: "Inventory Restock Notice",
    content: "Please be advised that optical frames and lens supplies will be restocked on Friday. Kindly coordinate with the logistics team for any urgent requests.",
    recipients: ["inventory-team", "front-desk"],
    senderName: "Juan Dela Cruz",
    senderId: "USR-003",
    senderRole: "staff",
    timestamp: "2025-12-09T14:15:00.000Z",
  },
  {
    id: "msg-003",
    subject: "New Telemedicine Partnership",
    content: "We have officially partnered with HealthConnect Telemedicine to offer virtual consultations starting next month. Training sessions will be scheduled soon.",
    recipients: ["all-staff", "doctors"],
    senderName: "Dr. Maria Santos",
    senderId: "USR-001",
    senderRole: "admin",
    timestamp: "2025-12-08T11:00:00.000Z",
  },
  {
    id: "msg-004",
    subject: "Updated Clinic Hours for Holidays",
    content: "Please note the adjusted clinic hours for the upcoming holidays: Dec 24-25 (closed), Dec 31 (9AM-3PM), Jan 1 (closed). Thank you for your understanding.",
    recipients: ["all-staff"],
    senderName: "Ana Reyes",
    senderId: "USR-005",
    senderRole: "staff",
    timestamp: "2025-12-07T16:45:00.000Z",
  },
  {
    id: "msg-005",
    subject: "IT System Upgrade Reminder",
    content: "The clinic management system will undergo maintenance on Dec 15 from 2AM to 5AM. Please save all work before logging off.",
    recipients: ["all-staff", "management"],
    senderName: "IT Support",
    senderId: "USR-008",
    senderRole: "staff",
    timestamp: "2025-12-06T08:20:00.000Z",
  },
];

export default function CommunicationLogs() {
  const [currentUser] = useState({ id: "USR-001", name: "Dr. Maria Santos", role: "admin" });
  const [logs, setLogs] = useState(SAMPLE_LOGS);
  const [showCompose, setShowCompose] = useState(false);

  const isAuthorized = AUTHORIZED_ROLES.includes(currentUser?.role);

  const handleSend = useCallback(({ subject, content, recipients }) => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      subject,
      content,
      recipients,
      senderName: currentUser.name,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [newMsg, ...prev]);
    setShowCompose(false);
  }, [currentUser]);

  if (!isAuthorized) {
    return <AccessDeniedBanner />;
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 4px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: C.text }}>
            Communication Logs
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.muted }}>
            {logs.length} message{logs.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 12,
              color: C.muted,
              background: C.bg,
              padding: "4px 12px",
              borderRadius: 20,
            }}
          >
            Sorted by newest first
          </span>
          <button
            onClick={() => setShowCompose((v) => !v)}
            style={{
              background: showCompose ? C.danger : C.primary,
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background .2s",
            }}
          >
            {showCompose ? "Cancel" : "+ New Message"}
          </button>
        </div>
      </div>

      {/* Compose Panel */}
      {showCompose && (
        <div style={{ marginBottom: 20 }}>
          <Compose currentUser={currentUser} onSend={handleSend} />
        </div>
      )}

      {/* Log List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {logs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: C.muted,
              fontSize: 14,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
            }}
          >
            No communication logs available.
          </div>
        ) : (
          logs.map((log, index) => (
            <LogRow key={log.id} log={log} isNew={index === 0} />
          ))
        )}
      </div>
    </div>
  );
}
