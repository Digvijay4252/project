module.exports = (sequelize, DataTypes) => {
  const order = sequelize.define(
    'orders',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'),
        allowNull: false,
        defaultValue: 'PLACED',
      },
      total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'orders',
      indexes: [{ fields: ['user_id'] }, { fields: ['store_id'] }, { fields: ['status'] }],
    }
  );

  return order;
};
