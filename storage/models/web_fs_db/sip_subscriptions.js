/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sip_subscriptions', { 
    proto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sip_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sip_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sub_to_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sub_to_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    event: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    call_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_from: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    full_via: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expires: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accept: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
