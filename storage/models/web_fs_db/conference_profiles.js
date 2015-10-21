/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("conference_profiles", { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    profile_name: {
      type: DataTypes.STRING,
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
