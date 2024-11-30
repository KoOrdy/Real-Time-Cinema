module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    role: {
      type: DataTypes.ENUM('admin', 'vendor', 'customer'),
      allowNull: false,
    },
  });

  Users.associate = (models) => {
    Users.hasMany(models.Cinemas, {
      foreignKey: 'vendorId',
      as: 'cinemas',
    });
    Users.hasMany(models.Bookings, {
      foreignKey: 'customerId',
      as: 'bookings',
    });
    Users.hasMany(models.Notifications, {
      foreignKey: 'userId',
      as: 'notifications',
    });
  };

  return Users;
};
