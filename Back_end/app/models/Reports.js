module.exports = (sequelize, DataTypes) => {
  const Reports = sequelize.define(
    'Reports',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      reportDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true, 
      },
      newCustomers: {
        type: DataTypes.INTEGER,
        defaultValue: 0, 
      },
      newCinemas: {
        type: DataTypes.INTEGER,
        defaultValue: 0, 
      },
      totalBookings: {
        type: DataTypes.INTEGER,
        defaultValue: 0, 
      },
    }
  );

  return Reports;
};
