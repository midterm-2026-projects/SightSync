const express = require('express');
const db = require('./db.cjs');
const { generateReceipt } = require('./receiptGenerator.cjs');

const app = express();
app.use(express.json());

function sendJson(res, status, data, success = true) {
  return res.status(status).json({ success, data });
}

function normalizeReceipt(receipt, payment = null) {
  const items = typeof receipt.items === 'string'
    ? JSON.parse(receipt.items)
    : (receipt.items || []);

  return {
    ...receipt,
    items,
    ...(payment ? { payment } : {}),
  };
}

app.post('/api/payments', (req, res) => {
  const { patient_name, doctor_name, amount, method, notes, items, od_rx, os_rx } = req.body || {};

  if (!patient_name || !doctor_name) return sendJson(res, 400, { message: 'Missing required fields' }, false);
  if (!amount || Number(amount) <= 0) return sendJson(res, 400, { message: 'Invalid amount' }, false);
  if (!['cash', 'card', 'insurance', 'gcash'].includes(method)) return sendJson(res, 400, { message: 'Invalid method' }, false);

  const id = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  db.prepare(`
    INSERT INTO payments (id, patient_name, doctor_name, od_rx, os_rx, amount, method, notes, items)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, patient_name, doctor_name, od_rx || null, os_rx || null, Number(amount), method, notes || null, JSON.stringify(items || []));

  return sendJson(res, 201, {
    id,
    patient_name,
    doctor_name,
    od_rx: od_rx || null,
    os_rx: os_rx || null,
    amount: Number(amount),
    method,
    status: 'pending',
  });
});

app.get('/api/payments', (req, res) => {
  const rows = db.prepare('SELECT * FROM payments ORDER BY created_at DESC').all();
  const data = rows.map((row) => ({
    ...row,
    receipt_number: db.prepare('SELECT receipt_number FROM receipts WHERE payment_id = ?').get(row.id)?.receipt_number || null,
  }));
  return sendJson(res, 200, data);
});

app.get('/api/payments/:id', (req, res) => {
  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
  if (!payment) return sendJson(res, 404, { message: 'Not found' }, false);

  const receipt = db.prepare('SELECT * FROM receipts WHERE payment_id = ?').get(payment.id);
  return sendJson(res, 200, { payment, receipt: receipt ? normalizeReceipt(receipt) : null });
});

app.get('/api/payments/:id/receipt', (req, res) => {
  const receipt = db.prepare('SELECT * FROM receipts WHERE payment_id = ?').get(req.params.id);
  if (!receipt) return sendJson(res, 404, { message: 'Not found' }, false);
  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
  return sendJson(res, 200, normalizeReceipt(receipt, payment));
});

app.patch('/api/payments/:id/confirm', (req, res) => {
  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
  if (!payment) return sendJson(res, 404, { message: 'Not found' }, false);
  if (payment.status === 'confirmed') return sendJson(res, 409, { message: 'Already confirmed' }, false);
  if (payment.status === 'failed') return sendJson(res, 400, { message: 'Cannot confirm failed payment' }, false);

  const receipt = generateReceipt(payment);
  const receiptPayload = {
    ...receipt,
    items: JSON.stringify(receipt.items),
  };

  db.prepare(`
    INSERT INTO receipts (id, payment_id, receipt_number, items, subtotal, tax, total, generated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(receiptPayload.id, payment.id, receiptPayload.receipt_number, receiptPayload.items, receiptPayload.subtotal, receiptPayload.tax, receiptPayload.total, receiptPayload.generated_at);

  db.prepare('UPDATE payments SET status = ? WHERE id = ?').run('confirmed', payment.id);
  return sendJson(res, 200, {
    payment: { ...payment, status: 'confirmed' },
    receipt: normalizeReceipt(receipt),
  });
});

app.patch('/api/payments/:id/fail', (req, res) => {
  const payment = db.prepare('SELECT * FROM payments WHERE id = ?').get(req.params.id);
  if (!payment) return sendJson(res, 404, { message: 'Not found' }, false);
  if (payment.status === 'confirmed') return sendJson(res, 400, { message: 'Cannot fail confirmed payment' }, false);

  db.prepare('UPDATE payments SET status = ? WHERE id = ?').run('failed', payment.id);
  return sendJson(res, 200, { status: 'failed' });
});

module.exports = app;
