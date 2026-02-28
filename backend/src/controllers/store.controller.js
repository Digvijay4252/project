const asyncHandler = require('../utils/async-handler');
const { sendSuccess } = require('../utils/api-response');
const storeService = require('../services/store.service');
const { getPagination, getPaginationMeta } = require('../utils/pagination');

const upsertMyStore = asyncHandler(async (req, res) => {
  const store = await storeService.upsertSellerStore(req.user.id, req.body);
  return sendSuccess(res, 200, 'Store profile saved', store);
});

const getMyStore = asyncHandler(async (req, res) => {
  const store = await storeService.getSellerStore(req.user.id);
  return sendSuccess(res, 200, 'Seller store profile fetched', store);
});

const listStores = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const result = await storeService.listStores(limit, offset, req.query.adminView === 'true');
  return sendSuccess(res, 200, 'Stores fetched', result.rows, getPaginationMeta(page, limit, result.total));
});

const getStoreById = asyncHandler(async (req, res) => {
  const store = await storeService.getPublicStoreById(Number(req.params.storeId));
  return sendSuccess(res, 200, 'Store fetched', store);
});

module.exports = {
  upsertMyStore,
  getMyStore,
  listStores,
  getStoreById,
};
