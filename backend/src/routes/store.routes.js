const express = require('express');
const storeController = require('../controllers/store.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles, requireApprovedSeller } = require('../middleware/role.middleware');
const { validateRequest } = require('../middleware/validate.middleware');
const { upsertStoreValidation } = require('../validations/store.validation');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/seller/me/profile', authenticate, authorizeRoles(ROLES.SELLER), requireApprovedSeller, storeController.getMyStore);
router.put(
  '/seller/me/profile',
  authenticate,
  authorizeRoles(ROLES.SELLER),
  requireApprovedSeller,
  upsertStoreValidation,
  validateRequest,
  storeController.upsertMyStore
);
router.get('/', authenticate, authorizeRoles(ROLES.USER, ROLES.ADMIN), storeController.listStores);
router.get('/:storeId', authenticate, authorizeRoles(ROLES.USER, ROLES.ADMIN), storeController.getStoreById);

module.exports = router;
