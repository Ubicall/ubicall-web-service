/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sofia_conf', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    profile_name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
