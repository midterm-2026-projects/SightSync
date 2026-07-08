import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ReceiptPreview from "../../components/objective3/ReceiptPreview";

describe("Receipt Preview", () => {

  const receipt = {
    receiptNo: "RCPT-001",
    customerId: "C001",
    type: "Payment",
    amount: "1000",
    date: "2026-07-08",
  };

  it("should display receipt information correctly", () => {

    render(<ReceiptPreview receipt={receipt} />);

    expect(screen.getByText("Receipt Preview")).toBeInTheDocument();
    expect(screen.getByText(/RCPT-001/)).toBeInTheDocument();
    expect(screen.getByText(/C001/)).toBeInTheDocument();
    expect(screen.getByText(/₱1000/)).toBeInTheDocument();

  });

  it("should display success message", () => {

    render(<ReceiptPreview receipt={receipt} />);

    expect(
      screen.getByText("Transaction Successfully Recorded")
    ).toBeInTheDocument();

  });

});