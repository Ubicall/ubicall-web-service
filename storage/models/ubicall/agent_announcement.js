/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("agent_announcement", {
    id: {
      type: DataTypes.INTEGER(16),
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
