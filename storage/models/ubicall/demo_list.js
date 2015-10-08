/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('demo_list', {
    w_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey:true
    },
    w_fname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    w_lname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    w_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    w_phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    w_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    w_country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    w_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    w_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    w_comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    w_reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    w_status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    w_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: 'CURRENT_TIMESTAMP'
    }
  });
};
