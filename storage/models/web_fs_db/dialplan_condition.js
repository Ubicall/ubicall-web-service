/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("dialplan_condition", { 
    condition_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    extension_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    field: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expression: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  });
};
