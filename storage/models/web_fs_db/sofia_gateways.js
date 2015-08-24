/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sofia_gateways', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    sofia_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    gateway_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gateway_param: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gateway_value: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
