module.exports = (sequelize, DataTypes) => {
  const Halls = sequelize.define('Halls', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Halls.associate = (models) => {
    Halls.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });
    Halls.hasMany(models.Seats, {
      foreignKey: 'hallId',
      as: 'seats',
    });
  };

  return Halls;
};
