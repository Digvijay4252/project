const { pool } = require('../config/database');
const toSafeInt = (value, fallback = 0) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(0, Math.trunc(num));
};
const sanitizeParams = (params = []) => params.map((value) => (value === undefined ? null : value));

const createOrderWithItems = async ({ userId, storeId, totalAmount, notes, items }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, store_id, total_amount, notes, status)
       VALUES (?, ?, ?, ?, 'PLACED')`,
      sanitizeParams([userId, storeId, totalAmount, notes || null])
    );
    const orderId = orderResult.insertId;

    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (order_id, food_id, quantity, unit_price, item_total)
         VALUES (?, ?, ?, ?, ?)`,
        sanitizeParams([orderId, item.foodId, item.quantity, item.unitPrice, item.itemTotal])
      );
    }

    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const findById = async (orderId) => {
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.execute(
      `SELECT o.*, u.full_name AS customer_name, s.name AS store_name, s.seller_id
       FROM orders o
       INNER JOIN users u ON u.id = o.user_id
       INNER JOIN stores s ON s.id = o.store_id
       WHERE o.id = ? LIMIT 1`,
      [orderId]
    );
    if (!orders[0]) {
      return null;
    }

    const [items] = await connection.execute(
      `SELECT oi.*, f.name AS food_name
       FROM order_items oi
       INNER JOIN foods f ON f.id = oi.food_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return { ...orders[0], items };
  } finally {
    connection.release();
  }
};

const listByUser = async (userId, limit, offset) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.execute(
      `SELECT o.*, s.name AS store_name
       FROM orders o
       INNER JOIN stores s ON s.id = o.store_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      [userId]
    );
    const [[{ total }]] = await connection.execute('SELECT COUNT(*) AS total FROM orders WHERE user_id = ?', [userId]);
    return { rows: orders, total };
  } finally {
    connection.release();
  }
};

const listBySeller = async (sellerId, limit, offset) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.execute(
      `SELECT o.*, u.full_name AS customer_name, s.name AS store_name
       FROM orders o
       INNER JOIN stores s ON s.id = o.store_id
       INNER JOIN users u ON u.id = o.user_id
       WHERE s.seller_id = ?
       ORDER BY o.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      [sellerId]
    );
    const [[{ total }]] = await connection.execute(
      `SELECT COUNT(*) AS total
       FROM orders o
       INNER JOIN stores s ON s.id = o.store_id
       WHERE s.seller_id = ?`,
      [sellerId]
    );
    return { rows: orders, total };
  } finally {
    connection.release();
  }
};

const listAll = async (limit, offset) => {
  const safeLimit = toSafeInt(limit, 10);
  const safeOffset = toSafeInt(offset, 0);
  const connection = await pool.getConnection();
  try {
    const [orders] = await connection.execute(
      `SELECT o.*, u.full_name AS customer_name, s.name AS store_name, seller.full_name AS seller_name
       FROM orders o
       INNER JOIN users u ON u.id = o.user_id
       INNER JOIN stores s ON s.id = o.store_id
       INNER JOIN users seller ON seller.id = s.seller_id
       ORDER BY o.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`
    );
    const [[{ total }]] = await connection.execute('SELECT COUNT(*) AS total FROM orders');
    return { rows: orders, total };
  } finally {
    connection.release();
  }
};

const updateStatus = async (orderId, status) => {
  await pool.execute('UPDATE orders SET status = ? WHERE id = ?', sanitizeParams([status, orderId]));
  return findById(orderId);
};

module.exports = {
  createOrderWithItems,
  findById,
  listByUser,
  listBySeller,
  listAll,
  updateStatus,
};
