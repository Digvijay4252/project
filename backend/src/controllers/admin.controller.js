const asyncHandler = require('../utils/async-handler');
const { sendSuccess } = require('../utils/api-response');
const { getPagination, getPaginationMeta } = require('../utils/pagination');
const adminService = require('../services/admin.service');

const paginate = async (res, req, fn, message) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await fn(limit, offset);
  return sendSuccess(res, 200, message, result.rows, getPaginationMeta(page, limit, result.total));
};

const listUsers = asyncHandler(async (req, res) => paginate(res, req, adminService.listAllUsers, 'Users fetched'));
const listSellers = asyncHandler(async (req, res) => paginate(res, req, adminService.listSellers, 'Sellers fetched'));
const listFoods = asyncHandler(async (req, res) => paginate(res, req, adminService.listFoods, 'Foods fetched'));
const listOrders = asyncHandler(async (req, res) => paginate(res, req, adminService.listOrders, 'Orders fetched'));
const listStores = asyncHandler(async (req, res) => paginate(res, req, adminService.listStores, 'Stores fetched'));

const approveSeller = asyncHandler(async (req, res) => {
  const seller = await adminService.approveSeller(Number(req.params.sellerId));
  return sendSuccess(res, 200, 'Seller approved', seller);
});

const blockSeller = asyncHandler(async (req, res) => {
  const seller = await adminService.blockSeller(Number(req.params.sellerId));
  return sendSuccess(res, 200, 'Seller blocked', seller);
});

module.exports = {
  listUsers,
  listSellers,
  listFoods,
  listOrders,
  listStores,
  approveSeller,
  blockSeller,
};
