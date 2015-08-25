/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dialplan_actions', { 
    action_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    condition_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    application: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  });
};
