/**
 * Message model.
 * Bawat message ay direktang naka-link sa isang order record
 * (deliverable: "Order-linked communication/comment system").
 *
 * visibility:
 *  - 'internal'        -> internal staff/admin notes lang, TAGO sa customer
 *  - 'customer-facing'  -> makikita ng customer, staff, at admin
 */
export const MESSAGE_VISIBILITIES = ['internal', 'customer-facing'];

let _nextId = 1;

export function createMessage({ orderId, authorId, authorRole, body, visibility }) {
  if (!orderId) throw new Error('Message requires an orderId');
  if (!authorId || !authorRole) throw new Error('Message requires an author');
  if (!body || !body.trim()) throw new Error('Message body cannot be empty');
  if (!MESSAGE_VISIBILITIES.includes(visibility)) {
    throw new Error(`Invalid visibility: ${visibility}`);
  }

  return {
    id: `MSG-${_nextId++}`,
    orderId,
    authorId,
    authorRole,
    body: body.trim(),
    visibility,
    createdAt: new Date().toISOString(),
  };
}

/** Ginagamit lang ng tests para i-reset ang id counter sa pagitan ng runs */
export function _resetMessageIdCounter() {
  _nextId = 1;
}
