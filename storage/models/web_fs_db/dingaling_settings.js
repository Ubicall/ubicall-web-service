/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dingaling_settings', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    param_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    param_value: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
