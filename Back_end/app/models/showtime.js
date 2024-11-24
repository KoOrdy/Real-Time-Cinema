module.exports = (sequelize, DataTypes) => {
  const Showtime = sequelize.define('Showtime', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Showtime.associate = (models) => {
    // A Showtime belongs to one Movie
    Showtime.belongsTo(models.movies, {
      foreignKey: 'movieId',
      as: 'movie',
    });

    // A Showtime belongs to one Cinema
    Showtime.belongsTo(models.cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });

    // A Showtime belongs to one Hall
    Showtime.belongsTo(models.Hall, {
      foreignKey: 'hallId',
      as: 'hall',
    });

    // A Showtime can have many Bookings
    Showtime.hasMany(models.booking, {
      foreignKey: 'showtimeId',
      as: 'bookings',
    });
  };

  return Showtime;
};
