/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('demo_calls', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_campaign: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    status: {
      type: DataTypes.INTEGER(2),
      allowNull: false,
      defaultValue: '0'
    },
    long: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
