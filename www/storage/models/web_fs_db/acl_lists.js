/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('acl_lists', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    acl_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    default_policy: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
