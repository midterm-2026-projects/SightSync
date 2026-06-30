import { useState } from "react";
import { C, RoleBadge, AUTHORIZED_ROLES } from "./receiptConstants";
import { AccessDeniedBanner } from "./compose";


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