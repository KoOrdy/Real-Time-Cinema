module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
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
  Users.hasOne(models.UserDetails, {
    foreignKey: 'userId',
    as: 'details',
  }); 

  Users.hasMany(models.Notifications, {
    foreignKey: 'userId',
    as: 'notifications',
  });
};
  return Users;
};
