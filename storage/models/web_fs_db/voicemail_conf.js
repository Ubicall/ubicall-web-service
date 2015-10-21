/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("voicemail_conf", { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    vm_profile: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
