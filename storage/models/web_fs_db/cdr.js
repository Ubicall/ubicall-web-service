/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cdr', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    caller_id_name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    caller_id_number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    destination_number: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    context: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    start_stamp: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    answer_stamp: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    end_stamp: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    billsec: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    hangup_cause: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    bleg_uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    accountcode: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    read_codec: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    write_codec: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }
  });
};
