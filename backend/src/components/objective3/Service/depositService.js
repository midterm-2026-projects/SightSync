import db from '../../../../config/db.js';
import DepositModel from '../models/deposit.js'; // Inayos ang malaking titik 'M'

const depositModel = new DepositModel(db);

/**
 * Submits and persists a new deposit record
 */
export const createDeposit = (depositData) => {
  if (!depositData.customer_id) {
    throw new Error('Customer ID is required to register a deposit');
  }
  if (depositData.amount === undefined || depositData.amount <= 0) {
    throw new Error('Deposit amount must be greater than zero');
  }
  if (!depositData.deposit_date) {
    throw new Error('Deposit date is required');
  }

  return depositModel.create(depositData);
};

/**
 * Retrieves a single deposit record by its database ID
 */
export const getDepositById = (id) => {
  return depositModel.findById(Number(id));
};

/**
 * Retrieves all registered deposits in the database
 */
export const getAllDeposits = () => {
  return depositModel.findAll();
};

/**
 * Fetches all deposits associated with a specific customer ID
 */
export const getDepositsByCustomer = (customerId) => {
  return depositModel.findByCustomer(Number(customerId));
};

/**
 * Updates the administrative/clearing status of a deposit
 */
export const updateDepositStatus = (id, status) => {
  if (!status || status.trim() === '') {
    throw new Error('A valid status string must be provided');
  }
  return depositModel.updateStatus(Number(id), status);
};

/**
 * Removes a deposit record from the database
 */
export const deleteDeposit = (id) => {
  return depositModel.delete(Number(id));
};