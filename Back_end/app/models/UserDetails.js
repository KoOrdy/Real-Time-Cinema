module.exports = (sequelize, DataTypes) => {
    const UserDetails = sequelize.define('UserDetails', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      role: {
        type: DataTypes.ENUM('vendor', 'customer'),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING, // URL or file path
        allowNull: true,
      },
    });
  
    UserDetails.associate = (models) => {
      UserDetails.belongsTo(models.Users, {
        foreignKey: 'userId',
        as: 'user',
      });
    };
  
    return UserDetails;
  };
  