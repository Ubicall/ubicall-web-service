/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sofia_domains', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    sofia_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    domain_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parse: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  });
};
