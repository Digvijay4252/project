module.exports = (sequelize, DataTypes) => {

    const user = sequelize.define('users', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_type: {
        type: DataTypes.ENUM('user', 'seller', 'admin'),
        defaultValue: 'user'
      }
    }, {
      timestamps: true,
      underscored: true,
      tableName: 'users',
      indexes: [
        {
          fields: ['email']
        },
        {
          fields: ['user_type']
        }
      ]
    })
    return user;
  };
