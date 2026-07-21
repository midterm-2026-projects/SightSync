import { v4 as uuidv4 } from 'uuid';
import { ConstraintError } from '../middleware/errors.js';

const VALID_STATUSES = ['pending', 'processing', 'completed'];

class OrderModel {
  constructor(db) {
    this.db = db;
  }

  static isValidStatus(status) {
    return VALID_STATUSES.includes(status);
  }

  async create({ customerName, items, total }) {
    try {
      const id = uuidv4();
      const status = 'pending';
      const now = new Date().toISOString();

      const query = `
        INSERT INTO orders (id, customer_name, items, total, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING 
          id, 
          customer_name AS "customerName", 
          items, 
          total, 
          status, 
          created_at AS "createdAt", 
          updated_at AS "updatedAt";
      `;

      const itemsPayload = Array.isArray(items) ? JSON.stringify(items) : items;

      const res = await this.db.query(query, [id, customerName, itemsPayload, total, status, now, now]);
      return res.rows[0];
    } catch (err) {
      throw new ConstraintError(`Failed to create order: ${err.message}`, err);
    }
  }

  async findById(id) {
    const query = `
      SELECT 
        id, 
        customer_name AS "customerName", 
        items, 
        total, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM orders 
      WHERE id = $1;
    `;
    const res = await this.db.query(query, [id]);
    return res.rows[0] || null;
  }

  async update(id, updates) {
    try {
      const currentOrder = await this.findById(id);
      if (!currentOrder) return null;

      const updatedFields = { ...currentOrder, ...updates, updatedAt: new Date().toISOString() };
      
      const query = `
        UPDATE orders
        SET 
          customer_name = $1, 
          items = $2, 
          total = $3, 
          status = $4, 
          updated_at = $5
        WHERE id = $6
        RETURNING 
          id, 
          customer_name AS "customerName", 
          items, 
          total, 
          status, 
          created_at AS "createdAt", 
          updated_at AS "updatedAt";
      `;

      const itemsPayload = Array.isArray(updatedFields.items) 
        ? JSON.stringify(updatedFields.items) 
        : updatedFields.items;

      const res = await this.db.query(query, [
        updatedFields.customerName,
        itemsPayload,
        updatedFields.total,
        updatedFields.status,
        updatedFields.updatedAt,
        id
      ]);

      return res.rows[0] || null;
    } catch (err) {
      throw new ConstraintError(`Failed to update order: ${err.message}`, err);
    }
  }

  async findAll() {
    const query = `
      SELECT 
        id, 
        customer_name AS "customerName", 
        items, 
        total, 
        status, 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM orders
      ORDER BY created_at ASC;
    `;
    const res = await this.db.query(query);
    return res.rows;
  }

  async _reset() {
    try {
      await this.db.query('TRUNCATE TABLE orders RESTART IDENTITY CASCADE;');
    } catch (err) {
      throw new ConstraintError(`Failed to reset orders table: ${err.message}`, err);
    }
  }
}

export { OrderModel as Order, VALID_STATUSES };
export default OrderModel;