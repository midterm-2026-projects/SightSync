import { useState } from "react";
import { C, RoleBadge, AUTHORIZED_ROLES } from "./receiptConstants";
import { AccessDeniedBanner } from "./compose";

function LogRow({ log, isNew }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      data-testid={`log-row-${log.id}`}
      style={{
        border: `1px solid ${C.border}`, borderRadius: 8,
        overflow: "hidden",
        background: isNew ? "#F0F9FF" : C.surface,
        transition: "background .6s",
      }}
    >
      <button
        data-testid={`log-toggle-${log.id}`}
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", textAlign: "left", background: "none",
          border: "none", cursor: "pointer", padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: C.muted, fontFamily: "monospace", minWidth: 80 }}>
          #{log.id.slice(0, 6)}
        </span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: C.text }}>
          {log.subject}
        </span>
        <RoleBadge role={log.senderRole} />
        <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
        <span style={{ color: C.muted, fontSize: 12 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          data-testid={`log-detail-${log.id}`}
          style={{ padding: "0 16px 14px", borderTop: `1px solid ${C.border}` }}
        >
          <div style={{
            marginTop: 10, display: "grid",
            gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13,
          }}>
            <div><span style={{ color: C.muted }}>Sender: </span><strong>{log.senderName}</strong></div>
            <div>
              <span style={{ color: C.muted }}>Sender ID: </span>
              <code data-testid={`log-sender-id-${log.id}`} style={{ fontSize: 12 }}>
                {log.senderId}
              </code>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <span style={{ color: C.muted }}>Recipients: </span>
              <span data-testid={`log-recipients-${log.id}`}>{log.recipients.join(", ")}</span>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <span style={{ color: C.muted }}>Timestamp: </span>
              <code data-testid={`log-timestamp-${log.id}`} style={{ fontSize: 12 }}>
                {log.timestamp}
              </code>
            </div>
          </div>
          <div
            data-testid={`log-content-${log.id}`}
            style={{
              marginTop: 10, background: C.bg, borderRadius: 6,
              padding: "10px 12px", fontSize: 14, color: C.text, lineHeight: 1.6,
            }}
          >
            {log.content}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CommunicationLogs({ currentUser, logs, newId }) {
  const isAuthorized = AUTHORIZED_ROLES.includes(currentUser?.role);

  if (!isAuthorized) return <AccessDeniedBanner />;

  return (
    <div data-testid="communication-logs">
      {logs.length === 0 ? (
        <div
          data-testid="logs-empty"
          style={{
            textAlign: "center", padding: "48px 0",
            color: C.muted, fontSize: 15,
          }}
        >
          No messages sent yet. Compose your first update.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {logs.map(log => (
            <LogRow key={log.id} log={log} isNew={log.id === newId} />
          ))}
        </div>
      )}
    </div>
  );
}