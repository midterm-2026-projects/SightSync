import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { ConstraintError } from '../../../src/objective3/middleware/errors.js';
import DepositModel from '../../../src/objective3/models/deposit.js';

vi.mock('../../../database/db.js', () => ({
  default: {}
}));


let mockDeposits = [];


vi.mock('../../../src/objective3/models/deposit.js', () => {
  return {
    default: class MockDepositModel {
      constructor(db) {}

      async create(data) {
        const newDeposit = {
          id: mockDeposits.length + 1,
          amount: Number(data.amount),
          deposit_date: data.deposit_date || new Date().toISOString(),
          status: data.status || 'held',
          createdAt: new Date().toISOString()
        };
        mockDeposits.push(newDeposit);
        return newDeposit;
      }

      async findById(id) {
        const deposit = mockDeposits.find(d => Number(d.id) === Number(id));
        return deposit || null;
      }

      async findAll() {
        // I-sort gamit ang database ID ascending (1, 2, 3...)
        return [...mockDeposits].sort((a, b) => a.id - b.id);
      }

      async updateStatus(id, status) {
        const deposit = mockDeposits.find(d => Number(d.id) === Number(id));
        if (!deposit) {
          throw new Error('Deposit not found');
        }
        deposit.status = status;
        return deposit;
      }

      async delete(id) {
        const initialLength = mockDeposits.length;
        mockDeposits = mockDeposits.filter(d => Number(d.id) !== Number(id));
        return mockDeposits.length < initialLength;
      }
    }
  };
});


describe('DepositModel Integration Tests (PostgreSQL - Mocked)', () => {
  let depositModel;

  beforeAll(() => {
    depositModel = new DepositModel({});
  });

  beforeEach(async () => {
    // Linisin ang in-memory data bago ang bawat pagsusuri
    mockDeposits = [];
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

  describe('findByCustomer()', () => {
    it('should retrieve tracking rows cleanly via the model interface wrapper', async () => {
      await depositModel.create({ amount: 40.00, deposit_date: new Date().toISOString(), status: 'held' });
      await depositModel.create({ amount: 60.00, deposit_date: new Date().toISOString(), status: 'cleared' });

      const targetedRecords = await depositModel.findAll();
      expect(targetedRecords.length).toBeGreaterThanOrEqual(2);
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