import { createMessage } from '../Models/message.js';
import { getOrder } from '../data/orders.js';
import {
  canAccessOrder,
  canViewMessage,
  canPostMessage,
  canPostInternalNote,
} from '../config/permissions.js';
import { AccessError } from '../errors.js';

/**
 * MessagingService
 * ----------------
 * - postMessage(): gumagawa ng bagong message na naka-link sa isang order
 * - getMessagesForOrder(): binabasa ang mga message ng isang order,
 *   naka-filter base sa role (internal notes ay TAGO sa customer)
 *
 * Dalawang layer ng proteksyon sa bawat operation:
 *   1. Ownership check (canAccessOrder) — dapat pag-aari o may access
 *   2. Visibility check (canViewMessage / canPostMessage) — role-based
 */
export class MessagingService {
  constructor() {
    this.messages = []; // in-memory store; palitan ng DB sa totoong app
  }

  postMessage({ orderId, author, body, visibility }) {
    const order = getOrder(orderId);

    if (!canAccessOrder(author, order)) {
      throw new AccessError(
        `${author.role} "${author.id}" does not have access to order ${orderId}`
      );
    }

    if (!canPostMessage(author.role)) {
      throw new AccessError(`Role "${author.role}" is not permitted to post messages`);
    }

    // Customer ay hindi pwedeng gumawa ng 'internal' note — i-downgrade
    // papuntang 'customer-facing' kahit ano ang hiningi nila.
    let finalVisibility = visibility;
    if (visibility === 'internal' && !canPostInternalNote(author.role)) {
      finalVisibility = 'customer-facing';
    }

    const message = createMessage({
      orderId,
      authorId: author.id,
      authorRole: author.role,
      body,
      visibility: finalVisibility,
    });

    this.messages.push(message);
    return message;
  }

  getMessagesForOrder(orderId, requester) {
    const order = getOrder(orderId);

    if (!canAccessOrder(requester, order)) {
      throw new AccessError(
        `${requester.role} "${requester.id}" does not have access to order ${orderId}`
      );
    }

    return this.messages
      .filter((m) => m.orderId === orderId)
      .filter((m) => canViewMessage(requester.role, m));
  }
}

export default MessagingService;
