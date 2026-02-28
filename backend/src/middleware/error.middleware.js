const { sendError } = require('../utils/api-response');

const notFoundHandler = (req, res) => sendError(res, 404, `Route not found: ${req.originalUrl}`);

const errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const details = error.details || undefined;
  if (process.env.NODE_ENV !== 'test') {
    console.error(error);
  }
  return sendError(res, status, message, details);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
