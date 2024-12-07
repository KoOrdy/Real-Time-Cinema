module.exports = (sequelize, DataTypes) => {
  const Movies = sequelize.define(
    'Movies',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false, // Duration in minutes
      },
      genre: {
        type: DataTypes.ENUM(
          'comedy',
          'drama',
          'romance',
          'action',
          'animation',
          'horror',
          'sci-fi',
          'fantasy',
          'mystery',
          'documentary'
        ),
        allowNull: false,
      },
      poster: {
        type: DataTypes.TEXT, // URL for the poster image
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      vendorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cinemaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hallId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    });

  Movies.associate = (models) => {
    Movies.belongsTo(models.Users, {
      foreignKey: 'vendorId',
      as: 'vendor',
      onDelete: 'CASCADE',
    });
    Movies.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
      onDelete: 'CASCADE',
    });
    Movies.belongsTo(models.Halls, {
      foreignKey: 'hallId',
      as: 'hall',
      onDelete: 'CASCADE',
    });
    Movies.hasMany(models.Showtimes, {
      foreignKey: 'movieId',
      as: 'Showtimes',
    });
    Movies.hasMany(models.Bookings, {
      foreignKey: 'movieId',
      as: 'bookings',
    });
  };

  return Movies;
};