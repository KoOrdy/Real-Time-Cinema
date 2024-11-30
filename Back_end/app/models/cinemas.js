module.exports = (sequelize, DataTypes) => {
  const Cinemas = sequelize.define('Cinemas', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
      unique: true,
    },
    contactInfo: {
      type: DataTypes.STRING(100),
    },
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Cinemas.associate = (models) => {
    Cinemas.belongsTo(models.Users, {
      foreignKey: 'vendorId',
      as: 'vendor',
      onDelete: 'CASCADE',
    });
    Cinemas.hasMany(models.Halls, {
      foreignKey: 'cinemaId',
      as: 'halls',
    });
    Cinemas.hasMany(models.Movies, {
      foreignKey: 'cinemaId',
      as: 'movies',
    });
    Cinemas.hasMany(models.Seats, {
      foreignKey: 'cinemaId',
      as: 'seats',
    });
    Cinemas.hasMany(models.Showtimes, {
      foreignKey: 'cinemaId',
      as: 'Showtimes',
    });
    Cinemas.hasMany(models.Bookings, {
      foreignKey: 'cinemaId',
      as: 'bookings',
    });
  };

  return Cinemas;
};