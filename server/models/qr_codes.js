const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('qr_codes', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "qr_codes_code_key"
    },
    expiresAt: {
      type: DataTypes.DATE(3),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    scansCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    maxScans: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'qr_codes',
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
        name: "qr_codes_code_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
        ]
      },
      {
        name: "idx_qrcodes_course",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "idx_qrcodes_active",
        using: "BTREE",
        fields: [
          { name: "isActive" },
        ]
      },
    ]
  });
};
