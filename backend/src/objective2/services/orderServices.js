import {getAllOrders, createOrder, updateOrder, deleteOrder,} from "../models/orderModels.js";
import {findLensByName, findFrameByName, updateStock,} from "../models/inventoryModels.js";

export function validateOrder(data) {

  const { patientName, lensName, frameName } = data;

  // Patient Name
  if (!patientName || patientName.trim() === "") {
    return {
      valid: false,
      message: "Patient name is required.",
    };
  }

  // Lens
  if (!lensName || lensName.trim() === "") {
    return {
      valid: false,
      message: "Lens is required.",
    };
  }

  // Frame
  if (!frameName || frameName.trim() === "") {
    return {
      valid: false,
      message: "Frame is required.",
    };
  }

  return {
    valid: true,
  };

}

export function validateOrderId(id) {

  if (id === undefined || id === null || id === "") {
    return {
      valid: false,
      message: "Order ID is required.",
    };
  }

  if (isNaN(id)) {
    return {
      valid: false,
      message: "Invalid order ID.",
    };
  }

  return {
    valid: true,
  };

}

// GET
export async function fetchOrdersService() {

  const orders = await getAllOrders();

  return {
    valid: true,
    data: orders,
  };

}

// POST
export async function addOrderService(data) {

  const validation = validateOrder(data);

  if (!validation.valid) {
    return validation;
  }

  // NEW

  // Find Lens
  const lens = await findLensByName(data.lensName);

  if (!lens) {
    return {
      valid: false,
      message: "Lens not found.",
    };
  }

  if (lens.stock <= 0) {
    return {
      valid: false,
      message: "Selected lens is out of stock.",
    };
  }

  // NEW

  // Find Frame
  const frame = await findFrameByName(data.frameName);

  if (!frame) {
    return {
      valid: false,
      message: "Frame not found.",
    };
  }

  if (frame.stock <= 0) {
    return {
      valid: false,
      message: "Selected frame is out of stock.",
    };
  }

  // NEW

  // Create Order
  const order = await createOrder(data);

  // Update Lens Stock
  await updateStock(
    "lenses",
    lens.id,
    lens.stock - 1
  );

  // Update Frame Stock
  await updateStock(
    "frames",
    frame.id,
    frame.stock - 1
  );

  return {
    valid: true,
    data: order,
  };

}

// PUT
export async function editOrderService(id, data) {

  const idValidation = validateOrderId(id);

  if (!idValidation.valid) {
    return idValidation;
  }

  const validation = validateOrder(data);

  if (!validation.valid) {
    return validation;
  }

  const order = await updateOrder(id, data);

  if (!order) {
    return {
      valid: false,
      message: "Order not found.",
    };
  }

  return {
    valid: true,
    data: order,
  };

}

// DELETE
export async function removeOrderService(id) {

  const idValidation = validateOrderId(id);

  if (!idValidation.valid) {
    return idValidation;
  }

  const order = await deleteOrder(id);

  if (!order) {
    return {
      valid: false,
      message: "Order not found.",
    };
  }

  return {
    valid: true,
    data: order,
  };

}