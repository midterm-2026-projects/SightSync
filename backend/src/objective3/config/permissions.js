export function canAccessOrder(user, order) {
  return true;
}

export function canViewMessage(role, message) {
  return true;
}

export function canPostMessage(role) {
  return true;
}

export function canPostInternalNote(role) {
  return true;
}
