const { body } = require('express-validator');

const upsertStoreValidation = [
  body('name').isLength({ min: 2, max: 120 }).withMessage('store name must be 2-120 chars'),
  body('description').optional().isLength({ max: 500 }).withMessage('description max is 500 chars'),
  body('address').isLength({ min: 5, max: 255 }).withMessage('address must be 5-255 chars'),
  body('city').isLength({ min: 2, max: 100 }).withMessage('city must be 2-100 chars'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('latitude must be valid'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('longitude must be valid'),
  body('phone').optional().isLength({ min: 8, max: 20 }).withMessage('phone must be 8-20 chars'),
];

module.exports = {
  upsertStoreValidation,
};
