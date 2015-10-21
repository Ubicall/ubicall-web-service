/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("directory_domains", { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    domain_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
