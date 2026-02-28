module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('USER', 'SELLER', 'ADMIN'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('ACTIVE', 'BLOCKED'),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
      seller_approval: {
        type: DataTypes.ENUM('PENDING', 'APPROVED', 'BLOCKED'),
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'users',
      indexes: [{ fields: ['email'] }, { fields: ['role'] }, { fields: ['status'] }],
    }
  );

  return user;
};
