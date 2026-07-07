import { ConstraintError } from '../middleware/Errors.js';

class DepositModel {
  constructor(db) {
    this.db = db;
  }

  async create({ amount, deposit_date, status = 'held' }) {
    try {
      const query = `
        INSERT INTO deposits (amount, deposit_date, status)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const res = await this.db.query(query, [amount, deposit_date, status]);
      return res.rows[0];
    } catch (err) {
      throw new ConstraintError(`Failed to create deposit: ${err.message}`, err);
    }
  }

  async findById(id) {
    const res = await this.db.query('SELECT * FROM deposits WHERE id = $1', [id]);
    return res.rows[0] || null;
  }

  async findAll() {
    const res = await this.db.query('SELECT * FROM deposits ORDER BY id');
    return res.rows;
  }

  async updateStatus(id, status) {
    try {
      const query = `
        UPDATE deposits 
        SET status = $1 
        WHERE id = $2 
        RETURNING *;
      `;
      const res = await this.db.query(query, [status, id]);
      return res.rows[0] || null;
    } catch (err) {
      throw new ConstraintError(`Failed to update deposit status: ${err.message}`, err);
    }
  }

  async delete(id) {
    const res = await this.db.query('DELETE FROM deposits WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
}

export default DepositModel;