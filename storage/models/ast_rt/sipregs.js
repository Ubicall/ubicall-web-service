/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("sipregs", { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "0"
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ""
    },
    ipaddr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    port: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
    },
    regseconds: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    defaultuser: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullcontact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    regserver: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    useragent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastms: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
