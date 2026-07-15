// tests/frontend/PaymentsPanel.test.jsx

import { render, screen, waitFor, act } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import React from "react";
import PaymentsPanel from "../../components/Objective3/PaymentsPanel";
import * as api from "../../services/paymentsApi";

// Fixed: The mock path must match your exact import string above
vi.mock("../../services/paymentsApi", () => {
  return {
    fetchPayments: vi.fn()
  };
});

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
  
  // Fixed: Fallback protection using vi.spyOn just in case the namespace is locked
  if (api.fetchPayments && typeof api.fetchPayments.mockResolvedValue === 'function') {
    api.fetchPayments.mockResolvedValue(HISTORY);
  } else {
    vi.spyOn(api, 'fetchPayments').mockResolvedValue(HISTORY);
  }
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
    if (api.fetchPayments && typeof api.fetchPayments.mockReturnValue === 'function') {
      api.fetchPayments.mockReturnValue(new Promise(() => {})); 
    } else {
      vi.spyOn(api, 'fetchPayments').mockReturnValue(new Promise(() => {}));
    }
    
    render(<PaymentsPanel />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows empty message when no payments", async () => {
    if (api.fetchPayments && typeof api.fetchPayments.mockResolvedValue === 'function') {
      api.fetchPayments.mockResolvedValue([]);
    } else {
      vi.spyOn(api, 'fetchPayments').mockResolvedValue([]);
    }

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