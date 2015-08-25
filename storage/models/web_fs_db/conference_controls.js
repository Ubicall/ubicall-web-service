/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conference_controls', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    conf_group: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    digits: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
