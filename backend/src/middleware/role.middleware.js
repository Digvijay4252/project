const { sendError } = require('../utils/api-response');
const { ROLES, SELLER_APPROVAL } = require('../constants/roles');

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return sendError(res, 403, 'Forbidden: insufficient role');
  }
  return next();
};

const requireApprovedSeller = (req, res, next) => {
  if (req.user.role !== ROLES.SELLER) {
    return sendError(res, 403, 'Forbidden: seller role required');
  }
  if (req.user.seller_approval !== SELLER_APPROVAL.APPROVED) {
    return sendError(res, 403, 'Seller account must be approved by admin');
  }
  return next();
};

const requireApprovedSellerIfSeller = (req, res, next) => {
  if (req.user.role === ROLES.SELLER && req.user.seller_approval !== SELLER_APPROVAL.APPROVED) {
    return sendError(res, 403, 'Seller account must be approved by admin');
  }
  return next();
};

module.exports = {
  authorizeRoles,
  requireApprovedSeller,
  requireApprovedSellerIfSeller,
};
