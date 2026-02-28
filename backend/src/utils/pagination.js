const getPagination = (query = {}) => {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const getPaginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});

module.exports = {
  getPagination,
  getPaginationMeta,
};
