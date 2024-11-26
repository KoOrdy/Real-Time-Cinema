module.exports = (sequelize, DataTypes) => {
    const BookingSeats = sequelize.define('BookingSeats', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bookingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Bookings',
          key: 'id',
        },
      },
      seatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Seats',
          key: 'id',
        },
      },
    });
  
    return BookingSeats;
  };
  