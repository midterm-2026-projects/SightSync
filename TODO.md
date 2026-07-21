- [ ] Inspect current failing `backend/test/unit/objective3/orderService.test.js`
- [ ] Inspect canonical `backend/src/objective3/Service/orderService.js` and its dependencies (eventBus, Models/order.js)
- [ ] Fix test mocks/import paths to match actual service module casing & relative paths
- [ ] Ensure mocks include any methods invoked by orderService (e.g., delete if present)
- [ ] Update test assertions/messages to match real error text (Invalid status..., not-found message)
- [ ] Re-run vitest locally if needed (but per request, avoid requiring user to run commands)

