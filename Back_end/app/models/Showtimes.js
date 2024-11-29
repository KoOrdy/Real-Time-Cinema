module.exports = (sequelize, DataTypes) => {
  const Showtimes = sequelize.define('Showtimes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    movieId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Movies',
        key: 'id',
      },
      allowNull: true,
    },
    cinemaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cinemas',
        key: 'id',
      },
      allowNull: true,
    },
    hallId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Halls',
        key: 'id',
      },
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['movieId', 'cinemaId', 'hallId', 'date', 'startTime'],
      },
    ],
  });

  Showtimes.associate = (models) => {
    Showtimes.belongsTo(models.Movies, {
      foreignKey: 'movieId',
      as: 'movie',
      onDelete: 'SET NULL',
    });
    Showtimes.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
      onDelete: 'CASCADE',
    });
    Showtimes.belongsTo(models.Halls, {
      foreignKey: 'hallId',
      as: 'hall',
      onDelete: 'CASCADE',
    });
    Showtimes.belongsTo(models.Users, {
      foreignKey: 'vendorId',
      as: 'vendor',
      onDelete: 'CASCADE',
    });
    Showtimes.hasMany(models.Bookings, {
      foreignKey: 'showtimeId',
      as: 'bookings',
      onDelete: 'CASCADE',
    });
  };

  return Showtimes;
};