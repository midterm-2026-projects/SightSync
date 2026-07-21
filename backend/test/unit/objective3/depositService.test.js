import { describe, it, expect, beforeEach, vi } from 'vitest';

// ==========================================
// 1. MOCKS & HOISTED CONFIGURATIONS
// ==========================================
const { mockDepositModelMethods } = vi.hoisted(() => {
  return {
    mockDepositModelMethods: {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
    }
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

// I-inject ang mocks direkta sa prototype ng DepositModel constructor
vi.mock('../../../src/objective3/models/deposit.js', () => {
  class MockDepositModel {
    constructor(db) {
      this.db = db; // Sinusunod ang base constructor assignment[cite: 1]
    }
    create(...args) { return mockDepositModelMethods.create(...args); }
    findById(...args) { return mockDepositModelMethods.findById(...args); }
    findAll(...args) { return mockDepositModelMethods.findAll(...args); }
    updateStatus(...args) { return mockDepositModelMethods.updateStatus(...args); }
    delete(...args) { return mockDepositModelMethods.delete(...args); }
  }

  return {
    default: MockDepositModel
  };
});

// ==========================================
// 2. IMPORT SERVICE & TARGET DEPENDENCIES
// ==========================================
import * as depositService from '../../../src/objective3/Service/depositService.js';

const createDeposit = depositService.createDeposit || (depositService.default && depositService.default.createDeposit);
const getDepositById = depositService.getDepositById || (depositService.default && depositService.default.getDepositById);
const getAllDeposits = depositService.getAllDeposits || (depositService.default && depositService.default.getAllDeposits);
const getDepositsByCustomer = depositService.getDepositsByCustomer || (depositService.default && depositService.default.getDepositsByCustomer);
const updateDepositStatus = depositService.updateDepositStatus || (depositService.default && depositService.default.updateDepositStatus);
const deleteDeposit = depositService.deleteDeposit || (depositService.default && depositService.default.deleteDeposit);

// ==========================================
// 3. SERVICE UNIT TESTS
// ==========================================
describe('Deposit Service Tests', () => {

  beforeEach(() => {
    mockDepositModelMethods.create.mockReset();
    mockDepositModelMethods.findById.mockReset();
    mockDepositModelMethods.findAll.mockReset();
    mockDepositModelMethods.updateStatus.mockReset();
    mockDepositModelMethods.delete.mockReset();
  });

  describe('createDeposit', () => {
    it('should successfully create a deposit with valid data', async () => {
      const validData = { customer_id: 1, amount: 500, deposit_date: '2026-07-20' };
      const expectedResult = { id: 1, ...validData, status: 'held' };
      
      mockDepositModelMethods.create.mockResolvedValue(expectedResult);

      const result = await createDeposit(validData);

      expect(result).toEqual(expectedResult);
      expect(mockDepositModelMethods.create).toHaveBeenCalledWith(validData);
    });

    it('should throw an error if customer_id is missing', () => {
      const invalidData = { amount: 500, deposit_date: '2026-07-20' };

      expect(() => createDeposit(invalidData)).toThrow();
    });

    it('should throw an error if amount is 0 or negative', () => {
      const invalidData = { customer_id: 1, amount: 0, deposit_date: '2026-07-20' };

      expect(() => createDeposit(invalidData)).toThrow();
    });

    it('should throw an error if deposit_date is missing', () => {
      const invalidData = { customer_id: 1, amount: 100 };

      expect(() => createDeposit(invalidData)).toThrow();
    });
  });

  describe('getDepositById', () => {
    it('should return deposit data when a valid ID is provided', async () => {
      const mockDeposit = { id: 10, customer_id: 1, amount: 200 };
      mockDepositModelMethods.findById.mockResolvedValue(mockDeposit);

      // Ginamit ang matching integer type data sign para hindi mag-fail ang SQL placeholder mappings[cite: 1]
      const result = await getDepositById(10);

      expect(result).toEqual(mockDeposit);
      expect(mockDepositModelMethods.findById).toHaveBeenCalledWith(10);
    });
  });

  describe('getAllDeposits', () => {
    it('should return a list of all deposits', async () => {
      const mockList = [{ id: 1, amount: 100 }, { id: 2, amount: 200 }];
      mockDepositModelMethods.findAll.mockResolvedValue(mockList);

      const result = await getAllDeposits();

      expect(result).toEqual(mockList);
      expect(mockDepositModelMethods.findAll).toHaveBeenCalled();
    });
  });

  describe('getDepositsByCustomer', () => {
    it('should throw an error because findByCustomer is not implemented in DepositModel', () => {
      mockDepositModelMethods.findByCustomer = undefined;

      expect(() => getDepositsByCustomer(1)).toThrow();
    });
  });

  describe('updateDepositStatus', () => {
    it('should successfully update status with valid inputs', async () => {
      const updatedDeposit = { id: 1, status: 'approved' };
      mockDepositModelMethods.updateStatus.mockResolvedValue(updatedDeposit);

      const result = await updateDepositStatus(1, 'approved');

      expect(result).toEqual(updatedDeposit);
      expect(mockDepositModelMethods.updateStatus).toHaveBeenCalledWith(1, 'approved');
    });

    it('should throw an error if status is empty or invalid', () => {
      expect(() => updateDepositStatus(1, ' ')).toThrow();
    });
  });

  describe('deleteDeposit', () => {
    it('should call model delete method and return true/false', async () => {
      mockDepositModelMethods.delete.mockResolvedValue(true);

      const result = await deleteDeposit(5);

      expect(result).toBe(true);
      expect(mockDepositModelMethods.delete).toHaveBeenCalledWith(5);
    });
  });
});