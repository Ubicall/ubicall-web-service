/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rss_conf', { 
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    directory_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    feed: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    local_file: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1000'
    }
  });
};
