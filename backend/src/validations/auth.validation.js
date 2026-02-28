const { body } = require('express-validator');

const registrationValidation = [
  body('fullName').isLength({ min: 2, max: 100 }).withMessage('fullName must be 2-100 chars'),
  body('email').isEmail().withMessage('email must be valid'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password minimum length is 8')
    .matches(/[A-Z]/)
    .withMessage('password must contain one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('password must contain one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('password must contain one number'),
];

const loginValidation = [
  body('email').isEmail().withMessage('email must be valid'),
  body('password').notEmpty().withMessage('password is required'),
];

module.exports = {
  registrationValidation,
  loginValidation,
};
