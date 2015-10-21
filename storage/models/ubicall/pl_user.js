/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("pl_user", {
    pl_id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    pl_username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pl_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pl_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pl_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pl_status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    pl_type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    }
  });
};
