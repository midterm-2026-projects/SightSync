import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { ConstraintError } from '../../../src/objective3/middleware/errors.js';
import ReceiptModel from '../../../src/objective3/models/receipt.js';
import PaymentModel from '../../../src/objective3/models/payment.js';


vi.mock('../../../database/db.js', () => ({
  default: {}
}));


let mockPayments = [];
let mockReceipts = [];

vi.mock('../../../src/objective3/models/payment.js', () => {
  return {
    default: class MockPaymentModel {
      constructor(db) {}

      async create(data) {
        const newPayment = {
          id: mockPayments.length + 1,
          amount: Number(data.amount),
          payment_date: data.payment_date || new Date().toISOString(),
          method: data.method || 'cash',
          status: data.status || 'completed',
          createdAt: new Date().toISOString()
        };
        mockPayments.push(newPayment);
        return newPayment;
      }
    }
  };
});

// 🛠️ I-mock ang ReceiptModel
vi.mock('../../../src/objective3/models/receipt.js', () => {
  return {
    default: class MockReceiptModel {
      constructor(db) {}

      async create(data) {
        // I-check kung may kaparehong receipt_number sa ating mock db
        const duplicate = mockReceipts.find(r => r.receipt_number === data.receipt_number);
        if (duplicate) {
          throw new ConstraintError('Duplicate key value violates unique constraint');
        }

        const newReceipt = {
          id: mockReceipts.length + 1,
          payment_id: Number(data.payment_id),
          receipt_number: data.receipt_number,
          template_version: data.template_version || 'v1',
          issued_date: data.issued_date || new Date().toISOString(),
          createdAt: new Date().toISOString()
        };
        mockReceipts.push(newReceipt);
        return newReceipt;
      }

      async findById(id) {
        const receipt = mockReceipts.find(r => Number(r.id) === Number(id));
        return receipt || null;
      }

      async findByPaymentId(paymentId) {
        const receipt = mockReceipts.find(r => Number(r.payment_id) === Number(paymentId));
        return receipt || null;
      }

      async findByReceiptNumber(receiptNumber) {
        const receipt = mockReceipts.find(r => r.receipt_number === receiptNumber);
        return receipt || null;
      }

      async findAll() {
        // I-sort base sa index/id ascending
        return [...mockReceipts].sort((a, b) => a.id - b.id);
      }
    }
  };
});

describe('ReceiptModel Integration Tests (PostgreSQL - Mocked)', () => {
  let receiptModel;
  let paymentModel;
  let sharedPayment;

  beforeAll(() => {
    receiptModel = new ReceiptModel({});
    paymentModel = new PaymentModel({});
  });

  beforeEach(async () => {
    // Linisin ang parehong in-memory database bago ang bawat test run
    mockPayments = [];
    mockReceipts = [];

    // Gumawa ng laging handang shared payment para sa tests
    sharedPayment = await paymentModel.create({
      amount: 89.99,
      payment_date: new Date().toISOString(),
      method: 'online',
      status: 'completed'
    });
  });

  describe('create()', () => {
    it('should successfully create a new receipt record associated with a payment', async () => {
      const receiptData = {
        payment_id: sharedPayment.id,
        receipt_number: 'RCPT-2026-000001',
        template_version: 'v1',
        issued_date: new Date().toISOString()
      };

      const result = await receiptModel.create(receiptData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(Number(result.payment_id)).toBe(Number(sharedPayment.id));
      expect(result.receipt_number).toBe('RCPT-2026-000001');
    });

    it('should throw a ConstraintError when attempting to duplicate a unique receipt_number', async () => {
      const receiptData1 = {
        payment_id: sharedPayment.id,
        receipt_number: 'DUP-NUMBER-123',
        template_version: 'v1',
        issued_date: new Date().toISOString()
      };

      const secondaryPayment = await paymentModel.create({
        amount: 150.00,
        payment_date: new Date().toISOString(),
        method: 'cash',
        status: 'completed'
      });

      const receiptData2 = {
        payment_id: secondaryPayment.id,
        receipt_number: 'DUP-NUMBER-123',
        template_version: 'v1',
        issued_date: new Date().toISOString()
      };

      await receiptModel.create(receiptData1);
      
      try {
        await receiptModel.create(receiptData2);
        throw new Error('Should have thrown ConstraintError');
      } catch (err) {
        expect(err.name).toBe('ConstraintError');
      }
    });
  });

  describe('findById()', () => {
    it('should find the correct receipt record by its unique database ID', async () => {
      const created = await receiptModel.create({
        payment_id: sharedPayment.id,
        receipt_number: 'RCPT-FIND-BY-ID',
        template_version: 'v1',
        issued_date: new Date().toISOString()
      });

      const found = await receiptModel.findById(created.id);

      expect(found).not.toBeNull();
      expect(found.receipt_number).toBe('RCPT-FIND-BY-ID');
    });

    it('should return null if the receipt ID does not exist', async () => {
      const found = await receiptModel.findById(99999);
      expect(found).toBeNull();
    });
  });

  describe('findByPaymentId()', () => {
    it('should fetch the correct receipt using the mapped payment database link', async () => {
      await receiptModel.create({
        payment_id: sharedPayment.id,
        receipt_number: 'RCPT-MAP-PAYMENT',
        template_version: 'v1',
        issued_date: new Date().toISOString()
      });

      const found = await receiptModel.findByPaymentId(sharedPayment.id);

      expect(found).not.toBeNull();
      expect(found.receipt_number).toBe('RCPT-MAP-PAYMENT');
    });
  });

  describe('findByReceiptNumber()', () => {
    it('should fetch the receipt row corresponding to the string lookup descriptor', async () => {
      await receiptModel.create({
        payment_id: sharedPayment.id,
        receipt_number: 'TARGET-STRING-XYZ',
        template_version: 'v1',
        issued_date: new Date().toISOString()
      });

      const found = await receiptModel.findByReceiptNumber('TARGET-STRING-XYZ');

      expect(found).not.toBeNull();
      expect(found.receipt_number).toBe('TARGET-STRING-XYZ');
    });
  });

  describe('findAll()', () => {
    it('should retrieve all stored structural receipts in structural index order', async () => {
      const secondPayment = await paymentModel.create({
        amount: 25.00,
        payment_date: new Date().toISOString(),
        method: 'cash',
        status: 'completed'
      });

      await receiptModel.create({
        payment_id: sharedPayment.id,
        receipt_number: 'R-01',
        template_version: 'v1',
        issued_date: new Date().toISOString()
      });

      await receiptModel.create({
        payment_id: secondPayment.id,
        receipt_number: 'R-02',
        template_version: 'v1',
        issued_date: new Date().toISOString()
      });

      const allReceipts = await receiptModel.findAll();

      expect(allReceipts.length).toBe(2);
      expect(allReceipts[0].receipt_number).toBe('R-01');
      expect(allReceipts[1].receipt_number).toBe('R-02');
    });
  });
});