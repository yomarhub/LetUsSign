const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('signatures', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      }
    },
    signatureData: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    signedAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
    },
    status: {
      type: DataTypes.ENUM('PRESENT', 'LATE', 'ABSENT'),
      allowNull: false,
      defaultValue: "PRESENT"
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'signatures',
    timestamps: false,
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
        name: "signatures_studentId_courseId_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "studentId" },
          { name: "courseId" },
        ]
      },
      {
        name: "idx_signatures_student",
        using: "BTREE",
        fields: [
          { name: "studentId" },
        ]
      },
      {
        name: "idx_signatures_course",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
    ]
  });
};
