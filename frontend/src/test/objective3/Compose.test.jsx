// src/test/Compose.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import '@testing-library/jest-dom';
import Compose, { AccessDeniedBanner } from "../../components/objective3/Compose";

const adminUser  = { id: "u1", name: "Alice Admin",   role: "admin" };
const staffUser  = { id: "u2", name: "Sam Staff",     role: "staff" };
const guestUser  = { id: "u3", name: "Gary Guest",    role: "guest" };
const viewerUser = { id: "u4", name: "Victor Viewer", role: "viewer" };

const VALID = {
  subject:    "Q3 Project Update",
  content:    "All milestones are on track.",
  recipients: "board, investors",
};

// Stateful Test Wrapper aligning with the TestFormWrapper pattern
const TestComposeWrapper = ({ currentUser, onSend }) => {
  return (
    <Compose 
      currentUser={currentUser} 
      onSend={onSend} 
    />
  );
};

function fillAndSend(onSend = vi.fn()) {
  fireEvent.change(screen.getByTestId("input-subject"),    { target: { value: VALID.subject } });
  fireEvent.change(screen.getByTestId("input-recipients"), { target: { value: VALID.recipients } });
  fireEvent.change(screen.getByTestId("input-content"),    { target: { value: VALID.content } });
  fireEvent.click(screen.getByTestId("btn-send"));
  return onSend;
}

// ─── AC1: Authorized roles can compose and send ──────────────────────────────

describe("Compose — AC1: authorized roles (admin / staff) can send messages", () => {
  it("renders the compose panel for an admin user", () => {
    render(<TestComposeWrapper currentUser={adminUser} onSend={vi.fn()} />);
    expect(screen.getByTestId("compose-panel")).toBeInTheDocument();
  });

  it("renders the compose panel for a staff user", () => {
    render(<TestComposeWrapper currentUser={staffUser} onSend={vi.fn()} />);
    expect(screen.getByTestId("compose-panel")).toBeInTheDocument();
  });

  it("calls onSend with the correct payload when an admin submits a valid form", () => {
    const onSend = vi.fn();
    render(<TestComposeWrapper currentUser={adminUser} onSend={onSend} />);
    fillAndSend(onSend);
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith({
      subject:    VALID.subject,
      content:    VALID.content,
      recipients: ["board", "investors"],
    });
  });

  it("calls onSend with the correct payload when a staff user submits a valid form", () => {
    const onSend = vi.fn();
    render(<TestComposeWrapper currentUser={staffUser} onSend={onSend} />);
    fillAndSend(onSend);
    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("clears all form fields after a successful send", () => {
    render(<TestComposeWrapper currentUser={adminUser} onSend={vi.fn()} />);
    fillAndSend();
    expect(screen.getByTestId("input-subject").value).toBe("");
    expect(screen.getByTestId("input-content").value).toBe("");
    expect(screen.getByTestId("input-recipients").value).toBe("");
  });
});

// ─── AC2: Unauthorized users see Access Denied ───────────────────────────────

describe("Compose — AC2: unauthorized users are blocked", () => {
  it("shows the Access Denied banner and hide the compose panel for a guest user", () => {
    render(<TestComposeWrapper currentUser={guestUser} onSend={vi.fn()} />);
    expect(screen.getByTestId("access-denied-banner")).toBeInTheDocument();
    expect(screen.queryByTestId("compose-panel")).not.toBeInTheDocument();
  });

  it("shows the Access Denied banner for a viewer user", () => {
    render(<TestComposeWrapper currentUser={viewerUser} onSend={vi.fn()} />);
    expect(screen.getByTestId("access-denied-banner")).toBeInTheDocument();
  });

  it("renders the AccessDeniedBanner with the correct role names", () => {
    render(<AccessDeniedBanner />);
    expect(screen.getByTestId("access-denied-banner")).toBeInTheDocument();
    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    expect(screen.getByText(/admin/i)).toBeInTheDocument();
    expect(screen.getByText(/staff/i)).toBeInTheDocument();
  });

  it("prevents rendering the send button or calling onSend for a guest user", () => {
    const onSend = vi.fn();
    render(<TestComposeWrapper currentUser={guestUser} onSend={onSend} />);
    expect(screen.queryByTestId("btn-send")).not.toBeInTheDocument();
    expect(onSend).not.toHaveBeenCalled();
  });
});

// ─── Input validation ─────────────────────────────────────────────────────────

describe("Compose — input validation", () => {
  it("shows a subject error when the subject field is empty", () => {
    render(<TestComposeWrapper currentUser={adminUser} onSend={vi.fn()} />);
    fireEvent.change(screen.getByTestId("input-recipients"), { target: { value: "board" } });
    fireEvent.change(screen.getByTestId("input-content"),    { target: { value: "hello" } });
    fireEvent.click(screen.getByTestId("btn-send"));
    expect(screen.getByTestId("error-subject")).toBeInTheDocument();
  });

  it("shows a content error when the message field is empty", () => {
    render(<TestComposeWrapper currentUser={adminUser} onSend={vi.fn()} />);
    fireEvent.change(screen.getByTestId("input-subject"),    { target: { value: "hi" } });
    fireEvent.change(screen.getByTestId("input-recipients"), { target: { value: "board" } });
    fireEvent.click(screen.getByTestId("btn-send"));
    expect(screen.getByTestId("error-content")).toBeInTheDocument();
  });

  it("shows a recipients error when the recipients field is empty", () => {
    render(<TestComposeWrapper currentUser={adminUser} onSend={vi.fn()} />);
    fireEvent.change(screen.getByTestId("input-subject"), { target: { value: "hi" } });
    fireEvent.change(screen.getByTestId("input-content"), { target: { value: "body" } });
    fireEvent.click(screen.getByTestId("btn-send"));
    expect(screen.getByTestId("error-recipients")).toBeInTheDocument();
  });

  it("prevents calling onSend when validation fails", () => {
    const onSend = vi.fn();
    render(<TestComposeWrapper currentUser={adminUser} onSend={onSend} />);
    fireEvent.click(screen.getByTestId("btn-send"));
    expect(onSend).not.toHaveBeenCalled();
  });

  it("treats a whitespace-only subject as invalid and blocks calling onSend", () => {
    const onSend = vi.fn();
    render(<TestComposeWrapper currentUser={adminUser} onSend={onSend} />);
    fireEvent.change(screen.getByTestId("input-subject"),    { target: { value: "   " } });
    fireEvent.change(screen.getByTestId("input-recipients"), { target: { value: "board" } });
    fireEvent.change(screen.getByTestId("input-content"),    { target: { value: "body" } });
    fireEvent.click(screen.getByTestId("btn-send"));
    expect(onSend).not.toHaveBeenCalled();
  });
});