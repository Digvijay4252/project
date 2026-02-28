const { body } = require('express-validator');

const placeOrderValidation = [
  body('storeId').isInt({ min: 1 }).withMessage('storeId must be positive integer'),
  body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.foodId').isInt({ min: 1 }).withMessage('foodId must be positive integer'),
  body('items.*.quantity').isInt({ min: 1, max: 20 }).withMessage('quantity must be between 1 and 20'),
  body('notes').optional().isLength({ max: 500 }).withMessage('notes max is 500 chars'),
];

const updateOrderStatusValidation = [
  body('status')
    .isIn(['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'])
    .withMessage('invalid order status'),
];

module.exports = {
  placeOrderValidation,
  updateOrderStatusValidation,
};
