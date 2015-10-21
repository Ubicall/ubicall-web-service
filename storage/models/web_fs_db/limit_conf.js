/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("limit_conf", { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
