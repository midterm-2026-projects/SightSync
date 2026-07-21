import { VALID_STATUSES } from '../Models/order.js';

export function validateCreateOrder(req, res, next) {
  const { customerName, items, total } = req.body;

  if (!customerName || typeof customerName !== 'string') {
    return res.status(400).json({ error: 'customerName is required and must be a string' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items is required and must be a non-empty array' });
  }
  if (typeof total !== 'number' || total < 0) {
    return res.status(400).json({ error: 'total is required and must be a non-negative number' });
  }

  next();
}

export function validateStatusUpdate(req, res, next) {
  const { status } = req.body;

  if (!status || typeof status !== 'string') {
    return res.status(400).json({ error: 'status is required and must be a string' });
  }
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `status must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }

  next();
}