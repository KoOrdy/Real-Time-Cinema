module.exports = (sequelize, DataTypes) => {
  const Showtimes = sequelize.define('Showtimes', {
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

  Showtimes.associate = (models) => {
    Showtimes.belongsTo(models.Movies, {
      foreignKey: 'movieId',
      as: 'movie',
    });
    Showtimes.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });
    Showtimes.belongsTo(models.Halls, {
      foreignKey: 'hallId',
      as: 'hall',
    });
    Showtimes.hasMany(models.Bookings, {
      foreignKey: 'showtimeId',
      as: 'bookings',
    });
  };

  return Showtimes;
};
