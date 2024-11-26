module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'vendor', 'customer'),
      allowNull: false,
    },
  });

  Users.associate = (models) => {
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
