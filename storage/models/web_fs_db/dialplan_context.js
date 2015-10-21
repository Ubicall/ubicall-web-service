/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("dialplan_context", { 
    context_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    dialplan_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    context: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  });
};
