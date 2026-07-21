import orderService from '../service/orderService.js';

export async function createOrder(req, res, next) {
  try {
    // Note: Added await here since your database model uses async/await
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: `Order with id "${req.params.id}" not found` });
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const updated = await orderService.updateStatus(req.params.id, req.body.status);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}