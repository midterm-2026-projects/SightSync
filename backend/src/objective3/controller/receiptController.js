import { issueReceipt, generateReceipt } from '../Service/receiptService.js';
import PaymentModel from '../Models/payment.js';
import ReceiptModel from '../Models/receipt.js';
import pool from '../../../database/db.js';

const paymentModel = new PaymentModel(pool);
const receiptModel = new ReceiptModel(pool);

const deps = { paymentModel, receiptModel };

export async function createReceipt(req, res, next) {
  try {
    const { payment_id } = req.body;
    if (!payment_id) {
      return res.status(400).json({ error: 'payment_id is required' });
    }

    const receipt = issueReceipt(deps, payment_id);
    res.status(201).json(receipt);
  } catch (err) {
    next(err);
  }
}

export async function getReceipt(req, res, next) {
  try {
    const receipt = await receiptModel.findById(req.params.id);
    if (!receipt) {
      return res.status(404).json({ error: `Receipt with id "${req.params.id}" not found` });
    }

    const payment = await paymentModel.findById(receipt.payment_id);
    const receiptData = generateReceipt(payment, receipt.issued_date);
    receiptData.receiptNumber = receipt.receipt_number;
    receiptData.templateVersion = receipt.template_version;

    res.status(200).json(receiptData);
  } catch (err) {
    next(err);
  }
}

export async function getReceiptByPaymentId(req, res, next) {
  try {
    const receipt = await receiptModel.findByPaymentId(req.params.paymentId);
    if (!receipt) {
      return res.status(404).json({ error: `Receipt for payment id "${req.params.paymentId}" not found` });
    }

    const payment = await paymentModel.findById(receipt.payment_id);
    const receiptData = generateReceipt(payment, receipt.issued_date);
    receiptData.receiptNumber = receipt.receipt_number;
    receiptData.templateVersion = receipt.template_version;

    res.status(200).json(receiptData);
  } catch (err) {
    next(err);
  }
}

export async function getAllReceipts(req, res, next) {
  try {
    const receipts = await receiptModel.findAll();

    const enrichedReceipts = await Promise.all(
      receipts.map(async (receipt) => {
        try {
          const payment = await paymentModel.findById(receipt.payment_id);
          const receiptData = generateReceipt(payment, receipt.issued_date);
          receiptData.receiptNumber = receipt.receipt_number;
          receiptData.templateVersion = receipt.template_version;
          return receiptData;
        } catch {
          return {
            receipt_number: receipt.receipt_number,
            template_version: receipt.template_version,
            issued_date: receipt.issued_date,
            payment_id: receipt.payment_id,
          };
        }
      })
    );

    res.status(200).json(enrichedReceipts);
  } catch (err) {
    next(err);
  }
}

export async function deleteReceipt(req, res, next) {
  try {
    const deleted = await receiptModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: `Receipt with id "${req.params.id}" not found` });
    }
    res.status(200).json({ message: 'Receipt deleted successfully' });
  } catch (err) {
    next(err);
  }
}

