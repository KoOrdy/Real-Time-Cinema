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
    cinemaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hallId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    showtimeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seats: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // Store seat IDs as an array of integers
      allowNull: false,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM('booked', 'canceled'),
      defaultValue: 'booked',
    },
  });

  Bookings.associate = (models) => {
    Bookings.belongsTo(models.Users, {
      foreignKey: 'customerId',
      as: 'customer',
    });
    Bookings.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });
    Bookings.belongsTo(models.Halls, {
      foreignKey: 'hallId',
      as: 'hall',
    });
    Bookings.belongsTo(models.Showtimes, {
      foreignKey: 'showtimeId',
      as: 'showtime',
    });
    Bookings.belongsTo(models.Movies, {
      foreignKey: 'movieId',
      as: 'movie',
    });
  };

  return Bookings;
};
