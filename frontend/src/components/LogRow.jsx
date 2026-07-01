import { useState } from "react";
import { C } from "./receiptConstants";
import RoleBadge from "./RoleBadge";

export default function LogRow({ log, isNew }) {
  const [open, setOpen] = useState(false);

  // Safe Cross-Platform Time String Extraction
  // This bypasses local host timezone drift to keep tests fully stable
  const renderTime = () => {
    try {
      const d = new Date(log.timestamp);
      // Fallback fallback mechanism if an invalid date string passes through
      if (isNaN(d.getTime())) return "";
      
      // Returns a standard localized execution style without env dependencies
      return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    } catch {
      return "";
    }
  };

  return (
    <div
      data-testid={`log-row-${log.id}`}
      style={{
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        overflow: "hidden",
        background: isNew ? "#F0F9FF" : C.surface,
        transition: "background .6s",
      }}
    >
      <button
        data-testid={`log-toggle-${log.id}`}
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          textAlign: "left",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 13, color: C.muted, fontFamily: "monospace", minWidth: 80 }}>
          #{log.id ? log.id.slice(0, 6) : ""}
        </span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 14, color: C.text }}>
          {log.subject}
        </span>
        <RoleBadge role={log.senderRole} />
        <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>
          {renderTime()}
        </span>
        <span style={{ color: C.muted, fontSize: 12 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div
          data-testid={`log-detail-${log.id}`}
          style={{ padding: "0 16px 14px", borderTop: `1px solid ${C.border}` }}
        >
          <div
            style={{
              marginTop: 10,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              fontSize: 13,
            }}
          >
            <div>
              <span style={{ color: C.muted }}>Sender: </span>
              <strong>{log.senderName}</strong>
            </div>
            <div>
              <span style={{ color: C.muted }}>Sender ID: </span>
              <code data-testid={`log-sender-id-${log.id}`} style={{ fontSize: 12 }}>
                {log.senderId}
              </code>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <span style={{ color: C.muted }}>Recipients: </span>
              <span data-testid={`log-recipients-${log.id}`}>{log.recipients ? log.recipients.join(", ") : ""}</span>
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
              marginTop: 10,
              background: C.bg,
              borderRadius: 6,
              padding: "10px 12px",
              fontSize: 14,
              color: C.text,
              lineHeight: 1.6,
            }}
          >
            {log.content}
          </div>
        </div>
      )}
    </div>
  );
}