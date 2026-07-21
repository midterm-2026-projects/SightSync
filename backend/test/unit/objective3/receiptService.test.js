import { describe, it, expect, vi } from 'vitest';
import {
  TEMPLATE_VERSION,
  BUSINESS_INFO,
  generateReceipt,
  conformsToTemplate,
  issueReceipt,
  buildReceiptNumber,
  formatCurrency,
} from '../../../src/objective3/Service/receiptService.js';

describe('buildReceiptNumber', () => {
  it('should build a receipt number using the year and a zero-padded payment id', () => {
    expect(buildReceiptNumber(42, '2026-07-20T10:00:00.000Z')).toBe('RCPT-2026-000042');
  });
});

describe('formatCurrency', () => {
  it('should format an amount as USD currency by default', () => {
    expect(formatCurrency(19.99)).toBe('$19.99');
  });
});

describe('generateReceipt', () => {
  const payment = {
    id: 7,
    amount: 100,
    payment_date: '2026-07-20',
    method: 'card',
    status: 'completed',
  };

  it('should throw when no payment is provided', () => {
    expect(() => generateReceipt(null)).toThrow('generateReceipt requires a payment.');
  });

  it('should build a receipt that matches the fixed template', () => {
    const receipt = generateReceipt(payment, '2026-07-20T10:00:00.000Z');

    expect(receipt.receiptNumber).toBe('RCPT-2026-000007');
    expect(receipt.templateVersion).toBe(TEMPLATE_VERSION);
    expect(receipt.business).toEqual(BUSINESS_INFO);
    expect(receipt.payment).toEqual({
      id: 7,
      amount: 100,
      formattedAmount: '$100.00',
      currency: 'USD',
      paymentDate: '2026-07-20',
      method: 'card',
      status: 'completed',
    });
    expect(conformsToTemplate(receipt)).toBe(true);
  });
});

describe('conformsToTemplate', () => {
  it('should return false for a receipt missing required top-level keys', () => {
    expect(conformsToTemplate({ receiptNumber: 'RCPT-2026-000001' })).toBe(false);
  });

  it('should return false for a receipt with extra top-level keys', () => {
    const receipt = generateReceipt({ id: 1, amount: 10 });
    expect(conformsToTemplate({ ...receipt, extra: true })).toBe(false);
  });

  it('should return false for a non-object input', () => {
    expect(conformsToTemplate(null)).toBe(false);
    expect(conformsToTemplate('not a receipt')).toBe(false);
  });
});

describe('issueReceipt', () => {
  function makeDeps({ payment, existingReceipt = null } = {}) {
    return {
      paymentModel: { findById: vi.fn().mockReturnValue(payment) },
      receiptModel: {
        findByPaymentId: vi.fn().mockReturnValue(existingReceipt),
        create: vi.fn(),
      },
    };
  }

  it('should throw when the payment does not exist', () => {
    const deps = makeDeps({ payment: null });

    expect(() => issueReceipt(deps, 999)).toThrow('Payment 999 not found.');
  });

  it('should generate and persist a new receipt when none exists yet', () => {
    const payment = { id: 5, amount: 30, payment_date: '2026-07-20', method: 'cash', status: 'completed' };
    const deps = makeDeps({ payment });

    const receipt = issueReceipt(deps, 5);

    expect(deps.receiptModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_id: 5,
        receipt_number: receipt.receiptNumber,
        template_version: receipt.templateVersion,
      })
    );
    expect(conformsToTemplate(receipt)).toBe(true);
  });

  it('should return the existing receipt info without creating a new one', () => {
    const payment = { id: 5, amount: 30, payment_date: '2026-07-20', method: 'cash', status: 'completed' };
    const existingReceipt = {
      receipt_number: 'RCPT-2025-000005',
      template_version: 'v0',
      issued_date: '2025-01-01T00:00:00.000Z',
    };
    const deps = makeDeps({ payment, existingReceipt });

    const receipt = issueReceipt(deps, 5);

    expect(receipt.receiptNumber).toBe('RCPT-2025-000005');
    expect(receipt.templateVersion).toBe('v0');
    expect(deps.receiptModel.create).not.toHaveBeenCalled();
  });
});