/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("local_stream_conf", { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    directory_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    directory_path: {
      type: DataTypes.TEXT,
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
