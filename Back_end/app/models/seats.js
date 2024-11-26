module.exports = (sequelize, DataTypes) => {
  const Seats = sequelize.define('Seats', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('available', 'booked'),
      defaultValue: 'available',
    },
    hallId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Hall',
        key: 'id',
      },
    },
    cinemaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cinema',
        key: 'id',
      },
    },
  });

  Seats.associate = (models) => {
    Seats.belongsTo(models.Hall, {
      foreignKey: 'hallId',
      as: 'hall',
    });
    Seats.belongsTo(models.Cinema, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });
  };

  Seats.beforeCreate(async (seat, options) => {
    const hall = await sequelize.models.Hall.findByPk(seat.hallId);

    if (!hall) {
      throw new Error(`Hall with ID ${seat.hallId} does not exist.`);
    }

    const hallLetter = await getHallLetter(seat.hallId, seat.cinemaId);
    const seatCount = await sequelize.models.Seats.count({
      where: { hallId: seat.hallId },
    });


    seat.name = `${hallLetter}${seatCount + 1}`;
  });

  return Seats;
};


async function getHallLetter(hallId, cinemaId) {
  const halls = await sequelize.models.Hall.findAll({
    where: { cinemaId },
    order: [['id', 'ASC']], 
  });

  const hallIndex = halls.findIndex((hall) => hall.id === hallId);
  if (hallIndex === -1) {
    throw new Error(`Hall with ID ${hallId} does not belong to Cinema with ID ${cinemaId}.`);
  }

  return String.fromCharCode(65 + hallIndex);
}
