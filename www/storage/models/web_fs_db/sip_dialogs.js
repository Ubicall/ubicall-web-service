/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sip_dialogs', { 
    call_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sip_to_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sip_to_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sip_from_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sip_from_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direction: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
