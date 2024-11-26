module.exports = (sequelize, DataTypes) => {
  const Cinemas = sequelize.define('Cinemas', {
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
    Cinemas.belongsTo(models.Users, {
      foreignKey: 'vendorId',
      as: 'vendor',
    });
    Cinemas.hasMany(models.Hall, {
      foreignKey: 'cinemaId',
      as: 'halls',
    });
    Cinemas.belongsToMany(models.Movies, {
      through: 'CinemaMovie',
      foreignKey: 'cinemaId',
      as: 'movies',
    });
  };
  
  return Cinemas;
};
