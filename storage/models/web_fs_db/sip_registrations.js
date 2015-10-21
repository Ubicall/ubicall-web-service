/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("sip_registrations", { 
    call_id: {
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
    contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rpid: {
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
    }
  });
};
