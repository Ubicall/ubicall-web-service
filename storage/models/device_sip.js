/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('device_sip', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    sdk_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sdk_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deviceuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licence_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  });
};
