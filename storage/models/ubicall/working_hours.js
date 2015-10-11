/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('working_hours', {
    id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
      primaryKey:true
    },
    client_id: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
    },
    queue_id: {
      type: DataTypes.INTEGER(255),
      allowNull: true,
    },
    time_zone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time_zone_offset: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
    },
    day_0: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    day_0_start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_0_end: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_1: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    day_1_start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_1_end: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_2: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    day_2_start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_2_end: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_3: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    day_3_start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_3_end: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_4: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    day_4_start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_4_end: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_5: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    day_5_start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_5_end: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_6: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
    },
    day_6_start: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    day_6_end: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
