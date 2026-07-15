import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
// Cleans out /test/objective3/ and targets /src/components/LogRow
import LogRow from "../../components/objective3/LogRow"; 

describe("LogRow Component", () => {
  const sampleLog = {
    id: "log123456",
    subject: "System Update",
    senderRole: "Admin",
    senderName: "Alice Smith",
    senderId: "USR-001",
    recipients: ["Bob", "Charlie"],
    timestamp: "2026-07-07T10:00:00.000Z",
    content: "The system has been updated successfully to version 2.0."
  };

  test("renders component with correct subject and partial ID", () => {
    render(<LogRow log={sampleLog} isNew={false} />);
    
    expect(screen.getByTestId("log-row-log123456")).toBeInTheDocument();
    expect(screen.getByText("System Update")).toBeInTheDocument();
    expect(screen.getByText("#log123")).toBeInTheDocument(); // Checks string slice
  });

  test("toggles detail visibility when clicked", () => {
    render(<LogRow log={sampleLog} isNew={false} />);
    
    const toggleButton = screen.getByTestId("log-toggle-log123456");
    
    // Details should be collapsed initially
    expect(screen.queryByTestId("log-detail-log123456")).not.toBeInTheDocument();
    
    // First click expands details
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("log-detail-log123456")).toBeInTheDocument();
    expect(screen.getByTestId("log-content-log123456")).toHaveTextContent(sampleLog.content);
    
    // Second click collapses details again
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("log-detail-log123456")).not.toBeInTheDocument();
  });
});