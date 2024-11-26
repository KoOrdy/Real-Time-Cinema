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
          model: 'users',
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
      UserDetails.belongsTo(models.users, {
        foreignKey: 'userId',
        as: 'user',
      });
    };
  
    return UserDetails;
  };
  