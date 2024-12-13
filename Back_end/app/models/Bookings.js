module.exports = (sequelize, DataTypes) => {
  const Bookings = sequelize.define(
    'Bookings',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cinemaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      showtimeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookingStatus: {
        type: DataTypes.ENUM('confirmed', 'cancelled'),
        defaultValue: 'confirmed',
      },
      bookingDate: {
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    }
  );

  Bookings.associate = (models) => {
    Bookings.belongsTo(models.Users, {
      foreignKey: 'customerId',
      as: 'customer',
      onDelete: 'CASCADE',
    });
    Bookings.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
      onDelete: 'CASCADE',
    });
    Bookings.belongsTo(models.Halls, {
      foreignKey: 'hallId',
      as: 'hall',
      onDelete: 'CASCADE',
    });
    Bookings.belongsTo(models.Movies, {
      foreignKey: 'movieId',
      as: 'movie',
      onDelete: 'CASCADE',
    });
    Bookings.belongsTo(models.Showtimes, {
      foreignKey: 'showtimeId',
      as: 'showtime',
      onDelete: 'CASCADE',
    });
    Bookings.hasMany(models.BookingSeats, {
      foreignKey: 'bookingId',
      as: 'bookingSeats',
    });
  };

  return Bookings;
};
