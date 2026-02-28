const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = require('./User')(sequelize, DataTypes);
const Store = require('./Store')(sequelize, DataTypes);
const Food = require('./Food')(sequelize, DataTypes);
const Order = require('./Order')(sequelize, DataTypes);
const OrderItem = require('./OrderItem')(sequelize, DataTypes);

User.hasOne(Store, { foreignKey: 'seller_id', onDelete: 'CASCADE' });
Store.belongsTo(User, { foreignKey: 'seller_id' });

User.hasMany(Food, { foreignKey: 'seller_id', onDelete: 'CASCADE' });
Food.belongsTo(User, { foreignKey: 'seller_id' });

Store.hasMany(Food, { foreignKey: 'store_id', onDelete: 'CASCADE' });
Food.belongsTo(Store, { foreignKey: 'store_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Store.hasMany(Order, { foreignKey: 'store_id' });
Order.belongsTo(Store, { foreignKey: 'store_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Food.hasMany(OrderItem, { foreignKey: 'food_id' });
OrderItem.belongsTo(Food, { foreignKey: 'food_id' });

const syncSchema = async () => {
  await sequelize.authenticate({alter: true });
  await sequelize.sync({ alter: true });
};

module.exports = {
  sequelize,
  syncSchema,
  User,
  Store,
  Food,
  Order,
  OrderItem,
};
