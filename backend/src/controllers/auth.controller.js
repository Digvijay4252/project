const asyncHandler = require('../utils/async-handler');
const { sendSuccess } = require('../utils/api-response');
const authService = require('../services/auth.service');
const { ROLES } = require('../constants/roles');

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const result = await authService.register({ fullName, email, password, role: ROLES.USER });
  return sendSuccess(res, 201, 'User registered successfully', result);
});

const registerSeller = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;
  const result = await authService.register({ fullName, email, password, role: ROLES.SELLER });
  return sendSuccess(res, 201, 'Seller registered successfully (pending admin approval)', result);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  return sendSuccess(res, 200, 'Login successful', result);
});

const getMe = asyncHandler(async (req, res) => sendSuccess(res, 200, 'Profile fetched', req.user));

module.exports = {
  registerUser,
  registerSeller,
  login,
  getMe,
};
