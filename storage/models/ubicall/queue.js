/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('queue', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.INTEGER(32),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wrap_up_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agent_announcement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    policy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cidname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qweight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    music_on_hold: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    callrecording: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    caller_vol_adj: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    agent_vol_adj: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autopause: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxcallers: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joinempty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leaveempty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s_agent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    d_agent: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
