// tests/frontend/PaymentForm.test.jsx

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import React from "react";
import PaymentForm from "../../components/objective3/PaymentForm";
import * as api from "../../services/paymentsApi";
import "@testing-library/jest-dom";

// Fixed: Path must match your exact import string above, and explicitly declare mock functions
vi.mock("../../services/paymentsApi", () => {
  return {
    createPayment: vi.fn(),
    confirmPayment: vi.fn(),
  };
});

const MOCK_PAYMENT = {
  id: "pay-001",
  patient_name: "Maria Santos",
  doctor_name: "Dr. Sarah Jenkins, OD",
  amount: 265,
  method: "cash",
  status: "pending",
};

const MOCK_RECEIPT = {
  id: "rec-001",
  payment_id: "pay-001",
  receipt_number: "RCP-20260623-AB1CD",
  items: [{ name: "Anti-Reflective Lenses", quantity: 1, price: 265 }],
  subtotal: 265,
  tax: 31.8,
  total: 296.8,
  generated_at: "2026-06-23T14:30:00.000Z",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PaymentForm — rendering", () => {
  it("should render all input fields", () => {
    render(<PaymentForm />);
    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/doctor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/payment method/i)).toBeInTheDocument();
  });

  it("should render Create Payment Record button initially", () => {
    render(<PaymentForm />);
    expect(screen.getByText(/create payment record/i)).toBeInTheDocument();
  });

  it("should prefill patient and doctor from prefill prop", () => {
    render(
      <PaymentForm
        prefill={{ patientName: "Juan dela Cruz", doctorName: "Dr. Reyes" }}
      />
    );
    expect(screen.getByDisplayValue("Juan dela Cruz")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Dr. Reyes")).toBeInTheDocument();
  });

  it("should prefill amount from prefill items total", () => {
    const items = [{ name: "Lens", quantity: 1, price: 120 }];
    render(<PaymentForm prefill={{ items }} />);
    expect(screen.getByDisplayValue("120.00")).toBeInTheDocument();
  });
});

describe("PaymentForm — Step 1: create payment", () => {
  it("should call createPayment with correct data on submit", async () => {
    if (api.createPayment && typeof api.createPayment.mockResolvedValue === 'function') {
      api.createPayment.mockResolvedValue(MOCK_PAYMENT);
    } else {
      vi.spyOn(api, 'createPayment').mockResolvedValue(MOCK_PAYMENT);
    }

    render(
      <PaymentForm
        prefill={{
          patientName: "Maria Santos",
          doctorName: "Dr. Sarah Jenkins, OD",
        }}
      />
    );

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "265" },
    });

    fireEvent.click(screen.getByText(/create payment record/i));

    await waitFor(() =>
      expect(api.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          patient_name: "Maria Santos",
          doctor_name: "Dr. Sarah Jenkins, OD",
          amount: 265,
        })
      )
    );
  });

  it("should show confirmation step after payment created", async () => {
    if (api.createPayment && typeof api.createPayment.mockResolvedValue === 'function') {
      api.createPayment.mockResolvedValue(MOCK_PAYMENT);
    } else {
      vi.spyOn(api, 'createPayment').mockResolvedValue(MOCK_PAYMENT);
    }

    render(
      <PaymentForm
        prefill={{ patientName: "Maria Santos", doctorName: "Dr. Reyes" }}
      />
    );
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "265" },
    });
    fireEvent.click(screen.getByText(/create payment record/i));

    await waitFor(() =>
      expect(
        screen.getByText(/confirm & generate receipt/i)
      ).toBeInTheDocument()
    );
  });

  it("should show the payment ID after step 1", async () => {
    if (api.createPayment && typeof api.createPayment.mockResolvedValue === 'function') {
      api.createPayment.mockResolvedValue(MOCK_PAYMENT);
    } else {
      vi.spyOn(api, 'createPayment').mockResolvedValue(MOCK_PAYMENT);
    }

    render(
      <PaymentForm
        prefill={{ patientName: "Maria Santos", doctorName: "Dr. Reyes" }}
      />
    );
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "100" },
    });
    fireEvent.click(screen.getByText(/create payment record/i));

    await waitFor(() =>
      expect(screen.getByText(/pay-001/i)).toBeInTheDocument()
    );
  });

  it("should show error message when createPayment fails", async () => {
    if (api.createPayment && typeof api.createPayment.mockRejectedValue === 'function') {
      api.createPayment.mockRejectedValue(new Error("Network error"));
    } else {
      vi.spyOn(api, 'createPayment').mockRejectedValue(new Error("Network error"));
    }

    render(<PaymentForm prefill={{ patientName: "X", doctorName: "Y" }} />);
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "50" },
    });
    fireEvent.click(screen.getByText(/create payment record/i));

    await waitFor(() =>
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    );
  });

  it("should disable submit button when patient_name is empty", () => {
    render(<PaymentForm />);
    const btn = screen.getByText(/create payment record/i);
    expect(btn).toBeDisabled();
  });
});

describe("PaymentForm — Step 2: confirm + AC-2 receipt display", () => {
  async function setupToConfirmStep() {
    if (api.createPayment && typeof api.createPayment.mockResolvedValue === 'function') {
      api.createPayment.mockResolvedValue(MOCK_PAYMENT);
    } else {
      vi.spyOn(api, 'createPayment').mockResolvedValue(MOCK_PAYMENT);
    }

    const confirmRes = {
      payment: { ...MOCK_PAYMENT, status: "confirmed" },
      receipt: MOCK_RECEIPT,
    };

    if (api.confirmPayment && typeof api.confirmPayment.mockResolvedValue === 'function') {
      api.confirmPayment.mockResolvedValue(confirmRes);
    } else {
      vi.spyOn(api, 'confirmPayment').mockResolvedValue(confirmRes);
    }

    const onSuccess = vi.fn();

    render(
      <PaymentForm
        prefill={{ patientName: "Maria Santos", doctorName: "Dr. Reyes" }}
        onSuccess={onSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "265" },
    });
    fireEvent.click(screen.getByText(/create payment record/i));

    await waitFor(() =>
      expect(screen.getByText(/confirm & generate receipt/i)).toBeInTheDocument()
    );

    return { onSuccess };
  }

  it("should call confirmPayment with the pending payment id on confirm click", async () => {
    await setupToConfirmStep();
    fireEvent.click(screen.getByText(/confirm & generate receipt/i));

    await waitFor(() =>
      expect(api.confirmPayment).toHaveBeenCalledWith("pay-001")
    );
  });

  it("should call onSuccess with payment + receipt after confirm finishes", async () => {
    const { onSuccess } = await setupToConfirmStep();
    fireEvent.click(screen.getByText(/confirm & generate receipt/i));

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          payment: expect.objectContaining({ status: "confirmed" }),
          receipt: expect.objectContaining({
            receipt_number: "RCP-20260623-AB1CD",
          }),
        })
      )
    );
  });

  it("should show success message after confirm completes successfully", async () => {
    await setupToConfirmStep();
    fireEvent.click(screen.getByText(/confirm & generate receipt/i));

    await waitFor(() =>
      expect(
        screen.getByText(/payment confirmed & receipt generated/i)
      ).toBeInTheDocument()
    );
  });

  it("should clear the old payment record after confirm and allow new input", async () => {
    await setupToConfirmStep();
    fireEvent.click(screen.getByText(/confirm & generate receipt/i));

    await waitFor(() =>
      expect(screen.getByText(/create payment record/i)).toBeInTheDocument()
    );

    expect(screen.getByLabelText(/patient name/i)).toHaveValue("");
    expect(screen.getByLabelText(/doctor/i)).toHaveValue("");
    expect(screen.getByLabelText(/amount/i)).toHaveValue(null);
    expect(screen.getByLabelText(/payment method/i)).toHaveValue("cash");
  });

  it("should reset back to form fields when cancel button is clicked", async () => {
    await setupToConfirmStep();
    fireEvent.click(screen.getByText(/cancel/i));

    await waitFor(() =>
      expect(screen.getByText(/create payment record/i)).toBeInTheDocument()
    );
  });

  it("should show error text when confirmPayment fails", async () => {
    if (api.createPayment && typeof api.createPayment.mockResolvedValue === 'function') {
      api.createPayment.mockResolvedValue(MOCK_PAYMENT);
    } else {
      vi.spyOn(api, 'createPayment').mockResolvedValue(MOCK_PAYMENT);
    }

    if (api.confirmPayment && typeof api.confirmPayment.mockRejectedValue === 'function') {
      api.confirmPayment.mockRejectedValue(new Error("Confirm failed"));
    } else {
      vi.spyOn(api, 'confirmPayment').mockRejectedValue(new Error("Confirm failed"));
    }

    render(
      <PaymentForm
        prefill={{ patientName: "Maria Santos", doctorName: "Dr. Reyes" }}
      />
    );
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: "265" },
    });
    fireEvent.click(screen.getByText(/create payment record/i));

    await waitFor(() =>
      expect(screen.getByText(/confirm & generate receipt/i)).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText(/confirm & generate receipt/i));

    await waitFor(() =>
      expect(screen.getByText(/confirm failed/i)).toBeInTheDocument()
    );
  });
});