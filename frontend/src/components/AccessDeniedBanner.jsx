import React from "react";
import { C } from "./receiptConstants";

export function AccessDeniedBanner() {
  return (
    <div
      data-testid="access-denied-banner"
      style={{
        background: "#FFF1F2",
        border: `1.5px solid #FECDD3`,
        borderRadius: 10,
        padding: "20px 24px",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: 22 }}>🚫</span>
      <div>
        <div style={{ fontWeight: 700, color: C?.danger || "#E11D48", marginBottom: 4 }}>
          Access Denied
        </div>
        <div style={{ color: "#7F1D1D", fontSize: 14 }}>
          Only <strong>admin</strong> and <strong>staff</strong> users can access the messaging
          module. Switch to an authorized account to continue.
        </div>
      </div>
    </div>
  );
}