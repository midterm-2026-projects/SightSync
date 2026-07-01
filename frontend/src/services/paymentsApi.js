export async function createPayment(payload) {
  return {
    id: "pay-001",
    ...payload,
    status: "pending",
  };
}

export async function confirmPayment(paymentId) {
  return {
    payment: {
      id: paymentId,
      status: "confirmed",
    },
    receipt: {
      id: "rec-001",
      payment_id: paymentId,
      receipt_number: "RCP-20260623-AB1CD",
      items: [{ name: "Anti-Reflective Lenses", quantity: 1, price: 265 }],
      subtotal: 265,
      tax: 31.8,
      total: 296.8,
      generated_at: new Date().toISOString(),
    },
  };
}

export async function fetchPayments() {
  return [];
}
