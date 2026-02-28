const { query } = require('./database');

const hasTable = async (tableName) => {
  const rows = await query(
    `SELECT COUNT(*) AS total
     FROM information_schema.tables
     WHERE table_schema = DATABASE() AND table_name = ?`,
    [tableName]
  );
  return rows[0].total > 0;
};

const hasColumn = async (tableName, columnName) => {
  const rows = await query(
    `SELECT COUNT(*) AS total
     FROM information_schema.columns
     WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?`,
    [tableName, columnName]
  );
  return rows[0].total > 0;
};

const normalizeLegacyUsersTable = async () => {
  if (!(await hasTable('users'))) {
    return;
  }

  if (!(await hasColumn('users', 'password_hash'))) {
    await query('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL');
  }
  if (!(await hasColumn('users', 'role'))) {
    await query("ALTER TABLE users ADD COLUMN role ENUM('USER','SELLER','ADMIN') NULL");
  }
  if (!(await hasColumn('users', 'status'))) {
    await query("ALTER TABLE users ADD COLUMN status ENUM('ACTIVE','BLOCKED') NOT NULL DEFAULT 'ACTIVE'");
  }
  if (!(await hasColumn('users', 'seller_approval'))) {
    await query("ALTER TABLE users ADD COLUMN seller_approval ENUM('PENDING','APPROVED','BLOCKED') NULL");
  }
  if (!(await hasColumn('users', 'created_at'))) {
    await query('ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
  } else {
    await query('ALTER TABLE users MODIFY COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP');
  }
  if (!(await hasColumn('users', 'updated_at'))) {
    await query('ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  } else {
    await query('ALTER TABLE users MODIFY COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
  }

  if (await hasColumn('users', 'password')) {
    await query('UPDATE users SET password_hash = COALESCE(password_hash, password)');
    await query('ALTER TABLE users MODIFY COLUMN password VARCHAR(255) NULL DEFAULT NULL');
  }

  if (await hasColumn('users', 'user_type')) {
    await query(
      `UPDATE users
       SET role = COALESCE(
         role,
         CASE UPPER(user_type)
           WHEN 'USER' THEN 'USER'
           WHEN 'SELLER' THEN 'SELLER'
           WHEN 'ADMIN' THEN 'ADMIN'
           ELSE 'USER'
         END
       )`
    );
  }

  await query("UPDATE users SET role = COALESCE(role, 'USER')");
  await query("UPDATE users SET password_hash = COALESCE(password_hash, '')");
  await query("ALTER TABLE users MODIFY COLUMN role ENUM('USER','SELLER','ADMIN') NOT NULL");
  await query('ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NOT NULL');
};

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'SELLER', 'ADMIN') NOT NULL,
    status ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',
    seller_approval ENUM('PENDING', 'APPROVED', 'BLOCKED') NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_status (status)
  )`,
  `CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(500) NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    phone VARCHAR(20) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_stores_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_stores_city (city),
    INDEX idx_stores_lat_lng (latitude, longitude)
  )`,
  `CREATE TABLE IF NOT EXISTS foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    store_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(500) NOT NULL,
    category VARCHAR(80) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    image_url VARCHAR(255) NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_foods_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_foods_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    INDEX idx_foods_category (category),
    INDEX idx_foods_price (price),
    INDEX idx_foods_rating (rating),
    INDEX idx_foods_availability (is_available)
  )`,
  `CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    status ENUM('PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PLACED',
    total_amount DECIMAL(10, 2) NOT NULL,
    notes VARCHAR(500) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_orders_store FOREIGN KEY (store_id) REFERENCES stores(id),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_store (store_id),
    INDEX idx_orders_status (status)
  )`,
  `CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    item_total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_food FOREIGN KEY (food_id) REFERENCES foods(id),
    INDEX idx_order_items_order (order_id)
  )`,
];

const initializeSchema = async () => {
  await normalizeLegacyUsersTable();
  for (const sql of statements) {
    await query(sql);
  }
};

module.exports = { initializeSchema };
