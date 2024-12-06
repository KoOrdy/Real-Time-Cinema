module.exports = (sequelize, DataTypes) => {
  const Showtimes = sequelize.define(
    'Showtimes',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      movieId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cinemaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false, // Format: YYYY-MM-DD
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false, // Format: HH:MM:SS
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false, // Format: HH:MM:SS
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['movieId', 'cinemaId', 'hallId', 'date', 'startTime'], // Prevent overlapping time slots
        },
      ],
    }
  );

  Showtimes.associate = (models) => {
    Showtimes.belongsTo(models.Movies, {
      foreignKey: 'movieId',
      as: 'movie',
      onDelete: 'CASCADE',
    });
    Showtimes.belongsTo(models.Halls, {
      foreignKey: 'hallId',
      as: 'hall',
      onDelete: 'CASCADE',
    });
    Showtimes.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
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
    });
  };

  return Showtimes;
};
