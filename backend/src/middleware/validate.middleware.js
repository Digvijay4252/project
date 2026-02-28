const { validationResult } = require('express-validator');
const { sendError } = require('../utils/api-response');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 422, 'Validation failed', errors.array());
  }
  return next();
};

module.exports = {
  validateRequest,
};
