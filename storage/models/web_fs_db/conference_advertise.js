/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("conference_advertise", { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
