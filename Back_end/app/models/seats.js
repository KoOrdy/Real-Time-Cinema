module.exports = (sequelize, DataTypes) => {
    const Seats = sequelize.define('Seats', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.ENUM('available', 'booked'),
        defaultValue: 'available',
      },
    });
  
    Seats.associate = (models) => {
      Seats.belongsTo(models.Hall, {
        foreignKey: 'hallId',
        as: 'hall',
      });
    };
  
    return Seats;
  };
  