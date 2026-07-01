import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import LogRow from "../components/LogRow";

// Mock out the external constants dependency layout
vi.mock("../components/receiptConstants", () => ({
  C: {
    border: "#CBD5E1",
    surface: "#FFFFFF",
    muted: "#64748B",
    text: "#1E293B",
    bg: "#F8FAFC",
  },
  RoleBadge: ({ role }) => <span data-testid="role-badge">{role}</span>,
}));

// Mock log fixture data
const mockLog = {
  id: "abcdef1234567890",
  subject: "Q3 Milestone Review",
  senderRole: "admin",
  senderName: "Dr. Jenkins",
  senderId: "USR-9921",
  recipients: ["board", "investors"],
  timestamp: "2026-06-30T10:00:00.000Z",
  content: "This is a detailed summary of the production rollout milestones.",
};

describe("LogRow Component", () => {
  it("renders the primary log headline summary details", () => {
    render(<LogRow log={mockLog} isNew={false} />);

    // Verify shortened slice id hash
    expect(screen.getByText("#abcdef")).toBeInTheDocument();
    
    // Verify subject text
    expect(screen.getByText("Q3 Milestone Review")).toBeInTheDocument();
    
    // Verify role component render badge pass-through
    expect(screen.getByTestId("role-badge")).toHaveTextContent("admin");
  });

  it("dynamically changes background style if the log is marked as new", () => {
    const { rerender } = render(<LogRow log={mockLog} isNew={true} />);
    let row = screen.getByTestId("log-row-abcdef1234567890");
    expect(row).toHaveStyle({ background: "#F0F9FF" });

    rerender(<LogRow log={mockLog} isNew={false} />);
    expect(row).toHaveStyle({ background: "#FFFFFF" });
  });

  it("toggles the collapsed breakdown profile visibility panel when clicked", () => {
    render(<LogRow log={mockLog} isNew={false} />);

    // Details elements should not appear initially
    expect(screen.queryByTestId("log-detail-abcdef1234567890")).not.toBeInTheDocument();
    expect(screen.getByText("▼")).toBeInTheDocument();

    // Click to expand details panel container
    const toggleButton = screen.getByTestId("log-toggle-abcdef1234567890");
    fireEvent.click(toggleButton);

    // Verify detailed content fields mount correctly
    expect(screen.getByTestId("log-detail-abcdef1234567890")).toBeInTheDocument();
    expect(screen.getByText("▲")).toBeInTheDocument();
    expect(screen.getByText("Dr. Jenkins")).toBeInTheDocument();
    expect(screen.getByTestId("log-sender-id-abcdef1234567890")).toHaveTextContent("USR-9921");
    expect(screen.getByTestId("log-recipients-abcdef1234567890")).toHaveTextContent("board, investors");
    expect(screen.getByTestId("log-content-abcdef1234567890")).toHaveTextContent(
      "This is a detailed summary of the production rollout milestones."
    );

    // Click again to close panel profile
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("log-detail-abcdef1234567890")).not.toBeInTheDocument();
    expect(screen.getByText("▼")).toBeInTheDocument();
  });
});