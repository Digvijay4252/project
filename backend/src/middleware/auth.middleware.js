const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const { sendError } = require('../utils/api-response');
const { USER_STATUS, SELLER_APPROVAL, ROLES } = require('../constants/roles');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return sendError(res, 401, 'Authentication token missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return sendError(res, 401, 'Invalid token user');
    }
    if (user.status === USER_STATUS.BLOCKED) {
      return sendError(res, 403, 'Account is blocked');
    }
    if (user.role === ROLES.SELLER && user.seller_approval === SELLER_APPROVAL.BLOCKED) {
      return sendError(res, 403, 'Seller account is blocked');
    }

    req.user = user;
    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};

module.exports = {
  authenticate,
};
