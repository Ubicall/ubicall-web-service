/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('directory_gateways', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    directory_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    gateway_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
