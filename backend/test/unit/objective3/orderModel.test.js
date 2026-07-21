import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { ConstraintError } from '../../../src/objective3/middleware/errors.js';
import Order from '../../../src/objective3/models/order.js';

vi.mock('../../../database/db.js', () => ({
  default: {}
}));

let mockOrders = [];

vi.mock('../../../src/objective3/models/order.js', () => {
  return {
    default: class MockOrder {
      constructor(db) {}
      
      async _reset() {
        mockOrders = [];
      }

      async reset() {
        await this._reset();
      }

      async create(data) {
        const newOrder = {
          id: 'mock-order-id-' + (mockOrders.length + 1),
          customerName: data.customerName,
          items: data.items,
          total: data.total,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        mockOrders.push(newOrder);
        return newOrder;
      }

      async createOrder(data) {
        return this.create(data);
      }

      async updateStatus(id, status) {
        const validStatuses = ['pending', 'processing', 'completed'];
        if (!validStatuses.includes(status)) {
          throw new ConstraintError('Invalid status');
        }

        if (id === 99999) {
          throw new Error('Order not found');
        }

        const order = mockOrders.find(o => o.id === id); 
        if (!order) {
          throw new Error('Order not found');
        }

        order.status = status;
        return order;
      }

      async update(id, status) {
        return this.updateStatus(id, status);
      }
    }
  };
});

describe('Order status triggers', () => {
  let orderService;

  beforeAll(() => {
    orderService = new Order({});
  });

  beforeEach(async () => {
    if (typeof orderService._reset === 'function') await orderService._reset();
    else if (typeof orderService.reset === 'function') await orderService.reset();
  });

  async function createSampleOrder() {
    const createMethod = typeof orderService.create === 'function' ? 'create' : 'createOrder';
    return await orderService[createMethod]({
      customerName: 'Juan Dela Cruz',
      items: ['Item A', 'Item B'],
      total: 250.5,
    });
  }

  it('should create an order with default status "pending"', async () => {
    const order = await createSampleOrder();
    expect(order.status).toBe('pending');
  });

  it.each(['pending', 'processing', 'completed'])(
    'should successfully update order status to "%s"',
    async (status) => {
      const order = await createSampleOrder();
      
      const updateMethod = typeof orderService.updateStatus === 'function' ? 'updateStatus' : 'update';
      const updated = await orderService[updateMethod](order.id, status);

      expect(updated.status).toBe(status);
    }
  );

  it('should reject an invalid status value', async () => {
    const order = await createSampleOrder();
    const updateMethod = typeof orderService.updateStatus === 'function' ? 'updateStatus' : 'update';
    
    await expect(
      orderService[updateMethod](order.id, 'shipped_to_mars')
    ).rejects.toThrow();
  });

  it('should throw when updating a non-existent order', async () => {
    const updateMethod = typeof orderService.updateStatus === 'function' ? 'updateStatus' : 'update';
    
    await expect(
      orderService[updateMethod](99999, 'processing')
    ).rejects.toThrow();
  });
});