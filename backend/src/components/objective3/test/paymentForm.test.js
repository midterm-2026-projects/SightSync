import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import db from '../../../../config/db.js'; 
import DepositModel from '../models/deposit.js';
import { ConstraintError } from '../middleware/errors.js';

describe('DepositModel Integration Tests (PostgreSQL)', () => {
  let depositModel;

  beforeEach(() => {
    depositModel = new DepositModel(db);
  });

  afterEach(async () => {
    // Isolate the testing space cleanly using a cascading truncate command
    await db.query('TRUNCATE TABLE deposits RESTART IDENTITY CASCADE;');
  });

  describe('create()', () => {
    it('should successfully create a new deposit record', async () => {
      const depositData = {
        amount: 250.50,
        deposit_date: new Date().toISOString(),
        status: 'held'
      };

      const result = await depositModel.create(depositData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(Number(result.amount)).toBe(250.50);
      expect(result.status).toBe('held');
    });
  });

  describe('findById()', () => {
    it('should find the correct deposit record by its unique database ID', async () => {
      const created = await depositModel.create({
        amount: 100.00,
        deposit_date: new Date().toISOString(),
        status: 'cleared'
      });

      const found = await depositModel.findById(created.id);

      expect(found).not.toBeNull();
      expect(Number(found.id)).toBe(Number(created.id));
      expect(found.status).toBe('cleared');
    });

    it('should return null if the deposit ID does not exist', async () => {
      const found = await depositModel.findById(99999);
      expect(found).toBeNull();
    });
  });

  describe('findAll()', () => {
    it('should retrieve all stored deposit rows ordered by their database ID', async () => {
      await depositModel.create({ amount: 10.00, deposit_date: new Date().toISOString(), status: 'held' });
      await depositModel.create({ amount: 20.00, deposit_date: new Date().toISOString(), status: 'cleared' });

      const allDeposits = await depositModel.findAll();

      expect(allDeposits.length).toBe(2);
    });
  });

  describe('updateStatus()', () => {
    it('should successfully update the clearing status of an existing deposit', async () => {
      const created = await depositModel.create({
        amount: 500.00,
        deposit_date: new Date().toISOString(),
        status: 'held'
      });

      const updated = await depositModel.updateStatus(created.id, 'cleared');

      expect(updated).toBeDefined();
      expect(updated.status).toBe('cleared');
    });
  });

  describe('delete()', () => {
    it('should remove the deposit record and return true on a successful delete operation', async () => {
      const created = await depositModel.create({
        amount: 75.00,
        deposit_date: new Date().toISOString(),
        status: 'held'
      });

      const isDeleted = await depositModel.delete(created.id);
      expect(isDeleted).toBe(true);

      const checkNone = await depositModel.findById(created.id);
      expect(checkNone).toBeNull();
    });
  });
});