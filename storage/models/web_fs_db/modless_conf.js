/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("modless_conf", { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    conf_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
