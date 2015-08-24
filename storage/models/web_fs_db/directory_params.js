/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('directory_params', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    directory_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    param_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    param_value: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
