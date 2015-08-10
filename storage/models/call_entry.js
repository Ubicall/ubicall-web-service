/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('call_entry', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    id_agent: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    id_queue_call_entry: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    id_contact: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    callerid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    datetime_init: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    datetime_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transfer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    datetime_entry_queue: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration_wait: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    uniqueid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_campaign: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    trunk: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
