const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.model');
const { ROLES, SELLER_APPROVAL } = require('../constants/roles');

const buildToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

const register = async ({ fullName, email, password, role }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const sellerApproval = role === ROLES.SELLER ? SELLER_APPROVAL.PENDING : null;
  const user = await userModel.create({ fullName, email, passwordHash, role, sellerApproval });
  const token = buildToken(user);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await userModel.findAuthByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const safeUser = await userModel.findById(user.id);
  const token = buildToken(safeUser);
  return { user: safeUser, token };
};

module.exports = {
  register,
  login,
};
