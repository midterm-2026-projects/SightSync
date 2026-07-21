import PaymentService from '../Service/paymentService.js';
import PaymentModel from '../Models/payment.js';
import pool from '../../../database/db.js';

const paymentModel = new PaymentModel(pool);
const paymentService = new PaymentService(pool);

export async function createPayment(req, res, next) {
  try {
    const payment = await paymentService.create(req.body);
    res.status(201).json(payment);
  } catch (err) {
    next(err);
  }
}

export async function getPayment(req, res, next) {
  try {
    const payment = await paymentService.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: `Payment with id "${req.params.id}" not found` });
    }
    res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
}

export async function getAllPayments(req, res, next) {
  try {
    const payments = await paymentService.findAll();
    res.status(200).json(payments);
  } catch (err) {
    next(err);
  }
}

export async function updatePaymentStatus(req, res, next) {
  try {
    const updated = await paymentService.updateStatus(req.params.id, req.body.status);
    if (!updated) {
      return res.status(404).json({ error: `Payment with id "${req.params.id}" not found` });
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function deletePayment(req, res, next) {
  try {
    const deleted = await paymentService.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: `Payment with id "${req.params.id}" not found` });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (err) {
    next(err);
  }
}

