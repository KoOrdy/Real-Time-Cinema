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
    },
    status: {
      type: DataTypes.ENUM('available', 'booked'),
      defaultValue: 'available',
    },
    hallId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Halls',
        key: 'id',
      },
    },
    cinemaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Cinemas',
        key: 'id',
      },
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Movies',
        key: 'id',
      },
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['cinemaId', 'hallId', 'name'],
      },
    ],
  });

  Seats.associate = (models) => {

    Seats.belongsTo(models.Halls, {
      foreignKey: 'hallId',
      as: 'hall',
    });
    Seats.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
    });
    Seats.belongsToMany(models.Bookings, {
      through: 'BookingSeats',
      foreignKey: 'seatId',
      otherKey: 'bookingId',
      as: 'bookings', 
    });
    
  };

  Seats.beforeCreate(async (seat) => {
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
