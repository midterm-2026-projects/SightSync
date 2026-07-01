function generateReceipt(payment) {
  let items = [];

  if (Array.isArray(payment.items)) {
    items = payment.items;
  } else if (typeof payment.items === 'string') {
    try {
      items = JSON.parse(payment.items);
    } catch {
      items = [];
    }
  }

  const subtotal = items.length
    ? items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)
    : Number(payment.amount || 0);
  const tax = subtotal * 0.12;
  const total = subtotal + tax;
  const receiptNumber = `RCP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  return {
    id: `rec-${Math.random().toString(36).slice(2, 10)}`,
    payment_id: payment.id,
    receipt_number: receiptNumber,
    items: JSON.stringify(items.length ? items : [{ name: payment.patient_name || 'Service', quantity: 1, price: subtotal }]),
    subtotal,
    tax,
    total,
    generated_at: new Date().toISOString(),
  };
}

module.exports = { generateReceipt };

