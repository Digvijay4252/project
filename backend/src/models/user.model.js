const { query } = require('../config/database');
const toSafeInt = (value, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.trunc(num));
};

const create = async ({ fullName, email, passwordHash, role, sellerApproval = null }) => {
  const result = await query(
    `INSERT INTO users (full_name, email, password_hash, role, seller_approval, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [fullName, email, passwordHash, role, sellerApproval]
  );
  return findById(result.insertId);
};

const findByEmail = async (email) => {
  const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const rows = await query(
    `SELECT id, full_name, email, role, status, seller_approval, created_at, updated_at
     FROM users WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

const findAuthByEmail = async (email) => {
  const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

const listUsersByRole = async (role, limit, offset) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const rows = await query(
    `SELECT id, full_name, email, role, status, seller_approval, created_at
     FROM users WHERE role = ? ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`,
    [role]
  );
  const countRows = await query('SELECT COUNT(*) AS total FROM users WHERE role = ?', [role]);
  return { rows, total: countRows[0].total };
};

const listAllUsers = async (limit, offset) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const rows = await query(
    `SELECT id, full_name, email, role, status, seller_approval, created_at
     FROM users ORDER BY created_at DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`
  );
  const countRows = await query('SELECT COUNT(*) AS total FROM users');
  return { rows, total: countRows[0].total };
};

const updateSellerApproval = async (sellerId, approval) => {
  await query(
    `UPDATE users
     SET seller_approval = ?, status = CASE WHEN ? = 'BLOCKED' THEN 'BLOCKED' ELSE 'ACTIVE' END
     WHERE id = ? AND role = 'SELLER'`,
    [approval, approval, sellerId]
  );
  return findById(sellerId);
};

module.exports = {
  create,
  findByEmail,
  findById,
  findAuthByEmail,
  listUsersByRole,
  listAllUsers,
  updateSellerApproval,
};
