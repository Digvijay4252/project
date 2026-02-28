const { body } = require('express-validator');

const createOrUpdateFoodValidation = [
  body('name').isLength({ min: 2, max: 120 }).withMessage('name must be 2-120 chars'),
  body('description').isLength({ min: 5, max: 500 }).withMessage('description must be 5-500 chars'),
  body('category').isLength({ min: 2, max: 80 }).withMessage('category must be 2-80 chars'),
  body('price').isFloat({ min: 0.01 }).withMessage('price must be positive'),
  body('rating').isFloat({ min: 0, max: 5 }).withMessage('rating must be between 0 and 5'),
  body('isAvailable').isBoolean().withMessage('isAvailable must be boolean'),
  body('imageUrl').optional({ nullable: true }).isString().withMessage('imageUrl must be a string'),
];

module.exports = {
  createOrUpdateFoodValidation,
};
