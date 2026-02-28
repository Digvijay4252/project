const express = require('express');
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(authenticate, authorizeRoles(ROLES.ADMIN));

router.get('/users', adminController.listUsers);
router.get('/sellers', adminController.listSellers);
router.get('/foods', adminController.listFoods);
router.get('/orders', adminController.listOrders);
router.get('/stores', adminController.listStores);

router.patch('/sellers/:sellerId/approve', adminController.approveSeller);
router.patch('/sellers/:sellerId/block', adminController.blockSeller);

module.exports = router;
