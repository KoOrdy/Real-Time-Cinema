module.exports = (sequelize, DataTypes) => {
  const Cinemas = sequelize.define('cinemas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Cinemas.associate = (models) => {
    Cinemas.hasMany(models.Hall, {
      foreignKey: 'cinemaId',
      as: 'halls',
    });
    Cinemas.belongsToMany(models.movies, {
      through: 'CinemaMovie',
      foreignKey: 'cinemaId',
      as: 'movies',
    });
    Cinemas.belongsTo(models.users, {
      foreignKey: 'vendorId',
      as: 'vendor',
    });
  };

  return Cinemas;
};
