const orderModel = require('../models/order.model');
const foodModel = require('../models/food.model');
const storeModel = require('../models/store.model');
const { ROLES } = require('../constants/roles');

const placeOrder = async (userId, payload) => {
  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    const error = new Error('Order items are required');
    error.statusCode = 400;
    throw error;
  }

  const store = await storeModel.findById(payload.storeId);
  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  const normalizedItems = [];
  let totalAmount = 0;
  for (const item of payload.items) {
    const food = await foodModel.findById(item.foodId);
    if (!food || food.store_id !== payload.storeId || !food.is_available) {
      const error = new Error(`Invalid or unavailable food item: ${item.foodId}`);
      error.statusCode = 400;
      throw error;
    }
    const quantity = Number(item.quantity);
    const unitPrice = Number(food.price);
    const itemTotal = quantity * unitPrice;
    totalAmount += itemTotal;
    normalizedItems.push({
      foodId: food.id,
      quantity,
      unitPrice,
      itemTotal,
    });
  }

  const orderId = await orderModel.createOrderWithItems({
    userId,
    storeId: payload.storeId,
    totalAmount,
    notes: payload.notes,
    items: normalizedItems,
  });
  return orderModel.findById(orderId);
};

const listOrdersByRole = async (actor, limit, offset) => {
  if (actor.role === ROLES.USER) {
    return orderModel.listByUser(actor.id, limit, offset);
  }
  if (actor.role === ROLES.SELLER) {
    return orderModel.listBySeller(actor.id, limit, offset);
  }
  return orderModel.listAll(limit, offset);
};

const updateOrderStatus = async (orderId, status, actor) => {
  const existing = await orderModel.findById(orderId);
  if (!existing) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  if (actor.role === ROLES.SELLER && existing.seller_id !== actor.id) {
    const error = new Error('Cannot update another seller order');
    error.statusCode = 403;
    throw error;
  }

  return orderModel.updateStatus(orderId, status);
};

module.exports = {
  placeOrder,
  listOrdersByRole,
  updateOrderStatus,
};
