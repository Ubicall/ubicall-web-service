/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ivr_entries', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    ivr_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    digits: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    params: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
