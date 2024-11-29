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
      type: DataTypes.JSONB,
      unique: true,
      allowNull: false,
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Cinemas.associate = (models) => {
    Cinemas.hasMany(models.Movies, {
      foreignKey: 'cinemaId',
      as: 'movies',
    });

    Cinemas.belongsTo(models.Users, {
      foreignKey: 'vendorId',
      as: 'vendor',
    });

    Cinemas.hasMany(models.Halls, {
      foreignKey: 'cinemaId',
      as: 'halls',
    });
  };

  return Cinemas;
};
