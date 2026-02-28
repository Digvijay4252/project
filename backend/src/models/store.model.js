const { query } = require('../config/database');
const toSafeInt = (value, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.trunc(num));
};

const upsertBySeller = async ({
  sellerId,
  name,
  description,
  address,
  city,
  latitude,
  longitude,
  phone,
}) => {
  const existing = await findBySellerId(sellerId);
  if (existing) {
    await query(
      `UPDATE stores
       SET name = ?, description = ?, address = ?, city = ?, latitude = ?, longitude = ?, phone = ?
       WHERE seller_id = ?`,
      [name, description, address, city, latitude, longitude, phone, sellerId]
    );
    return findBySellerId(sellerId);
  }

  const result = await query(
    `INSERT INTO stores (seller_id, name, description, address, city, latitude, longitude, phone)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [sellerId, name, description, address, city, latitude, longitude, phone]
  );
  return findById(result.insertId);
};

const findById = async (storeId) => {
  const rows = await query(
    `SELECT s.*, u.full_name AS seller_name, u.seller_approval, u.status AS seller_status
     FROM stores s
     INNER JOIN users u ON u.id = s.seller_id
     WHERE s.id = ? LIMIT 1`,
    [storeId]
  );
  return rows[0] || null;
};

const findBySellerId = async (sellerId) => {
  const rows = await query(
    `SELECT s.*, u.full_name AS seller_name, u.seller_approval, u.status AS seller_status
     FROM stores s
     INNER JOIN users u ON u.id = s.seller_id
     WHERE s.seller_id = ? LIMIT 1`,
    [sellerId]
  );
  return rows[0] || null;
};

const listAll = async (limit, offset, onlyApproved = true) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const approvalWhere = onlyApproved ? "AND u.seller_approval = 'APPROVED' AND u.status = 'ACTIVE'" : '';
  const rows = await query(
    `SELECT s.*, u.full_name AS seller_name, u.seller_approval, u.status AS seller_status
     FROM stores s
     INNER JOIN users u ON u.id = s.seller_id
     WHERE 1 = 1 ${approvalWhere}
     ORDER BY s.created_at DESC
     LIMIT ${safeLimit} OFFSET ${safeOffset}`
  );
  const countRows = await query(
    `SELECT COUNT(*) AS total
     FROM stores s
     INNER JOIN users u ON u.id = s.seller_id
     WHERE 1 = 1 ${approvalWhere}`
  );
  return { rows, total: countRows[0].total };
};

module.exports = {
  upsertBySeller,
  findById,
  findBySellerId,
  listAll,
};
