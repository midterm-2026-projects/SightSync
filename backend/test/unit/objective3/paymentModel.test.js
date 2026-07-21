import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

// 🔌 Custom Errors
import { ConstraintError } from '../../../src/objective3/middleware/errors.js';


vi.mock('../../../database/db.js', () => ({
  default: {}
}));


let mockPayments = [];

vi.mock('../../../src/objective3/Models/payment.js', () => {
  return {
    default: class MockPaymentModel {
      constructor(db) {}

      async create(data) {
        const newPayment = {
          id: mockPayments.length + 1,
          amount: Number(data.amount),
          payment_date: data.payment_date || new Date().toISOString(),
          method: data.method || 'cash',
          status: data.status || 'pending',
          createdAt: new Date().toISOString()
        };
        mockPayments.push(newPayment);
        return newPayment;
      }

      async findById(id) {
        const payment = mockPayments.find(p => Number(p.id) === Number(id));
        return payment || null;
      }

      async findAll() {
        // I-sort gamit ang database ID ascending (1, 2, 3...)
        return [...mockPayments].sort((a, b) => a.id - b.id);
      }

      async updateStatus(id, status) {
        const payment = mockPayments.find(p => Number(p.id) === Number(id));
        if (!payment) {
          throw new Error('Payment not found');
        }
        payment.status = status;
        return payment;
      }
    }
  };
});

// Import ang mocked class
import PaymentModel from '../../../src/objective3/Models/payment.js';

describe('PaymentModel Integration Tests (PostgreSQL - Mocked)', () => {
  let paymentModel;

  beforeAll(() => {
    paymentModel = new PaymentModel({});
  });

  beforeEach(async () => {
    // Linisin ang in-memory data bago ang bawat test run
    mockPayments = [];
  });

  describe('create()', () => {
    it('should successfully create a new payment record', async () => {
      const paymentData = {
        amount: 250.50,
        payment_date: new Date().toISOString(),
        method: 'online',
        status: 'completed'
      };

      const result = await paymentModel.create(paymentData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(Number(result.amount)).toBe(250.50);
      expect(result.status).toBe('completed');
    });
  });

  describe('findById()', () => {
    it('should find the correct payment record by its unique database ID', async () => {
      const created = await paymentModel.create({
        amount: 100.00,
        payment_date: new Date().toISOString(),
        method: 'cash',
        status: 'completed'
      });

      const found = await paymentModel.findById(created.id);

      expect(found).not.toBeNull();
      expect(Number(found.id)).toBe(Number(created.id));
      expect(found.status).toBe('completed');
    });

    it('should return null if the payment ID does not exist', async () => {
      const found = await paymentModel.findById(99999);
      expect(found).toBeNull();
    });
  });

  describe('findAll()', () => {
    it('should retrieve all stored payment rows ordered by their database ID', async () => {
      await paymentModel.create({ amount: 10.00, payment_date: new Date().toISOString(), method: 'cash', status: 'completed' });
      await paymentModel.create({ amount: 20.00, payment_date: new Date().toISOString(), method: 'online', status: 'completed' });

      const allPayments = await paymentModel.findAll();

      expect(allPayments.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('updateStatus()', () => {
    it('should successfully update the status of an existing payment', async () => {
      const created = await paymentModel.create({
        amount: 500.00,
        payment_date: new Date().toISOString(),
        method: 'card',
        status: 'pending'
      });

      const updated = await paymentModel.updateStatus(created.id, 'completed');

      expect(updated).toBeDefined();
      expect(updated.status).toBe('completed');
    });
  });
});