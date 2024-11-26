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
    Showtime.belongsTo(models.movies, {
      foreignKey: 'movieId',
      as: 'movie',
    });
    Showtime.belongsTo(models.cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });
    Showtime.belongsTo(models.Hall, {
      foreignKey: 'hallId',
      as: 'hall',
    });
    Showtime.hasMany(models.booking, {
      foreignKey: 'showtimeId',
      as: 'bookings',
    });
  };

  return Showtime;
};
