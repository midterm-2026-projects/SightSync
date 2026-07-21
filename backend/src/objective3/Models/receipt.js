import { ConstraintError } from '../middleware/errors.js';
import pool from '../../../database/db.js';

class ReceiptModel {
  constructor(db = pool) {
    this.db = db;
  }

  async create({ payment_id, receipt_number, template_version, issued_date }) {
    try {
      const query = `
        INSERT INTO receipts (payment_id, receipt_number, template_version, issued_date)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const res = await this.db.query(query, [payment_id, receipt_number, template_version, issued_date]);
      return res.rows[0];
    } catch (err) {
      const error = new ConstraintError(`Failed to create receipt: ${err.message}`, err);
      error.name = 'ConstraintError';
      throw error;
    }
  }

  async findById(id) {
    const res = await this.db.query('SELECT * FROM receipts WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findByPaymentId(payment_id) {
    const res = await this.db.query('SELECT * FROM receipts WHERE payment_id = $1', [payment_id]);
    return res.rows[0] || null;
  }

  async findByReceiptNumber(receipt_number) {
    const res = await this.db.query('SELECT * FROM receipts WHERE receipt_number = $1', [receipt_number]);
    return res.rows[0] || null;
  }

  async findAll() {
    const res = await this.db.query('SELECT * FROM receipts ORDER BY id');
    return res.rows;
  }

  async update(id, { template_version, issued_date }) {
    try {
      const query = `
        UPDATE receipts 
        SET template_version = $1, issued_date = $2
        WHERE id = $3 
        RETURNING *;
      `;
      const res = await this.db.query(query, [template_version, issued_date, id]);
      return res.rows[0] || null;
    } catch (err) {
      const error = new ConstraintError(`Failed to update receipt: ${err.message}`, err);
      error.name = 'ConstraintError';
      throw error;
    }
  }

  async delete(id) {
    const res = await this.db.query('DELETE FROM receipts WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
}

export default ReceiptModel;