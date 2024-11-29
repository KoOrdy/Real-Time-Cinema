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
  }, {
    indexes: [
      {
        unique: true,
        fields: ['cinemaId', 'hallId', 'name'], // Unique seat name within a hall
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
  };

  Seats.beforeCreate(async (seat, options) => {
    const hall = await sequelize.models.Halls.findByPk(seat.hallId);

    if (!hall) {
      throw new Error(`Hall with ID ${seat.hallId} does not exist.`);
    }

    const hallName = hall.name;
    const seatCount = await sequelize.models.Seats.count({
      where: { hallId: seat.hallId },
    });

    if (seatCount >= 47) {
      throw new Error(`Hall ${hallName} already has the maximum of 47 seats.`);
    }

    seat.name = `${seatCount + 1}-${hallName}`;
  });

  return Seats;
};
