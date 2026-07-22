# Messaging Features Implementation - TODO

## Backend Changes
- [x] 1. Fix `permissions.js` — Implement actual RBAC (canAccessOrder, canViewMessage, canPostMessage, canPostInternalNote)
- [x] 2. Fix `messagingRoutes.js` — Rewrite to use MessagingService class, add GET /messages/:orderId endpoint
- [x] 3. Wire messaging routes in `app.js`

## Frontend
- [x] 4. Create `OrderMessaging.jsx` — Single self-contained component with order selector, message list, compose form, role-based access
- [x] 5. Create `OrderMessaging.test.jsx` — Tests for 3 acceptance criteria
- [x] 6. Update `AppLayout.jsx` to use OrderMessaging component

