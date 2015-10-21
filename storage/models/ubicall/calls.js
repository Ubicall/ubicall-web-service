/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("calls", {
    id: {
      type: DataTypes.INTEGER(10),
      primaryKey: true,
      autoIncrement: true
    },
    queue_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uniqueid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    schedule_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "CURRENT_TIMESTAMP"
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    retries: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: "0"
    },
    duration: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    id_agent: {
      type: DataTypes.INTEGER(10),
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
    dnc: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: "0"
    },
    date_init: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    time_init: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    time_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    agent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    failure_cause: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    failure_cause_txt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    datetime_originate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trunk: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    call_data: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vdomain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    caller_type: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: "0"
    }
  });
};
