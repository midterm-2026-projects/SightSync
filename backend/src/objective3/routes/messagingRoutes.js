import express from 'express';
import { MessagingService } from '../Service/messagingService.js';
import { AccessError } from '../errors.js';

const router = express.Router();
const messagingService = new MessagingService();

/**
 * Helper to extract user context from request headers/body
 * NOTE: In production, replace this with actual auth middleware (JWT/session).
 */
function getUserFromRequest(req) {
  // For now, accept user info via headers or body
  if (req.headers['x-user-id'] && req.headers['x-user-role']) {
    return {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'],
    };
  }
  // Fallback to body fields
  if (req.body && req.body.authorId && req.body.authorRole) {
    return {
      id: req.body.authorId,
      role: req.body.authorRole,
    };
  }
  // Default admin for development
  return { id: 'U-ADMIN-1', role: 'admin' };
}

/**
 * POST /api/messages
 * Creates a new message linked to an order with RBAC enforcement.
 */
router.post('/messages', (req, res) => {
  try {
    const author = getUserFromRequest(req);
    const { orderId, body, visibility } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, error: 'orderId is required' });
    }
    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, error: 'Message body cannot be empty' });
    }

    const newMessage = messagingService.postMessage({
      orderId,
      author,
      body,
      visibility: visibility || 'customer-facing',
    });

    return res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    if (error instanceof AccessError) {
      return res.status(403).json({ success: false, error: error.message });
    }
    if (
      error.message.includes('requires an orderId') ||
      error.message.includes('requires an author') ||
      error.message.includes('cannot be empty') ||
      error.message.includes('Invalid visibility')
    ) {
      return res.status(400).json({ success: false, error: error.message });
    }
    console.error('Unexpected error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/**
 * GET /api/messages/:orderId
 * Fetches all messages for an order, filtered by role-based visibility.
 */
router.get('/messages/:orderId', (req, res) => {
  try {
    const requester = getUserFromRequest(req);
    const { orderId } = req.params;

    const messages = messagingService.getMessagesForOrder(orderId, requester);

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    if (error instanceof AccessError) {
      return res.status(403).json({ success: false, error: error.message });
    }
    console.error('Unexpected error:', error);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
