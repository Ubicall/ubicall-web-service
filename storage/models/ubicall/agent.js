/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('agent', { 
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sip_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
