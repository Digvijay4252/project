const { query } = require('../config/database');
const toSafeInt = (value, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.trunc(num));
};

const create = async ({
  sellerId,
  storeId,
  name,
  description,
  category,
  price,
  rating,
  imageUrl,
  isAvailable,
}) => {
  const result = await query(
    `INSERT INTO foods
     (seller_id, store_id, name, description, category, price, rating, image_url, is_available)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [sellerId, storeId, name, description, category, price, rating, imageUrl, isAvailable]
  );
  return findById(result.insertId);
};

const findById = async (foodId) => {
  const rows = await query(
    `SELECT f.*, s.name AS store_name, s.city, s.latitude, s.longitude, u.seller_approval, u.status AS seller_status
     FROM foods f
     INNER JOIN stores s ON s.id = f.store_id
     INNER JOIN users u ON u.id = f.seller_id
     WHERE f.id = ? LIMIT 1`,
    [foodId]
  );
  return rows[0] || null;
};

const updateById = async (foodId, payload) => {
  await query(
    `UPDATE foods SET
      name = ?, description = ?, category = ?, price = ?, rating = ?, image_url = ?, is_available = ?
     WHERE id = ?`,
    [
      payload.name,
      payload.description,
      payload.category,
      payload.price,
      payload.rating,
      payload.imageUrl,
      payload.isAvailable,
      foodId,
    ]
  );
  return findById(foodId);
};

const deleteById = async (foodId) => {
  return query('DELETE FROM foods WHERE id = ?', [foodId]);
};

const listPublic = async (filters, limit, offset) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const conditions = [
    "u.seller_approval = 'APPROVED'",
    "u.status = 'ACTIVE'",
  ];
  const params = [];

  if (filters.category) {
    conditions.push('f.category = ?');
    params.push(filters.category);
  }
  if (filters.minPrice !== undefined) {
    conditions.push('f.price >= ?');
    params.push(filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    conditions.push('f.price <= ?');
    params.push(filters.maxPrice);
  }
  if (filters.minRating !== undefined) {
    conditions.push('f.rating >= ?');
    params.push(filters.minRating);
  }
  if (filters.city) {
    conditions.push('s.city = ?');
    params.push(filters.city);
  }
  if (filters.availableOnly) {
    conditions.push('f.is_available = 1');
  }

  const includeDistance = filters.latitude !== undefined && filters.longitude !== undefined;
  let distanceSelect = 'NULL AS distance_km';
  if (includeDistance) {
    distanceSelect = `(6371 * ACOS(
      COS(RADIANS(?)) * COS(RADIANS(s.latitude)) *
      COS(RADIANS(s.longitude) - RADIANS(?)) +
      SIN(RADIANS(?)) * SIN(RADIANS(s.latitude))
    )) AS distance_km`;
    params.unshift(filters.latitude, filters.longitude, filters.latitude);
  }

  if (filters.maxDistanceKm !== undefined && includeDistance) {
    conditions.push(`(6371 * ACOS(
      COS(RADIANS(?)) * COS(RADIANS(s.latitude)) *
      COS(RADIANS(s.longitude) - RADIANS(?)) +
      SIN(RADIANS(?)) * SIN(RADIANS(s.latitude))
    )) <= ?`);
    params.push(filters.latitude, filters.longitude, filters.latitude, filters.maxDistanceKm);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderBy = includeDistance ? 'ORDER BY distance_km ASC, f.created_at DESC' : 'ORDER BY f.created_at DESC';

  const rows = await query(
    `SELECT f.id, f.name, f.description, f.category, f.price, f.rating, f.image_url, f.is_available,
            s.id AS store_id, s.name AS store_name, s.city, s.latitude, s.longitude,
            ${distanceSelect}
     FROM foods f
     INNER JOIN stores s ON s.id = f.store_id
     INNER JOIN users u ON u.id = f.seller_id
     ${where}
     ${orderBy}
     LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    params
  );

  const countRows = await query(
    `SELECT COUNT(*) AS total
     FROM foods f
     INNER JOIN stores s ON s.id = f.store_id
     INNER JOIN users u ON u.id = f.seller_id
     ${where}`,
    params
  );

  return { rows, total: countRows[0].total };
};

const listBySeller = async (sellerId, limit, offset) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const rows = await query(
    `SELECT f.*, s.name AS store_name
     FROM foods f
     INNER JOIN stores s ON s.id = f.store_id
     WHERE f.seller_id = ?
     ORDER BY f.created_at DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    [sellerId]
  );
  const countRows = await query('SELECT COUNT(*) AS total FROM foods WHERE seller_id = ?', [sellerId]);
  return { rows, total: countRows[0].total };
};

const listAllAdmin = async (limit, offset) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const rows = await query(
    `SELECT f.*, s.name AS store_name, u.full_name AS seller_name
     FROM foods f
     INNER JOIN stores s ON s.id = f.store_id
     INNER JOIN users u ON u.id = f.seller_id
     ORDER BY f.created_at DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`
  );
  const countRows = await query('SELECT COUNT(*) AS total FROM foods');
  return { rows, total: countRows[0].total };
};

module.exports = {
  create,
  findById,
  updateById,
  deleteById,
  listPublic,
  listBySeller,
  listAllAdmin,
};
