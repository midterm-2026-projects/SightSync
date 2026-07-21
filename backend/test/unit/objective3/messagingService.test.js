import { describe, it, expect, beforeEach } from 'vitest';
import {
  createMessage,
  _resetMessageIdCounter,
  MESSAGE_VISIBILITIES
} from '../../../src/objective3/Models/message.js';

describe('Messaging Service - createMessage', () => {

  // Bago magsimula ang bawat test, i-reset ang ID counter para laging MSG-1 ang panimula
  beforeEach(() => {
    _resetMessageIdCounter();
  });

  describe('Success Cases', () => {
    it('should successfully create an internal message with correct properties', () => {
      const validPayload = {
        orderId: 'ORD-123',
        authorId: 'USR-999',
        authorRole: 'admin',
        body: 'This is an internal note for staff.',
        visibility: 'internal'
      };

      const message = createMessage(validPayload);

      expect(message.id).toBe('MSG-1');
      expect(message.orderId).toBe(validPayload.orderId);
      expect(message.authorId).toBe(validPayload.authorId);
      expect(message.authorRole).toBe(validPayload.authorRole);
      expect(message.body).toBe(validPayload.body);
      expect(message.visibility).toBe('internal');
      expect(message.createdAt).toBeDefined();
      // Sinisiguradong valid ISO string ang createdAt
      expect(isNaN(Date.parse(message.createdAt))).toBe(false);
    });

    it('should successfully create a customer-facing message and auto-increment the ID', () => {
      const payload1 = {
        orderId: 'ORD-123',
        authorId: 'USR-888',
        authorRole: 'staff',
        body: 'Hello Customer!',
        visibility: 'customer-facing'
      };

      const payload2 = {
        orderId: 'ORD-123',
        authorId: 'USR-777',
        authorRole: 'customer',
        body: 'Hello Staff!',
        visibility: 'customer-facing'
      };

      const msg1 = createMessage(payload1);
      const msg2 = createMessage(payload2);

      expect(msg1.id).toBe('MSG-1');
      expect(msg2.id).toBe('MSG-2');
      expect(msg1.body).toBe('Hello Customer!');
      expect(msg2.body).toBe('Hello Staff!');
    });

    it('should trim the message body whitespace', () => {
      const message = createMessage({
        orderId: 'ORD-123',
        authorId: 'USR-999',
        authorRole: 'admin',
        body: '   Message with messy spacing   ',
        visibility: 'internal'
      });

      expect(message.body).toBe('Message with messy spacing');
    });
  });

  describe('Validation Error Cases', () => {
    const validBasePayload = {
      orderId: 'ORD-123',
      authorId: 'USR-999',
      authorRole: 'admin',
      body: 'Valid body',
      visibility: 'internal'
    };

    it('should throw an error if orderId is missing', () => {
      expect(() => {
        createMessage({ ...validBasePayload, orderId: undefined });
      }).toThrow('Message requires an orderId');
    });

    it('should throw an error if authorId is missing', () => {
      expect(() => {
        createMessage({ ...validBasePayload, authorId: undefined });
      }).toThrow('Message requires an author');
    });

    it('should throw an error if authorRole is missing', () => {
      expect(() => {
        createMessage({ ...validBasePayload, authorRole: undefined });
      }).toThrow('Message requires an author');
    });

    it('should throw an error if body is missing, empty, or just spaces', () => {
      expect(() => {
        createMessage({ ...validBasePayload, body: '' });
      }).toThrow('Message body cannot be empty');

      expect(() => {
        createMessage({ ...validBasePayload, body: '   ' });
      }).toThrow('Message body cannot be empty');
    });

    it('should throw an error if visibility is invalid', () => {
      expect(() => {
        createMessage({ ...validBasePayload, visibility: 'public-everyone' });
      }).toThrow('Invalid visibility: public-everyone');
    });
  });
});
