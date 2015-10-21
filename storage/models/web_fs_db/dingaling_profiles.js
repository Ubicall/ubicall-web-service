/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("dingaling_profiles", { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    profile_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
