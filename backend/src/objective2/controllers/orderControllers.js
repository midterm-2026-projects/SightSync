import {fetchOrdersService, addOrderService, editOrderService, removeOrderService,} from "../services/orderServices.js";

// GET /orders
export async function fetchOrders(req, res) {

  try {

    const orders = await fetchOrdersService();

    return res.status(200).json(orders);

  } catch (error) {

    return res.status(500).json({
      message: "Failed to fetch orders.",
    });

  }

}

// POST /orders
export async function addOrder(req, res) {

  try {

    const result = await addOrderService(req.body);

    if (!result.valid) {
      return res.status(400).json({
        message: result.message,
      });
    }

    return res.status(201).json(result.data);

  } catch (error) {

    return res.status(500).json({
      message: "Failed to create order.",
    });

  }

}

// PUT /orders/:id
export async function editOrder(req, res) {

  try {

    const result = await editOrderService(
      req.params.id,
      req.body
    );

    if (!result.valid) {

      if (
        result.message === "Order ID is required." ||
        result.message === "Invalid order ID."
      ) {

        return res.status(400).json({
          message: result.message,
        });

      }

      if (result.message === "Order not found.") {

        return res.status(404).json({
          message: result.message,
        });

      }

    }

    return res.status(200).json(result.data);

  } catch (error) {

    return res.status(500).json({
      message: "Failed to update order.",
    });

  }

}

// DELETE /orders/:id
export async function removeOrder(req, res) {

  try {

    const result = await removeOrderService(req.params.id);

    if (!result.valid) {

      if (
        result.message === "Order ID is required." ||
        result.message === "Invalid order ID."
      ) {

        return res.status(400).json({
          message: result.message,
        });

      }

      if (result.message === "Order not found.") {

        return res.status(404).json({
          message: result.message,
        });

      }

    }

    return res.status(200).json({
      message: "Order deleted successfully.",
    });

  } catch (error) {

    return res.status(500).json({
      message: "Failed to delete order.",
    });

  }

}