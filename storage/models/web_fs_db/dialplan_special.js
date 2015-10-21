/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("dialplan_special", { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    context: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    class_file: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
