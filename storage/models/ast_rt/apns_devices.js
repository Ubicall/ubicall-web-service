/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("apns_devices", { 
    pid: {
      type: DataTypes.INTEGER(9),
      allowNull: false,
    },
    appname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    appversion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deviceuid: {
      type: "CHAR(40)",
      allowNull: false,
    },
    devicetoken: {
      type: "CHAR(64)",
      allowNull: false,
    },
    devicename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    devicemodel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deviceversion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pushbadge: {
      type: DataTypes.ENUM("DISABLED","ENABLED"),
      allowNull: true,
      defaultValue: "disabled"
    },
    pushalert: {
      type: DataTypes.ENUM("DISABLED","ENABLED"),
      allowNull: true,
      defaultValue: "disabled"
    },
    pushsound: {
      type: DataTypes.ENUM("DISABLED","ENABLED"),
      allowNull: true,
      defaultValue: "disabled"
    },
    development: {
      type: DataTypes.ENUM("PRODUCTION","SANDBOX"),
      allowNull: false,
      defaultValue: "production"
    },
    status: {
      type: DataTypes.ENUM("ACTIVE","UNINSTALLED"),
      allowNull: false,
      defaultValue: "active"
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  });
};
