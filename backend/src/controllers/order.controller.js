const asyncHandler = require('../utils/async-handler');
const { sendSuccess } = require('../utils/api-response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const orderService = require('../services/order.service');

const placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user.id, req.body);
  return sendSuccess(res, 201, 'Order placed successfully', order);
});

const listOrders = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await orderService.listOrdersByRole(req.user, limit, offset);
  return sendSuccess(res, 200, 'Orders fetched', result.rows, getPaginationMeta(page, limit, result.total));
});

const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(Number(req.params.orderId), req.body.status, req.user);
  return sendSuccess(res, 200, 'Order status updated', order);
});

module.exports = {
  placeOrder,
  listOrders,
  updateStatus,
};
