/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("dialplan_extension", { 
    extension_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    context_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    continue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  });
};
