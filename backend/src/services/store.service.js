const storeModel = require('../models/store.model');
const { SELLER_APPROVAL, USER_STATUS } = require('../constants/roles');

const upsertSellerStore = async (sellerId, payload) => storeModel.upsertBySeller({ sellerId, ...payload });

const getPublicStoreById = async (storeId) => {
  const store = await storeModel.findById(storeId);
  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }
  if (store.seller_approval !== SELLER_APPROVAL.APPROVED || store.seller_status !== USER_STATUS.ACTIVE) {
    const error = new Error('Store is not publicly available');
    error.statusCode = 404;
    throw error;
  }
  return store;
};

const listStores = async (limit, offset, isAdmin = false) => storeModel.listAll(limit, offset, !isAdmin);

const getSellerStore = async (sellerId) => {
  const store = await storeModel.findBySellerId(sellerId);
  if (!store) {
    const error = new Error('Store profile not found for seller');
    error.statusCode = 404;
    throw error;
  }
  return store;
};

module.exports = {
  upsertSellerStore,
  getPublicStoreById,
  listStores,
  getSellerStore,
};
