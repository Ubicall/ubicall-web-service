/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cdr', { 
    accountcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    src: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dst: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dcontext: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    channel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dstchannel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastapp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastdata: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    answer: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    billsec: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    disposition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amaflags: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userfield: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uniqueid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    linkedid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    peeraccount: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sequence: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
