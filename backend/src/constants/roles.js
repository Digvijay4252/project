const ROLES = Object.freeze({
  USER: 'USER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
});

const SELLER_APPROVAL = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  BLOCKED: 'BLOCKED',
});

const USER_STATUS = Object.freeze({
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
});

module.exports = {
  ROLES,
  SELLER_APPROVAL,
  USER_STATUS,
};
