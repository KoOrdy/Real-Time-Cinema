module.exports = (sequelize, DataTypes) => {
  const Halls = sequelize.define(
    'Halls',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      cinemaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      capacity: {
        type: DataTypes.INTEGER,
        defaultValue: 47,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['cinemaId', 'name'], // Unique hall names within the same cinema
        },
      ],
    }
  );

  Halls.associate = (models) => {
    Halls.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
      onDelete: 'CASCADE',
    });
    Halls.hasMany(models.Seats, {
      foreignKey: 'hallId',
      as: 'seats',
    });
    Halls.hasMany(models.Movies, {
      foreignKey: 'hallId',
      as: 'movies',
    });
    Halls.hasMany(models.Showtimes, {
      foreignKey: 'hallId',
      as: 'Showtimes',
    });
    Halls.hasMany(models.Bookings, {
      foreignKey: 'hallId',
      as: 'bookings',
    });
  };

  return Halls;
};