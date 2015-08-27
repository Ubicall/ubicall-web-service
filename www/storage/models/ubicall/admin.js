/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin', {
    id: {
      type: DataTypes.INTEGER(100),
      primaryKey: true,
      autoIncrement: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licence_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    cid: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    }
  });
};
