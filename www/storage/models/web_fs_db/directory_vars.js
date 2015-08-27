/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('directory_vars', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    directory_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    var_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    var_value: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
