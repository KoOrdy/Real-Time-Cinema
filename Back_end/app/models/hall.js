module.exports = (sequelize, DataTypes) => {
  const Halls = sequelize.define('Halls', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cinemaId: {
      type: DataTypes.INTEGER,
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

  Halls.afterCreate(async (hall, options) => {
    const seats = [];
    for (let i = 1; i <= 47; i++) {
      seats.push({
        name: `Seat-${i}`,
        hallId: hall.id,
        cinemaId: hall.cinemaId, 
      });
    }

    await sequelize.models.Seats.bulkCreate(seats);
  });

  return Halls;
};
