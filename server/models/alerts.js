const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('alerts', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('ABSENCE', 'LATE', 'FREQUENT_ABSENCE', 'SYSTEM', 'SECURITY'),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
      defaultValue: "MEDIUM"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'alerts',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "alerts_createdBy_fkey",
        using: "BTREE",
        fields: [
          { name: "createdBy" },
        ]
      },
      {
        name: "idx_alerts_user",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "idx_alerts_read",
        using: "BTREE",
        fields: [
          { name: "isRead" },
        ]
      },
    ]
  });
};
