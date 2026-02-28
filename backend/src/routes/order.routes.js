const express = require('express');
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles, requireApprovedSellerIfSeller } = require('../middleware/role.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const { placeOrderValidation, updateOrderStatusValidation } = require('../validations/order.validation');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/', authenticate, authorizeRoles(ROLES.USER, ROLES.SELLER, ROLES.ADMIN), orderController.listOrders);

router.post(
  '/',
  authenticate,
  authorizeRoles(ROLES.USER),
  placeOrderValidation,
  validateRequest,
  orderController.placeOrder
);

router.patch(
  '/:orderId/status',
  authenticate,
  authorizeRoles(ROLES.SELLER, ROLES.ADMIN),
  requireApprovedSellerIfSeller,
  updateOrderStatusValidation,
  validateRequest,
  orderController.updateStatus
);

module.exports = router;
