/* jshint indent: 2 */

/**
* CREATE view ubicall.client_version_view
* AS
* SELECT
*      client_id , name , licence_key , url ,
*      server_id , version, enabled , demo
*      FROM ubicall.client JOIN ubicall.version ON ubicall.client.id = ubicall.version.client_id;
**/

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('client_version_view', {
    client_id: {
      type: DataTypes.INTEGER(64),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    licence_key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    enabled: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
      defaultValue: '1'
    },
    demo: {
      type: DataTypes.INTEGER(2),
      allowNull: true,
      defaultValue: '0'
    },
    server_id: {
      type: DataTypes.INTEGER(64),
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
};
