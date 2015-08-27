/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('acl_nodes', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    cidr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    list_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    }
  });
};
