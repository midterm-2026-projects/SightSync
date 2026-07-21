import { describe, it, expect, beforeEach, vi } from 'vitest';

// ==========================================
// 1. MOCKS & HOISTED CONFIGURATIONS
// ==========================================
const { mockOrderModel, mockEventBus } = vi.hoisted(() => {
  return {
    mockOrderModel: {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      update: vi.fn(),
    },
    mockEventBus: {
      on: vi.fn(),
      emit: vi.fn(),
    },
  };
});

// Mock ConstraintError to avoid real error module dependency
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

vi.mock('../../../src/objective3/middleware/errors.js', () => {
  return { ConstraintError: MockConstraintError };
});

// Mock database layer cleanly to ensure global service instantiation does not fail
vi.mock('../../../database/db.js', () => ({ 
  default: { 
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }) 
  } 
}));

vi.mock('../../../src/objective3/utils/eventBus.js', () => ({ default: mockEventBus }));

// Direktang inilalagay ang prototype binding sa mismong runtime definition block
vi.mock('../../../src/objective3/models/order.js', () => {
  class MockOrderModel {
    constructor(db) {}
    create(...args) { return mockOrderModel.create(...args); }
    findById(...args) { return mockOrderModel.findById(...args); }
    findAll(...args) { return mockOrderModel.findAll(...args); }
    update(...args) { return mockOrderModel.update(...args); }
  }

  return {
    default: MockOrderModel,
    VALID_STATUSES: ['pending', 'processing', 'completed'],
  };
});

// ==========================================
// 2. IMPORT SERVICE (MATCH ACTUAL FOLDER CASING)
// ==========================================
import orderService from '../../../src/objective3/Service/orderService.js';

// ==========================================
// 3. SERVICE UNIT TESTS
// ==========================================
describe('Order Service Unit Tests', () => {
  beforeEach(() => {
    mockOrderModel.create.mockReset();
    mockOrderModel.findById.mockReset();
    mockOrderModel.findAll.mockReset();
    mockOrderModel.update.mockReset();
    mockEventBus.emit.mockReset();
  });

  describe('createOrder()', () => {
    it('should successfully create and return an order record', async () => {
      const inputData = {
        customerName: 'Juan Dela Cruz',
        items: [{ id: 10, name: 'Item A', price: 50 }],
        total: 50.0,
      };

      mockOrderModel.create.mockResolvedValue({ id: 'mock-uuid-1', ...inputData, status: 'pending' });

      const result = await orderService.createOrder(inputData)
      expect(mockOrderModel.create).toHaveBeenCalledWith(inputData);
      expect(result).toBeDefined();
      expect(result.id).toBe('mock-uuid-1');
      expect(result.customerName).toBe('Juan Dela Cruz');
    });
  });

  describe('getOrder()', () => {
    it('should retrieve a single order by its ID reference', async () => {
      const mockOrder = { id: 'mock-uuid-1', customerName: 'Alice', total: 120.0 };
      mockOrderModel.findById.mockResolvedValue(mockOrder);

      const result = await orderService.getOrder('mock-uuid-1');
      expect(mockOrderModel.findById).toHaveBeenCalledWith('mock-uuid-1');
      expect(result).toEqual(mockOrder);
    });

    it('should return null or undefined if the order does not exist', async () => {
      mockOrderModel.findById.mockResolvedValue(null);

      const result = await orderService.getOrder('non-existent-id');
      expect(mockOrderModel.findById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getAllOrders()', () => {
    it('should retrieve an array listing all registered database orders', async () => {
      const mockOrdersList = [{ id: '1', total: 30 }, { id: '2', total: 60 }];
      mockOrderModel.findAll.mockResolvedValue(mockOrdersList);

      const result = await orderService.getAllOrders();
      expect(mockOrderModel.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockOrdersList);
    });
  });

  describe('updateStatus()', () => {
    it('should update status and emit a state change event when inputs are valid', async () => {
      const existingOrder = {
        id: 'mock-uuid-55',
        customerName: 'Bob',
        total: 75.0,
        status: 'pending',
      };
      const updatedOrder = { ...existingOrder, status: 'processing' };

      mockOrderModel.findById.mockResolvedValue(existingOrder);
      mockOrderModel.update.mockResolvedValue(updatedOrder);

      const result = await orderService.updateStatus('mock-uuid-55', 'processing');
      expect(mockOrderModel.findById).toHaveBeenCalledWith('mock-uuid-55');
      expect(mockOrderModel.update).toHaveBeenCalledWith('mock-uuid-55', { status: 'processing' });

      expect(mockEventBus.emit).toHaveBeenCalledWith('order:statusChanged', {
        previousStatus: 'pending',
        order: updatedOrder,
      });

      expect(result.status).toBe('processing');
    });

    it('should throw a 400 error when an unsupported status is supplied', async () => {
      await expect(orderService.updateStatus('mock-uuid-55', 'invalid_status_value')).rejects.toThrow(
        'Invalid status "invalid_status_value". Must be one of: pending, processing, completed'
      );

      expect(mockOrderModel.update).not.toHaveBeenCalled();
      expect(mockEventBus.emit).not.toHaveBeenCalled();
    });

    it('should throw a 404 error when targeting a non-existent order ID', async () => {
      mockOrderModel.findById.mockResolvedValue(null);

      await expect(orderService.updateStatus('999', 'completed')).rejects.toThrow(
        'Order with id "999" not found'
      );

      expect(mockOrderModel.update).not.toHaveBeenCalled();
      expect(mockEventBus.emit).not.toHaveBeenCalled();
    });
  });
});
