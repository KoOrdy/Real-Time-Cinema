module.exports = (sequelize, DataTypes) => {
  const Movies = sequelize.define('Movies', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in minutes
      allowNull: false,
    },
    Poster: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cinemaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Cinemas',
        key: 'id',
      },
      onDelete: 'CASCADE', // Delete movie if the related cinema is deleted
      allowNull: false,
    },
  });

  Movies.associate = (models) => {
    Movies.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });

    Movies.hasMany(models.Showtimes, {
      foreignKey: 'movieId',
      as: 'showtimes',
    });

    Movies.hasMany(models.Bookings, {
      foreignKey: 'movieId',
      as: 'bookings',
    });
  };

  return Movies;
};
