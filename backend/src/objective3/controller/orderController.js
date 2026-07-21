const orderService = require('../service/orderService');

function createOrder(req, res, next) {
  try {
    const order = orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

function getOrder(req, res, next) {
  try {
    const order = orderService.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: `Order with id "${req.params.id}" not found` });
    }
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

function getAllOrders(req, res, next) {
  try {
    res.status(200).json(orderService.getAllOrders());
  } catch (err) {
    next(err);
  }
}

function updateOrderStatus(req, res, next) {
  try {
    const updated = orderService.updateStatus(req.params.id, req.body.status);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrder, getAllOrders, updateOrderStatus };
