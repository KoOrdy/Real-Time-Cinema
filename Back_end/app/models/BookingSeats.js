module.exports = (sequelize, DataTypes) => {
  const BookingSeats = sequelize.define(
    'BookingSeats',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['bookingId', 'seatId'], // Prevent duplicate seat bookings in the same booking
        },
      ],
    }
  );

  BookingSeats.associate = (models) => {
    BookingSeats.belongsTo(models.Bookings, {
      foreignKey: 'bookingId',
      as: 'booking',
      onDelete: 'CASCADE',
    });
    BookingSeats.belongsTo(models.Seats, {
      foreignKey: 'seatId',
      as: 'seat',
      onDelete: 'CASCADE',
    });
  };

  return BookingSeats;
};
