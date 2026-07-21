import express from "express"
import { createOrder, getOrder, getAllOrders, updateOrderStatus  } from "../controller/orderController.js"
import { validateCreateOrder, validateStatusUpdate } from "../middleware/validateOrder.js"

const router = express.Router();

router.post('/', validateCreateOrder, createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', validateStatusUpdate, updateOrderStatus);

export default router
