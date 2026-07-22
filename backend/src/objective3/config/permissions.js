/**
 * RBAC Permission Checks for Order-Linked Messaging
 * ---------------------------------------------------
 * Rules:
 *  - admin / staff → full access to any order, all messages
 *  - customer       → only their own orders, only customer-facing messages
 *                     cannot post internal notes (auto-downgraded)
 */

export function canAccessOrder(user, order) {
  if (!user || !order) return false;
  // admin and staff have universal access
  if (user.role === 'admin' || user.role === 'staff') return true;
  // customer can only access their own orders
  if (user.role === 'customer') {
    return user.id === order.customerId;
  }
  return false;
}

export function canViewMessage(role, message) {
  if (!role || !message) return false;
  // customer cannot see internal notes
  if (role === 'customer' && message.visibility === 'internal') return false;
  // everyone else can see all messages
  return true;
}

export function canPostMessage(role) {
  // All authenticated roles can post messages
  return ['admin', 'staff', 'customer'].includes(role);
}

export function canPostInternalNote(role) {
  // Only admin and staff can post internal notes
  return role === 'admin' || role === 'staff';
}
