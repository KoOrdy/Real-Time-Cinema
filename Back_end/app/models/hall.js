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
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 47,
      validate: {
        is: {
          args: /^47$/,
          msg: 'Capacity must be 47 seats.',
        },
      },
    },
  });

  Hall.associate = (models) => {
    Hall.belongsTo(models.cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });
  };

  return Hall;
};
