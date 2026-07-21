const express = require('express');
const orderController = require('../controllers/orderController');
const { validateCreateOrder, validateStatusUpdate } = require('../middleware/validateOrder');

const router = express.Router();

router.post('/', validateCreateOrder, orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.patch('/:id/status', validateStatusUpdate, orderController.updateOrderStatus);

module.exports = router;
