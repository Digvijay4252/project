const userModel = require('../models/user.model');
const storeModel = require('../models/store.model');
const foodModel = require('../models/food.model');
const orderModel = require('../models/order.model');
const { SELLER_APPROVAL, ROLES } = require('../constants/roles');

const listAllUsers = (limit, offset) => userModel.listAllUsers(limit, offset);
const listSellers = (limit, offset) => userModel.listUsersByRole(ROLES.SELLER, limit, offset);
const listFoods = (limit, offset) => foodModel.listAllAdmin(limit, offset);
const listOrders = (limit, offset) => orderModel.listAll(limit, offset);
const listStores = (limit, offset) => storeModel.listAll(limit, offset, false);

const approveSeller = async (sellerId) => {
  const seller = await userModel.updateSellerApproval(sellerId, SELLER_APPROVAL.APPROVED);
  if (!seller) {
    const error = new Error('Seller not found');
    error.statusCode = 404;
    throw error;
  }
  return seller;
};

const blockSeller = async (sellerId) => {
  const seller = await userModel.updateSellerApproval(sellerId, SELLER_APPROVAL.BLOCKED);
  if (!seller) {
    const error = new Error('Seller not found');
    error.statusCode = 404;
    throw error;
  }
  return seller;
};

module.exports = {
  listAllUsers,
  listSellers,
  listFoods,
  listOrders,
  listStores,
  approveSeller,
  blockSeller,
};
