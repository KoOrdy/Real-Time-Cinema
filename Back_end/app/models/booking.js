module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define('Booking', {
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

  Booking.associate = (models) => {
    Booking.belongsTo(models.Showtime, {
      foreignKey: 'showtimeId',
      as: 'showtime',
    });
  
    Booking.belongsTo(models.Users, {
      foreignKey: 'customerId',
      as: 'customer',
    });
  };
  

  return Booking;
};
