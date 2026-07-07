import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import db from '../../../../config/db.js'; 
import PaymentModel from '../models/payment.js';
import { ConstraintError } from '../middleware/errors.js';

describe('PaymentModel Integration Tests (PostgreSQL)', () => {
  let paymentModel;

  beforeAll(async () => {
    // Clean up tables once at the beginning
    try {
      await db.query('TRUNCATE TABLE payments RESTART IDENTITY CASCADE;');
    } catch (err) {
      console.warn('Database cleanup warning during setup:', err.message);
    }
  });

  beforeEach(() => {
    paymentModel = new PaymentModel(db);
  });

  afterEach(async () => {
    // Isolate the testing space cleanly
    try {
      await db.query('TRUNCATE TABLE payments RESTART IDENTITY CASCADE;');
    } catch (err) {
      console.warn('Database cleanup warning during suite teardown:', err.message);
    }
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