/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('directory_global_vars', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    var_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    var_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    }
  });
};
