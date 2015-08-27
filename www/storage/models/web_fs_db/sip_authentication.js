/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sip_authentication', { 
    nonce: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expires: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
