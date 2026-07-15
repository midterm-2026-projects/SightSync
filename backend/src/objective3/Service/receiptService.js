const TEMPLATE_VERSION = 'v1';

const BUSINESS_INFO = Object.freeze({
  name: 'Acme Billing Co.',
  address: '123 Market Street, Springfield',
  taxId: 'TAX-000000',
});

const FOOTER_MESSAGE = 'Thank you for your payment. This receipt was generated automatically.';

/**
 * The fixed top-level shape every receipt must have, regardless of payment
 * specifics. Used both to build receipts and to assert structural
 * consistency in tests.
 */
const RECEIPT_SCHEMA_KEYS = Object.freeze([
  'receiptNumber',
  'templateVersion',
  'issuedDate',
  'business',
  'payment',
  'footer',
]);

const PAYMENT_SECTION_KEYS = Object.freeze([
  'id',
  'amount',
  'formattedAmount',
  'currency',
  'paymentDate',
  'method',
  'status',
]);

function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function buildReceiptNumber(paymentId, issuedDate) {
  const year = issuedDate.slice(0, 4);
  const paddedId = String(paymentId).padStart(6, '0');
  return `RCPT-${year}-${paddedId}`;
}

/**
 * Builds the in-memory receipt object following the fixed template without customer dependencies.
 *
 * @param {object} payment - a row from the payments table
 * @param {string} [issuedDate] - ISO date (defaults to now)
 */
function generateReceipt(payment, issuedDate = new Date().toISOString()) {
  if (!payment) throw new Error('generateReceipt requires a payment.');

  const receiptNumber = buildReceiptNumber(payment.id, issuedDate);

  return {
    receiptNumber,
    templateVersion: TEMPLATE_VERSION,
    issuedDate,
    business: { ...BUSINESS_INFO },
    payment: {
      id: payment.id,
      amount: payment.amount,
      formattedAmount: formatCurrency(payment.amount),
      currency: 'USD',
      paymentDate: payment.payment_date,
      method: payment.method,
      status: payment.status,
    },
    footer: FOOTER_MESSAGE,
  };
}

/**
 * Validates that a generated receipt object matches the fixed template structure.
 */
function conformsToTemplate(receipt) {
  if (!receipt || typeof receipt !== 'object') return false;

  const topLevelOk =
    RECEIPT_SCHEMA_KEYS.every((key) => Object.prototype.hasOwnProperty.call(receipt, key)) &&
    Object.keys(receipt).length === RECEIPT_SCHEMA_KEYS.length;

  const paymentOk =
    receipt.payment &&
    PAYMENT_SECTION_KEYS.every((key) => Object.prototype.hasOwnProperty.call(receipt.payment, key));

  return Boolean(topLevelOk && paymentOk);
}

/**
 * Generates a receipt for a payment and persists it via the Receipt model.
 *
 * @param {object} deps
 * @param {import('../Models/payment')} deps.paymentModel
 * @param {import('../Models/receipt')} deps.receiptModel
 * @param {number} paymentId
 */
function issueReceipt({ paymentModel, receiptModel }, paymentId) {
  const payment = paymentModel.findById(paymentId);
  if (!payment) {
    throw new Error(`Payment ${paymentId} not found.`);
  }

  const existing = receiptModel.findByPaymentId(paymentId);
  if (existing) {
    const receipt = generateReceipt(payment, existing.issued_date);
    receipt.receiptNumber = existing.receipt_number;
    receipt.templateVersion = existing.template_version;
    return receipt;
  }

  const issuedDate = new Date().toISOString();
  const receipt = generateReceipt(payment, issuedDate);

  receiptModel.create({
    payment_id: payment.id,
    receipt_number: receipt.receiptNumber,
    template_version: receipt.templateVersion,
    issued_date: issuedDate,
  });

  return receipt;
}

// Named exports block para sa modernong ES Modules
export {
  TEMPLATE_VERSION,
  BUSINESS_INFO,
  RECEIPT_SCHEMA_KEYS,
  PAYMENT_SECTION_KEYS,
  generateReceipt,
  conformsToTemplate,
  issueReceipt,
  buildReceiptNumber,
  formatCurrency,
};