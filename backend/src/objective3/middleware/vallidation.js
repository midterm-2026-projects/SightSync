const VALID_METHODS = ['cash', 'card', 'bank_transfer', 'online'];
const VALID_PAYMENT_STATUSES = ['pending', 'completed', 'failed', 'refunded'];

/**
 * Returns true if `value` parses to a real calendar date (rejects things like
 * "2024-02-30" as well as garbage strings).
 */
function isValidDate(value) {
  if (typeof value !== 'string' || value.trim() === '') return false;

  const match = /^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(value.trim());
  if (!match) return false;

  const [, y, mo, d, h = '0', mi = '0', s = '0'] = match;
  const year = Number(y);
  const month = Number(mo);
  const day = Number(d);
  const hour = Number(h);
  const minute = Number(mi);
  const second = Number(s);

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    hour >= 0 && hour < 24 &&
    minute >= 0 && minute < 60 &&
    second >= 0 && second < 60
  );
}

/**
 * Validates a payment (or deposit) form payload.
 * Enforces the three acceptance-criteria rules: amount > 0, valid date, required customer ID.
 *
 * @param {object} payload
 * @param {object} [opts]
 * @param {boolean} [opts.requireMethod=false]
 * @param {string} [opts.dateField='payment_date']
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateTransactionForm(payload, opts = {}) {
  const { requireMethod = false, dateField = 'payment_date' } = opts;
  const errors = [];

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Request body is required.'] };
  }

  const { customer_id, amount, method } = payload;
  const dateValue = payload[dateField];

  // Required customer ID
  if (customer_id === undefined || customer_id === null || customer_id === '') {
    errors.push('customer_id is required.');
  } else if (!Number.isInteger(Number(customer_id)) || Number(customer_id) <= 0) {
    errors.push('customer_id must be a positive integer.');
  }

  // amount > 0
  if (amount === undefined || amount === null || amount === '') {
    errors.push('amount is required.');
  } else if (typeof amount === 'boolean' || Number.isNaN(Number(amount))) {
    errors.push('amount must be a number.');
  } else if (Number(amount) <= 0) {
    errors.push('amount must be greater than 0.');
  }

  // valid date
  if (dateValue === undefined || dateValue === null || dateValue === '') {
    errors.push(`${dateField} is required.`);
  } else if (!isValidDate(dateValue)) {
    errors.push(`${dateField} must be a valid date (YYYY-MM-DD).`);
  }

  if (requireMethod) {
    if (!method) {
      errors.push('method is required.');
    } else if (!VALID_METHODS.includes(method)) {
      errors.push(`method must be one of: ${VALID_METHODS.join(', ')}.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validatePaymentForm(payload) {
  return validateTransactionForm(payload, { requireMethod: false, dateField: 'payment_date' });
}

function validateDepositForm(payload) {
  return validateTransactionForm(payload, { requireMethod: false, dateField: 'deposit_date' });
}

/** Express middleware wrapper - responds 400 with error list on failure. */
function makeFormValidationMiddleware(validatorFn) {
  return (req, res, next) => {
    const { valid, errors } = validatorFn(req.body);
    if (!valid) {
      return res.status(400).json({ success: false, errors });
    }
    next();
  };
}

// Named exports block para sa ES Modules
export {
  isValidDate,
  validateTransactionForm,
  validatePaymentForm,
  validateDepositForm,
  makeFormValidationMiddleware,
  VALID_METHODS,
  VALID_PAYMENT_STATUSES,
};