/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("ivr_conf", { 
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    greet_long: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    greet_short: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invalid_sound: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exit_sound: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    max_failures: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      defaultValue: "3"
    },
    timeout: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: "5"
    },
    tts_engine: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tts_voice: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });
};
