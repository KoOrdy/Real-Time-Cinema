module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define('notifications', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('Booking Confirmation', 'Vendor Booking Summary'),
        allowNull: false,
      },
    });
  
    Notifications.associate = (models) => {
      Notifications.belongsTo(models.users, {
        foreignKey: 'userId',
        as: 'user',
      });
    };
  
    return Notifications;
  };
  