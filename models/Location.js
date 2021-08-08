
// create model location
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('locations', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    }, {
      timestamps: false
    });

    return Location;
};