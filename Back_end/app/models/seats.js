module.exports = (sequelize, DataTypes) => {
  const Seats = sequelize.define(
    'Seats',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      seatNum: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      hallId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cinemaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('available', 'booked'),
        defaultValue: 'available',
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['cinemaId', 'hallId', 'seatNum'], // Unique seat naming within a cinema and hall
        },
      ],
    }
  );

  Seats.associate = (models) => {
    Seats.belongsTo(models.Halls, {
      foreignKey: 'hallId',
      as: 'hall',
      onDelete: 'CASCADE',
    });
    Seats.belongsTo(models.Cinemas, {
      foreignKey: 'cinemaId',
      as: 'cinema',
      onDelete: 'CASCADE',
    });
    Seats.hasMany(models.BookingSeats, {
      foreignKey: 'seatId',
      as: 'bookingSeats',
    });
  };

  return Seats;
};