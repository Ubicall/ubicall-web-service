/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("limit_data", { 
    hostname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    realm: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
