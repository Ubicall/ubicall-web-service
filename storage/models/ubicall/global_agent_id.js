/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("global_agent_id", {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    global_id: {
      type: DataTypes.INTEGER(8),
      allowNull: false,
    }
  });
};
