module.exports = (sequelize, DataTypes) => {
    const Movies = sequelize.define('movies', {
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
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      releaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      Poster: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    Movies.associate = (models) => {
      Movies.belongsToMany(models.cinemas, {
        through: 'CinemaMovie',
        foreignKey: 'movieId',
        as: 'cinemas',
      });
      Movies.hasMany(models.Showtime, {
        foreignKey: 'movieId',
        as: 'showtimes',
      });
      Movies.hasMany(models.booking, {
        foreignKey: 'movieId',
        as: 'bookings',
      });
    };
  
    return Movies;
  };
  