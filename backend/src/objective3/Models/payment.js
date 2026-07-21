import { ConstraintError } from '../middleware/errors.js';
import pool from '../../../database/db.js';

class PaymentModel {
  constructor(db = pool) {
    this.db = db;
  }

  async create({ amount, payment_date, method = 'cash', status = 'completed' }) {
    try {
      const query = `
        INSERT INTO payments (amount, payment_date, method, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const res = await this.db.query(query, [amount, payment_date, method, status]);
      return res.rows[0];
    } catch (err) {
      throw new ConstraintError(`Failed to create payment: ${err.message}`, err);
    }
  }

  async findById(id) {
    const res = await this.db.query('SELECT * FROM payments WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findAll() {
    const res = await this.db.query('SELECT * FROM payments ORDER BY id');
    return res.rows;
  }

  async updateStatus(id, status) {
    try {
      const query = `
        UPDATE payments 
        SET status = $1 
        WHERE id = $2 
        RETURNING *;
      `;
      const res = await this.db.query(query, [status, id]);
      return res.rows[0] || null;
    } catch (err) {
      throw new ConstraintError(`Failed to update payment status: ${err.message}`, err);
    }
  }

  async delete(id) {
    try {
      const res = await this.db.query('DELETE FROM payments WHERE id = $1', [id]);
      return res.rowCount > 0;
    } catch (err) {
      throw new ConstraintError(`Failed to delete payment: ${err.message}`, err);
    }
  }
}

export default PaymentModel;