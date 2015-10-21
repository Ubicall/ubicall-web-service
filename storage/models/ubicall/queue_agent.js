/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("queue_agent", {
    id: {
      type: DataTypes.INTEGER(16),
      primaryKey: true,
      autoIncrement: true
    },
    queue_id: {
      type: DataTypes.INTEGER(16),
      allowNull: false,
    },
    queue_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agent_id: {
      type: DataTypes.INTEGER(16),
      allowNull: false,
    },
    agent_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.INTEGER(16),
      allowNull: false,
    },
    client_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
