/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sofia_aliases', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    sofia_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    alias_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
