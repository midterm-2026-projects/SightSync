import { describe, it, expect, beforeEach, vi } from 'vitest';

// ==========================================
// 1. MOCKS & HOISTED CONFIGURATIONS
// ==========================================

/**
 * Mock implementation logic:
 *
 * - getOrder(orderId)       → returns a basic order object
 * - canAccessOrder(user, order) → admin/staff always have access,
 *   customers only if their id matches the owner (U-CUST-1)
 * - canPostMessage(role)    → admin, staff, and customer all can post
 * - canViewMessage(role, msg) → customer sees only customer-facing,
 *   admin/staff see everything
 * - canPostInternalNote(role) → only admin/staff can post internal;
 *   customer requests get auto-downgraded
 */
const { getOrder, canAccessOrder, canViewMessage, canPostMessage, canPostInternalNote, MockAccessError } = vi.hoisted(() => {
  class AccessError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AccessError';
    }
  }

  const getOrder = vi.fn((orderId) => ({ id: orderId, customerId: 'U-CUST-1' }));
  const canAccessOrder = vi.fn((user, order) => {
    // admin/staff have universal access
    if (user.role === 'admin' || user.role === 'staff') return true;
    // customer only if they are the owner of the order
    return user.id === 'U-CUST-1';
  });
  const canViewMessage = vi.fn((role, message) => {
    // customer cannot see internal notes
    if (role === 'customer' && message.visibility === 'internal') return false;
    return true;
  });
  const canPostMessage = vi.fn(() => true);
  const canPostInternalNote = vi.fn((role) => role !== 'customer');

  return {
    getOrder,
    canAccessOrder,
    canViewMessage,
    canPostMessage,
    canPostInternalNote,
    MockAccessError: AccessError,
  };
});

vi.mock('../../../src/objective3/data/orders.js', () => ({
  getOrder,
}));

vi.mock('../../../src/objective3/config/permissions.js', () => ({
  canAccessOrder,
  canViewMessage,
  canPostMessage,
  canPostInternalNote,
}));

vi.mock('../../../src/objective3/errors.js', () => ({
  AccessError: MockAccessError,
}));

import { MessagingService } from '../../../src/objective3/Service/messagingService.js';

// Alias AccessError for assert.throws checks
const AccessError = MockAccessError;

const ORDER_ID = 'ORD-1001';
const admin = { id: 'U-ADMIN-1', role: 'admin' };
const staff = { id: 'U-STAFF-1', role: 'staff' };
const owner = { id: 'U-CUST-1', role: 'customer' };
const stranger = { id: 'U-CUST-2', role: 'customer' };

describe('MessagingService', () => {

  describe('Acceptance Criteria #1: Customers, staff, and admins can post and read messages tied to a specific order record', () => {

    it('admin can post a message to an order', () => {
      const service = new MessagingService();
      const msg = service.postMessage({
        orderId: ORDER_ID,
        author: admin,
        body: 'Checking on this order.',
        visibility: 'internal',
      });
      expect(msg.orderId).toBe(ORDER_ID);
      expect(msg.authorRole).toBe('admin');
    });

    it('staff can post a message to an order', () => {
      const service = new MessagingService();
      const msg = service.postMessage({
        orderId: ORDER_ID,
        author: staff,
        body: 'Packed and ready.',
        visibility: 'internal',
      });
      expect(msg.authorRole).toBe('staff');
    });

    it('customer (owner) can post and read messages on their own order', () => {
      const service = new MessagingService();
      service.postMessage({
        orderId: ORDER_ID,
        author: owner,
        body: 'When will this ship?',
        visibility: 'customer-facing',
      });

      const inbox = service.getMessagesForOrder(ORDER_ID, owner);
      expect(inbox.length).toBe(1);
      expect(inbox[0].body).toBe('When will this ship?');
    });
  });

  describe('Acceptance Criteria #2: Internal staff notes are completely hidden from the customer role', () => {

    it('internal staff note is hidden from the customer', () => {
      const service = new MessagingService();
      service.postMessage({
        orderId: ORDER_ID,
        author: staff,
        body: 'Customer called twice, seems impatient.',
        visibility: 'internal',
      });
      service.postMessage({
        orderId: ORDER_ID,
        author: staff,
        body: 'Your order has shipped!',
        visibility: 'customer-facing',
      });

      const customerView = service.getMessagesForOrder(ORDER_ID, owner);
      expect(customerView.length).toBe(1);
      expect(customerView[0].visibility).toBe('customer-facing');

      const adminView = service.getMessagesForOrder(ORDER_ID, admin);
      expect(adminView.length).toBe(2);
    });

    it('a customer cannot force a message to be "internal" — auto-downgraded', () => {
      const service = new MessagingService();
      const msg = service.postMessage({
        orderId: ORDER_ID,
        author: owner,
        body: 'trying to post an internal note',
        visibility: 'internal',
      });
      expect(msg.visibility).toBe('customer-facing');
    });
  });

  describe('Acceptance Criteria #3: A user cannot post or read messages for an order they do not own', () => {

    it('a customer cannot READ messages for an order they do not own', () => {
      const service = new MessagingService();
      service.postMessage({
        orderId: ORDER_ID,
        author: owner,
        body: 'my private question',
        visibility: 'customer-facing',
      });

      expect(() => service.getMessagesForOrder(ORDER_ID, stranger)).toThrow(AccessError);
    });

    it('a customer cannot POST messages to an order they do not own', () => {
      const service = new MessagingService();
      expect(() =>
        service.postMessage({
          orderId: ORDER_ID,
          author: stranger,
          body: 'trying to butt in',
          visibility: 'customer-facing',
        })
      ).toThrow(AccessError);
    });

    it('admin and staff CAN read/post on any order, including ones they do not own', () => {
      const service = new MessagingService();
      expect(() =>
        service.postMessage({
          orderId: ORDER_ID,
          author: staff,
          body: 'staff note',
          visibility: 'internal',
        })
      ).not.toThrow();
      expect(() => service.getMessagesForOrder(ORDER_ID, admin)).not.toThrow();
    });
  });
});
