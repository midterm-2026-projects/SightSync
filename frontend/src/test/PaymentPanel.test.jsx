// tests/frontend/PaymentsPanel.test.jsx

import { render, screen, waitFor, act } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import PaymentsPanel from "../../src/components/PaymentsPanel";
import * as api from "../../src/services/paymentsApi";

vi.mock("../../src/services/paymentsApi");

const HISTORY = [
  {
    id: "pay-001",
    patient_name: "Maria Santos",
    doctor_name: "Dr. Sarah Jenkins",
    amount: 265,
    method: "cash",
    status: "confirmed",
    receipt_number: "RCP-20260623-AB1CD",
    receipt_total: 296.8,
    created_at: "2026-06-23T14:30:00.000Z",
  },
  {
    id: "pay-002",
    patient_name: "Jose Rizal",
    doctor_name: "Dr. Reyes",
    amount: 500,
    method: "gcash",
    status: "pending",
    receipt_number: null,
    receipt_total: null,
    created_at: "2026-06-22T10:00:00.000Z",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  api.fetchPayments.mockResolvedValue(HISTORY);
});

describe("PaymentsPanel — rendering", () => {
  test("renders PaymentForm", async () => {
    render(<PaymentsPanel />);
    await waitFor(() =>
      expect(screen.getByText(/create payment record/i)).toBeInTheDocument()
    );
  });

  test("renders Payment History heading", async () => {
    render(<PaymentsPanel />);
    await waitFor(() =>
      expect(screen.getByText(/payment history/i)).toBeInTheDocument()
    );
  });

  test("loads and displays payment history on mount", async () => {
    render(<PaymentsPanel />);
    await waitFor(() =>
      expect(screen.getByText("Maria Santos")).toBeInTheDocument()
    );
    expect(screen.getByText("Jose Rizal")).toBeInTheDocument();
  });

  test("shows receipt number for confirmed payment", async () => {
    render(<PaymentsPanel />);
    await waitFor(() =>
      expect(screen.getByText("RCP-20260623-AB1CD")).toBeInTheDocument()
    );
  });

  test("shows '—' for pending payment with no receipt", async () => {
    render(<PaymentsPanel />);
    await waitFor(() =>
      expect(screen.getByText("—")).toBeInTheDocument()
    );
  });

  test("shows loading state before data arrives", () => {
    api.fetchPayments.mockReturnValue(new Promise(() => {})); // never resolves
    render(<PaymentsPanel />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows empty message when no payments", async () => {
    api.fetchPayments.mockResolvedValue([]);
    render(<PaymentsPanel />);
    await waitFor(() =>
      expect(screen.getByText(/no payments yet/i)).toBeInTheDocument()
    );
  });
});

describe("PaymentsPanel — AC-1: receipt appears in history after confirm", () => {
  test("prepends new confirmed payment + receipt to history list", async () => {
    let onSuccessCallback;
    render(
      <PaymentsPanel __testOnSuccessRef={(callback) => {
        onSuccessCallback = callback;
      }} />
    );

    await waitFor(() => screen.getByText("Maria Santos"));
    expect(onSuccessCallback).toBeTypeOf("function");

    const newEntry = {
      payment: {
        id: "pay-003",
        patient_name: "Ana Reyes",
        doctor_name: "Dr. Cruz",
        amount: 800,
        method: "card",
        status: "confirmed",
        created_at: new Date().toISOString(),
      },
      receipt: {
        id: "rec-003",
        payment_id: "pay-003",
        receipt_number: "RCP-20260624-XY9ZZ",
        total: 896,
      },
    };

    act(() => {
      onSuccessCallback(newEntry);
    });

    await waitFor(() => expect(screen.getAllByText("Ana Reyes").length).toBeGreaterThan(0));
    expect(screen.getAllByText("RCP-20260624-XY9ZZ").length).toBeGreaterThan(0);
  });
});
