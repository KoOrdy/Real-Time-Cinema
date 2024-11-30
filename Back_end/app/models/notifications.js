module.exports = (sequelize, DataTypes) => {
  const Notifications = sequelize.define(
    'Notifications',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('in-app', 'email'),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      timestamp: {
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW,
      },
    }
  );

  Notifications.associate = (models) => {
    Notifications.belongsTo(models.Users, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE',
    });
  };

  return Notifications;
};