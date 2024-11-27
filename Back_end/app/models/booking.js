module.exports = (sequelize, DataTypes) => {
  const Bookings = sequelize.define('Bookings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('reserved', 'canceled'),
      defaultValue: 'reserved',
    },
  });

  Bookings.associate = (models) => {
    Bookings.belongsTo(models.Showtimes, {
      foreignKey: 'showtimeId',
      as: 'showtime',
    });
  
    Bookings.belongsTo(models.Users, {
      foreignKey: 'customerId',
      as: 'customer',
    });
  };
  

  return Bookings;
};
