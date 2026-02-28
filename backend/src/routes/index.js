const express = require('express');

const authRoutes = require('./auth.routes');
const storeRoutes = require('./store.routes');
const foodRoutes = require('./food.routes');
const orderRoutes = require('./order.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/stores', storeRoutes);
router.use('/foods', foodRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
