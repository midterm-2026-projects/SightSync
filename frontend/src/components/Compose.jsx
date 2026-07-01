import React, { useState } from "react";
import { C, AUTHORIZED_ROLES } from "./receiptConstants";
import { AccessDeniedBanner } from "./AccessDeniedBanner";

// Re-export the isolated component so the unchanged test import path remains valid
export { AccessDeniedBanner };

function inputStyle(hasError) {
  return {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 12px",
    fontSize: 14,
    border: `1.5px solid ${hasError ? C.danger : C.border}`,
    borderRadius: 7,
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
    background: hasError ? "#FFF5F5" : "#fff",
  };
}

export default function Compose({ currentUser, onSend }) {
  const [subject, setSubject]       = useState("");
  const [content, setContent]       = useState("");
  const [recipients, setRecipients] = useState("");
  const [errors, setErrors]         = useState({});
  const [sent, setSent]             = useState(false);

  const isAuthorized = AUTHORIZED_ROLES.includes(currentUser?.role);

  function validate() {
    const e = {};
    if (!subject.trim())    e.subject    = "Subject is required.";
    if (!content.trim())    e.content    = "Message content is required.";
    if (!recipients.trim()) e.recipients = "At least one recipient is required.";
    return e;
  }

  function handleSend() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    if (onSend) {
      onSend({
        subject:    subject.trim(),
        content:    content.trim(),
        recipients: recipients.split(",").map(r => r.trim()).filter(Boolean),
      });
    }
    
    setSubject(""); setContent(""); setRecipients(""); setErrors({});
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  }

  if (!isAuthorized) return <AccessDeniedBanner />;

  return (
    <div
      data-testid="compose-panel"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: 24,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20, color: C.text }}>
        New Stakeholder Update
      </div>

      {/* Subject */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>
          Subject
        </label>
        <input
          data-testid="input-subject"
          value={subject}
          onChange={e => { setSubject(e.target.value); setErrors(v => ({ ...v, subject: null })); }}
          style={inputStyle(errors.subject)}
          placeholder="e.g. Q3 Milestone Update"
        />
        {errors.subject && (
          <div data-testid="error-subject" style={{ color: C.danger, fontSize: 12, marginTop: 4 }}>
            {errors.subject}
          </div>
        )}
      </div>

      {/* Recipients */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>
          Recipients <span style={{ color: C.muted, fontWeight: 400 }}>(comma-separated)</span>
        </label>
        <input
          data-testid="input-recipients"
          value={recipients}
          onChange={e => { setRecipients(e.target.value); setErrors(v => ({ ...v, recipients: null })); }}
          style={inputStyle(errors.recipients)}
          placeholder="e.g. board, investors, partners"
        />
        {errors.recipients && (
          <div data-testid="error-recipients" style={{ color: C.danger, fontSize: 12, marginTop: 4 }}>
            {errors.recipients}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 5 }}>
          Message
        </label>
        <textarea
          data-testid="input-content"
          value={content}
          onChange={e => { setContent(e.target.value); setErrors(v => ({ ...v, content: null })); }}
          rows={4}
          style={inputStyle(errors.content)}
          placeholder="Write your update here…"
        />
        {errors.content && (
          <div data-testid="error-content" style={{ color: C.danger, fontSize: 12, marginTop: 4 }}>
            {errors.content}
          </div>
        )}
      </div>

      <button
        data-testid="btn-send"
        onClick={handleSend}
        style={{
          background: sent ? C.success : C.primary,
          color: "#fff", border: "none", borderRadius: 7,
          padding: "10px 22px", fontWeight: 700, fontSize: 14,
          cursor: "pointer", width: "100%", transition: "background .2s",
        }}
      >
        {sent ? "✓ Sent" : "Send Update"}
      </button>
    </div>
  );
}