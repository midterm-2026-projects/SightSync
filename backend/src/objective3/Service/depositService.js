import DepositModel from "../Models/deposit.js";
import { ConstraintError } from "../middleware/errors.js";
import pool from "../../../database/db.js";

const depositModel = new DepositModel(pool);

/**
 * Creates a new deposit after validating required inputs.
 */
export function createDeposit(data) {
  if (
    data.amount === undefined ||
    data.amount === null ||
    Number(data.amount) <= 0
  ) {
    throw new Error("Deposit amount must be greater than zero");
  }

  if (!data.deposit_date) {
    throw new Error("Deposit date is required");
  }

  return depositModel.create(data);
}

/**
 * Retrieves a deposit by its ID.
 */
export function getDepositById(id) {
  return depositModel.findById(Number(id));
}

/**
 * Retrieves all deposits.
 */
export function getAllDeposits() {
  return depositModel.findAll();
}

/**
 * Retrieves deposits by customer.
 */
export function getDepositsByCustomer(customerId) {
  if (typeof depositModel.findByCustomer !== "function") {
    throw new Error(
      "findByCustomer() is not implemented in DepositModel."
    );
  }

  return depositModel.findByCustomer(Number(customerId));
}

/**
 * Updates deposit status.
 */
export function updateDepositStatus(id, status) {
  if (
    typeof status !== "string" ||
    status.trim() === ""
  ) {
    throw new Error("A valid status string must be provided");
  }

  return depositModel.updateStatus(Number(id), status);
}

/**
 * Deletes deposit.
 */
export function deleteDeposit(id) {
  return depositModel.delete(Number(id));
}