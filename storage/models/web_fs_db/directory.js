/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('directory', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domain_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    cache: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  });
};
