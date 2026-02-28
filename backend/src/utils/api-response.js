const sendSuccess = (res, status, message, data = {}, meta = undefined) => {
  const payload = {
    success: true,
    message,
    data,
  };
  if (meta) {
    payload.meta = meta;
  }
  return res.status(status).json(payload);
};

const sendError = (res, status, message, errors = undefined) => {
  const payload = {
    success: false,
    message,
  };
  if (errors) {
    payload.errors = errors;
  }
  return res.status(status).json(payload);
};

module.exports = {
  sendSuccess,
  sendError,
};
