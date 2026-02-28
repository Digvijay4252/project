const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

const run = async () => {
  const sqlPath = path.join(__dirname, 'seed.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log('Seed completed successfully.');
  } finally {
    await connection.end();
  }
};

run().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exit(1);
});
