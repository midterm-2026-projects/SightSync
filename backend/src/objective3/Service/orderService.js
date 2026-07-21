import OrderModel from '../Models/order.js';
import eventBus from '../utils/eventBus.js';

class OrderService {
  constructor(db) {
    this.orderModel = new OrderModel(db);
  }

  async createOrder(data) {
    return await this.orderModel.create(data);
  }

  async getOrder(id) {
    return await this.orderModel.findById(id);
  }

  async getAllOrders() {
    return await this.orderModel.findAll();
  }

  async updateStatus(id, status) {
    const validStatuses = ['pending', 'processing', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status "${status}". Must be one of: pending, processing, completed`);
    }

    const existingOrder = await this.orderModel.findById(id);
    if (!existingOrder) {
      throw new Error(`Order with id "${id}" not found`);
    }

    const previousStatus = existingOrder.status;
    const updatedOrder = await this.orderModel.update(id, { status });

    // Nag-e-emit ng tracking event ngunit walang nakakabit na notification listeners dito
    if (eventBus && typeof eventBus.emit === 'function') {
      eventBus.emit('order:statusChanged', {
        previousStatus,
        order: updatedOrder
      });
    }

    return updatedOrder;
  }
}

// I-instantiate gamit ang dummy db instance para gumana ang default export sa test context proxy
const defaultDb = {}; 
const orderServiceInstance = new OrderService(defaultDb);

export default orderServiceInstance;