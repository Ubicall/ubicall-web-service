/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("email_destination", {
    id: {
      type: DataTypes.INTEGER(100),
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.INTEGER(100),
      allowNull: false,
    },
    licence_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });
};
