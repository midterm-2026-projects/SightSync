import EventEmitter from 'events';

/**
 * Shared event bus.
 * orderService emits 'order:statusChanged' whenever an order's status changes.
 * notificationService listens for that event and immediately creates + "sends"
 * a notification, so triggers are automatic and decoupled from the order logic.
 */
class EventBus extends EventEmitter {}

// Vitest unit tests import this file as a *default* export.
const eventBus = new EventBus();
export default eventBus;

// Backward-compatible CommonJS export (in case any runtime code still requires it).
export { eventBus };

