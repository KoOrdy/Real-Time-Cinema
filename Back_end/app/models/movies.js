
  
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
    });
  
    Movies.associate = (models) => {
      Movies.belongsToMany(models.Cinemas, {
        through: 'CinemaMovie',
        foreignKey: 'movieId',
        as: 'cinemas',
      });
      Movies.hasMany(models.Showtime, {
        foreignKey: 'movieId',
        as: 'showtimes',
      });
      Movies.hasMany(models.Booking, {
        foreignKey: 'movieId',
        as: 'bookings',
      });
    };
  
    return Movies;
  };
  