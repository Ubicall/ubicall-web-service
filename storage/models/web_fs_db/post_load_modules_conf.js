/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('post_load_modules_conf', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    module_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    load_module: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: '1'
    },
    priority: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '1000'
    }
  });
};
