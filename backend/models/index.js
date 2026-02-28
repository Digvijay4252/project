const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect
  }
);

const db = {};

// Import models
db.User = require('./User')(sequelize, DataTypes);

// Sync models with database and create tables automatically
sequelize.sync({ alter: true })
  .then(() => {
    console.log('All tables created/updated successfully!');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Export sequelize instance and models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
