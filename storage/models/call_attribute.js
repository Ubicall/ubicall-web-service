/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('call_attribute', { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    id_call: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    columna: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    column_number: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: '0'
    }
  });
};
