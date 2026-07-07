import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import db from '../../../../config/db.js';
import ReceiptModel from '../models/receipt.js';
import PaymentModel from '../models/payment.js';
import { ConstraintError } from '../middleware/errors.js';

describe('ReceiptModel Integration Tests (PostgreSQL)', () => {
  let receiptModel;
  let paymentModel;
  let sharedPayment;

  beforeEach(async () => {
    receiptModel = new ReceiptModel(db);
    paymentModel = new PaymentModel(db);

    // Seed required relational dependency row
    sharedPayment = await paymentModel.create({
      amount: 89.99,
      payment_date: new Date().toISOString(),
      method: 'online',
      status: 'completed'
    });
  });

  afterEach(async () => {
    await db.query('TRUNCATE TABLE receipts, payments RESTART IDENTITY CASCADE;');
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
      await expect(receiptModel.create(receiptData2)).rejects.toThrow(ConstraintError);
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