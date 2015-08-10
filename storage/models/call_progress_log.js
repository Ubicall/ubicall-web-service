/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('call_progress_log', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    datetime_entry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_campaign_incoming: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    id_call_incoming: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    id_campaign_outgoing: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    id_call_outgoing: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    new_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    retry: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    uniqueid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trunk: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_agent: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    }
  });
};
