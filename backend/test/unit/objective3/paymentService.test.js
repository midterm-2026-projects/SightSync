import { describe, it, expect, beforeEach, vi } from 'vitest';

// ==========================================
// 1. INTERCEPT INTERNAL SOURCE ROUTING ERRORS (HOISTED)
// ==========================================
const { MockConstraintError } = vi.hoisted(() => {
  class ConstraintError extends Error {
    constructor(message, cause) {
      super(message);
      this.name = 'ConstraintError';
      this.statusCode = 400;
      this.cause = cause;
    }
  }
  return { MockConstraintError: ConstraintError };
});

// I-intercept ang relative imports mula sa loob ng native service directory
vi.mock('../../../src/objective3/middleware/errors.js', () => {
  return { ConstraintError: MockConstraintError };
});

// ==========================================
// 2. IMPORT SERVICE & TARGET DEPENDENCIES
// ==========================================
import PaymentService from '../../../src/objective3/Service/paymentService.js';

function makeFakeDb() {
  return { query: vi.fn() };
}

// ==========================================
// 3. SERVICE UNIT TESTS
// ==========================================
describe('PaymentService', () => {
  let db;
  let paymentService;

  beforeEach(() => {
    db = makeFakeDb();
    paymentService = new PaymentService(db);
  });

  describe('create', () => {
    it('should insert a payment and return the created row', async () => {
      const row = { id: 1, amount: 50, payment_date: '2026-07-20', method: 'cash', status: 'completed' };
      db.query.mockResolvedValue({ rows: [row] });

      const result = await paymentService.create({ amount: 50, payment_date: '2026-07-20' });
      expect(result).toEqual(row);
    });

    it('should wrap database errors in a ConstraintError', async () => {
      db.query.mockRejectedValue(new Error('duplicate key'));

      await expect(
        paymentService.create({ amount: 50, payment_date: '2026-07-20' })
      ).rejects.toThrow();
    });
  });

  describe('findById', () => {
    it('should return the matching row', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const result = await paymentService.findById(1);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM payments WHERE id = $1', [1]);
      expect(result).toEqual({ id: 1 });
    });

    it('should return null when no row is found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      expect(await paymentService.findById(999)).toBeNull();
    });
  });

  it('findAll should return every row', async () => {
    db.query.mockResolvedValue({ rows: [{ id: 1 }, { id: 2 }] });

    const result = await paymentService.findAll();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM payments ORDER BY id');
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  describe('updateStatus', () => {
    it('should update the status and return the updated row', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1, status: 'refunded' }] });

      const result = await paymentService.updateStatus(1, 'refunded');

      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE payments'), [
        'refunded',
        1,
      ]);
      expect(result).toEqual({ id: 1, status: 'refunded' });
    });

    it('should wrap database errors in a ConstraintError', async () => {
      db.query.mockRejectedValue(new Error('not null violation'));

      await expect(paymentService.updateStatus(1, 'refunded')).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should return true when a row was deleted', async () => {
      db.query.mockResolvedValue({ rowCount: 1 });
      expect(await paymentService.delete(1)).toBe(true);
    });

    it('should return false when no row was deleted', async () => {
      db.query.mockResolvedValue({ rowCount: 0 });
      expect(await paymentService.delete(999)).toBe(false);
    });
  });
});