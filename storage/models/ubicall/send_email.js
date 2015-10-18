/* jshint indent: 2 */
var moment = require('moment');
var now = new moment();

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('send_email', {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    email_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    time_insert: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: now.format('YYYY-MM-DD HH:mm:ss')
    },
    time_send: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: now.format('YYYY-MM-DD HH:mm:ss')
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
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
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    device_token: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
