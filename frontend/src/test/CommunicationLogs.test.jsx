// src/test/CommunicationLogs.test.jsx
import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import '@testing-library/jest-dom';
import CommunicationLogs from "../components/CommunicationLogs";

const adminUser  = { id: "u1", name: "Alice Admin",   role: "admin" };
const staffUser  = { id: "u2", name: "Sam Staff",     role: "staff" };
const guestUser  = { id: "u3", name: "Gary Guest",    role: "guest" };
const viewerUser = { id: "u4", name: "Victor Viewer", role: "viewer" };

function makeLog(overrides = {}) {
  return {
    id:         "abc123xy",
    senderId:   "u1",
    senderName: "Alice Admin",
    senderRole: "admin",
    subject:    "Q3 Milestone Update",
    content:    "All milestones are on track for Q3 delivery.",
    recipients: ["board", "investors"],
    timestamp:  new Date("2024-06-01T10:30:00.000Z").toISOString(),
    ...overrides,
  };
}

// Stateful Test Wrapper aligning with the TestFormWrapper pattern
const TestLogsWrapper = ({ currentUser, initialLogs = [], initialNewId = null }) => {
  const [logs] = useState(initialLogs);
  const [newId] = useState(initialNewId);

  return (
    <CommunicationLogs 
      currentUser={currentUser} 
      logs={logs} 
      newId={newId} 
    />
  );
};

// ─── AC1: Authorized roles can view logs ─────────────────────────────────────

describe("CommunicationLogs — AC1: authorized roles can view logs", () => {
  it("renders the logs panel for an admin user", () => {
    render(<TestLogsWrapper currentUser={adminUser} initialLogs={[]} />);
    expect(screen.getByTestId("communication-logs")).toBeInTheDocument();
  });

  it("renders the logs panel for a staff user", () => {
    render(<TestLogsWrapper currentUser={staffUser} initialLogs={[]} />);
    expect(screen.getByTestId("communication-logs")).toBeInTheDocument();
  });

  it("shows an empty state message when no logs exist", () => {
    render(<TestLogsWrapper currentUser={adminUser} initialLogs={[]} />);
    expect(screen.getByTestId("logs-empty")).toBeInTheDocument();
  });

  it("renders a log row for each log entry", () => {
    const logs = [makeLog({ id: "log001" }), makeLog({ id: "log002" })];
    render(<TestLogsWrapper currentUser={adminUser} initialLogs={logs} />);
    expect(screen.getByTestId("log-row-log001")).toBeInTheDocument();
    expect(screen.getByTestId("log-row-log002")).toBeInTheDocument();
  });

  it("renders the log subject in the row header", () => {
    const log = makeLog();
    render(<TestLogsWrapper currentUser={adminUser} initialLogs={[log]} />);
    expect(screen.getByText("Q3 Milestone Update")).toBeInTheDocument();
  });
});

// ─── AC2: Unauthorized users are blocked ─────────────────────────────────────

describe("CommunicationLogs — AC2: unauthorized users are blocked", () => {
  it("shows the Access Denied banner and hides logs for a guest user", () => {
    render(<TestLogsWrapper currentUser={guestUser} initialLogs={[makeLog()]} />);
    expect(screen.getByTestId("access-denied-banner")).toBeInTheDocument();
    expect(screen.queryByTestId("communication-logs")).not.toBeInTheDocument();
  });

  it("shows the Access Denied banner for a viewer user", () => {
    render(<TestLogsWrapper currentUser={viewerUser} initialLogs={[makeLog()]} />);
    expect(screen.getByTestId("access-denied-banner")).toBeInTheDocument();
  });

  it("prevents rendering of any log rows for a guest user even when logs are passed in", () => {
    const logs = [makeLog({ id: "log001" })];
    render(<TestLogsWrapper currentUser={guestUser} initialLogs={logs} />);
    expect(screen.queryByTestId("log-row-log001")).not.toBeInTheDocument();
  });
});

// ─── AC3: Logs contain timestamp, senderId, and content ──────────────────────

describe("CommunicationLogs — AC3: stored logs contain timestamp, senderId, and content", () => {
  function renderAndOpen(log) {
    render(<TestLogsWrapper currentUser={adminUser} initialLogs={[log]} />);
    fireEvent.click(screen.getByTestId(`log-toggle-${log.id}`));
  }

  it("displays the sender ID in the expanded log row", () => {
    const log = makeLog();
    renderAndOpen(log);
    expect(screen.getByTestId(`log-sender-id-${log.id}`)).toHaveTextContent("u1");
  });

  it("displays a valid ISO timestamp in the expanded log row", () => {
    const log = makeLog();
    renderAndOpen(log);
    const ts = screen.getByTestId(`log-timestamp-${log.id}`).textContent;
    expect(() => new Date(ts).toISOString()).not.toThrow();
    expect(new Date(ts).toISOString()).toBe(log.timestamp);
  });

  it("displays the full message content in the expanded log row", () => {
    const log = makeLog();
    renderAndOpen(log);
    expect(screen.getByTestId(`log-content-${log.id}`)).toHaveTextContent(log.content);
  });

  it("displays the recipients in the expanded log row", () => {
    const log = makeLog();
    renderAndOpen(log);
    expect(screen.getByTestId(`log-recipients-${log.id}`)).toHaveTextContent("board, investors");
  });

  it("hides the log detail by default and shows it after toggling", () => {
    const log = makeLog();
    render(<TestLogsWrapper currentUser={adminUser} initialLogs={[log]} />);
    expect(screen.queryByTestId(`log-detail-${log.id}`)).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId(`log-toggle-${log.id}`));
    expect(screen.getByTestId(`log-detail-${log.id}`)).toBeInTheDocument();
  });

  it("renders all logs when multiple entries are present", () => {
    const logs = [
      makeLog({ id: "x1", subject: "Update Alpha" }),
      makeLog({ id: "x2", subject: "Update Beta" }),
      makeLog({ id: "x3", subject: "Update Gamma" }),
    ];
    render(<TestLogsWrapper currentUser={adminUser} initialLogs={logs} />);
    expect(screen.getByText("Update Alpha")).toBeInTheDocument();
    expect(screen.getByText("Update Beta")).toBeInTheDocument();
    expect(screen.getByText("Update Gamma")).toBeInTheDocument();
  });

  it("applies a highlighted background style to the newest log entry", () => {
    const log = makeLog({ id: "newest" });
    render(<TestLogsWrapper currentUser={adminUser} initialLogs={[log]} initialNewId="newest" />);
    const row = screen.getByTestId("log-row-newest");
    expect(row.style.background).toBe("rgb(240, 249, 255)");
  });
});