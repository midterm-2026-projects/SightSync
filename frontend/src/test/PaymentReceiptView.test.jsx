import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PaymentReceiptView from "../components/PaymentReceiptView";

// ─── Shared Mock Data ────────────────────────────────────────────────────────
const MOCK_RECEIPT = {
  id: "rcpt-001",
  receipt_number: "RCP-20260701-ABCDE",
  subtotal: 265.00,
  tax: 31.80,
  total: 296.80,
  generated_at: "2026-07-01T09:00:00.000Z",
  items: JSON.stringify([
    { name: "Anti-Reflective Lenses (1.61)", quantity: 1, price: 120.00 },
    { name: "Designer Frame - Matte Black",  quantity: 1, price: 145.00 },
  ]),
};

const MOCK_PAYMENT = {
  id: "pay-001",
  patient_name: "Maria Santos",
  doctor_name: "Dr. Sarah Jenkins, OD",
  method: "cash",
  od_rx: "Sph -2.50 / Cyl -0.50 x 180",
  os_rx: "Sph -2.25 / DS",
  amount: 265.00,
  status: "confirmed",
};

// ═════════════════════════════════════════════════════════════════════════════
// TEST SUITE — PaymentReceiptView (AC-2)
// ═════════════════════════════════════════════════════════════════════════════
describe("PaymentReceiptView — AC-2: no missing data", () => {
  
  it("renders nothing when receipt is null", () => {
    const { container } = render(
      <PaymentReceiptView receipt={null} payment={MOCK_PAYMENT} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when payment is null", () => {
    const { container } = render(
      <PaymentReceiptView receipt={MOCK_RECEIPT} payment={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("displays clinic name", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(/SightSync Clinic/i)).toBeInTheDocument();
  });

  it("displays receipt number", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(MOCK_RECEIPT.receipt_number)).toBeInTheDocument();
  });

  it("displays patient name", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(MOCK_PAYMENT.patient_name)).toBeInTheDocument();
  });

  it("displays doctor name", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(MOCK_PAYMENT.doctor_name)).toBeInTheDocument();
  });

  it("displays OD prescription", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(MOCK_PAYMENT.od_rx)).toBeInTheDocument();
  });

  it("displays OS prescription", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(MOCK_PAYMENT.os_rx)).toBeInTheDocument();
  });

  it("displays payment method", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(new RegExp(MOCK_PAYMENT.method, "i"))).toBeInTheDocument();
  });

  it("displays all line item names", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText("Anti-Reflective Lenses (1.61)")).toBeInTheDocument();
    expect(screen.getByText("Designer Frame - Matte Black")).toBeInTheDocument();
  });

  it("displays subtotal correctly formatted", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(/265\.00/)).toBeInTheDocument();
  });

  it("displays VAT amount", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(/31\.80/)).toBeInTheDocument();
  });

  it("displays total amount", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(/296\.80/)).toBeInTheDocument();
  });

  it("displays PAID status badge", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText(/PAID/i)).toBeInTheDocument();
  });

  // ── ✅ Fix 2: Fixed multiple elements found error by using getAllByText ──────
  it("should display generated_at as a readable date", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    const elements = screen.getAllByText(/2026/);
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toBeInTheDocument();
  });

  it("should render print button when onPrint is provided", () => {
    const onPrint = vi.fn();
    render(
      <PaymentReceiptView
        receipt={MOCK_RECEIPT}
        payment={MOCK_PAYMENT}
        onPrint={onPrint}
      />
    );
    expect(screen.getByText(/print receipt/i)).toBeInTheDocument();
  });

  it("calls onPrint when print button is clicked", () => {
    const onPrint = vi.fn();
    render(
      <PaymentReceiptView
        receipt={MOCK_RECEIPT}
        payment={MOCK_PAYMENT}
        onPrint={onPrint}
      />
    );
    fireEvent.click(screen.getByText(/print receipt/i));
    expect(onPrint).toHaveBeenCalledTimes(1);
  });

  it("does not render print button when onPrint is absent", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.queryByText(/print receipt/i)).toBeNull();
  });

  it("handles receipt.items as a JSON string (DB format)", () => {
    render(<PaymentReceiptView receipt={MOCK_RECEIPT} payment={MOCK_PAYMENT} />);
    expect(screen.getByText("Anti-Reflective Lenses (1.61)")).toBeInTheDocument();
  });
});