import express from 'express';
import { createMessage } from './messagingService.js';

const router = express.Router();

/**
 * POST /api/messages
 * Gumagawa ng bagong message na nakakabit sa isang order.
 */
router.post('/messages', (req, res) => {
  try {
    const { orderId, authorId, authorRole, body, visibility } = req.body;

    const newMessage = createMessage({
      orderId,
      authorId,
      authorRole,
      body,
      visibility,
    });

    // TODO: Dito i-da-save ang newMessage sa iyong database (e.g., MongoDB, PostgreSQL)
    // halimbawa: await db.messages.save(newMessage);

    return res.status(201).json({
      success: true,
      data: newMessage,
    });

  } catch (error) {
    // Catching specific validation errors from createMessage
    if (
      error.message.includes('requires an orderId') ||
      error.message.includes('requires an author') ||
      error.message.includes('cannot be empty') ||
      error.message.includes('Invalid visibility')
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Fallback para sa mga hindi inaasahang system errors
    console.error('Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
});

export default router;