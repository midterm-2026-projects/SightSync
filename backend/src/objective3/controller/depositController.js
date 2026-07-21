import * as depositService from '../Service/depositService.js';

export async function createDeposit(req, res, next) {
  try {
    const deposit = await depositService.createDeposit(req.body);
    res.status(201).json(deposit);
  } catch (err) {
    next(err);
  }
}

export async function getDeposit(req, res, next) {
  try {
    const deposit = await depositService.getDepositById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ error: `Deposit with id "${req.params.id}" not found` });
    }
    res.status(200).json(deposit);
  } catch (err) {
    next(err);
  }
}

export async function getAllDeposits(req, res, next) {
  try {
    const deposits = await depositService.getAllDeposits();
    res.status(200).json(deposits);
  } catch (err) {
    next(err);
  }
}

export async function updateDepositStatus(req, res, next) {
  try {
    const updated = await depositService.updateDepositStatus(req.params.id, req.body.status);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deleteDeposit(req, res, next) {
  try {
    const deleted = await depositService.deleteDeposit(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: `Deposit with id "${req.params.id}" not found` });
    }
    res.status(200).json({ message: 'Deposit deleted successfully' });
  } catch (err) {
    next(err);
  }
}

