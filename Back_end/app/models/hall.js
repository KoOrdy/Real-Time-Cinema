module.exports = (sequelize, DataTypes) => {
  const Hall = sequelize.define('Hall', {
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

  Hall.associate = (models) => {
    Hall.belongsTo(models.cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });
    Hall.hasMany(models.Seats, {
      foreignKey: 'hallId',
      as: 'seats',
    });
  };

  return Hall;
};
